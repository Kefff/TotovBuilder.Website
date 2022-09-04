import { computed, defineComponent, inject, onMounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem } from '../../models/item/IItem'
import { ItemService } from '../../services/ItemService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import StatsSelector from '../stats/selector/StatsSelectorComponent.vue'
import SelectedItemFunctionalities from '../selected-item-functionalities/SelectedItemFunctionalitiesComponent.vue'
import SelectedItem from '../selected-item/SelectedItemComponent.vue'
import OptionHeaderSelector from '../option-header/selector/OptionHeaderSelectorComponent.vue'
import SummarySelector from '../summary/selector/SummarySelectorComponent.vue'
import SortingData from '../../models/utils/SortingData'
import StringUtils from '../../utils/StringUtils'
import { SortingService } from '../../services/sorting/SortingService'
import ItemContent from '../item-content/ItemContentComponent.vue'
import ItemMods from '../item-mods/ItemModsComponent.vue'
import InputNumberField from '../input-number-field/InputNumberFieldComponent.vue'
import { CompatibilityService } from '../../services/compatibility/CompatibilityService'
import { CompatibilityRequestType } from '../../services/compatibility/CompatibilityRequestType'
import Result from '../../utils/Result'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import SelectedItemSummarySelector from '../selected-item-summary/selector/SelectedItemSummarySelectorComponent.vue'
import { SelectableTab } from '../../models/utils/SelectableTab'
import { InventoryItemService } from '../../services/InventoryItemService'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { PathUtils } from '../../utils/PathUtils'

export default defineComponent({
  components: {
    InputNumberField,
    ItemContent,
    ItemMods,
    OptionHeaderSelector,
    SummarySelector,
    SelectedItem,
    SelectedItemSummarySelector,
    StatsSelector,
    SelectedItemFunctionalities
  },
  props: {
    acceptedItems: {
      type: Array as PropType<IItem[]>,
      required: true
    },
    canBeLooted: {
      type: Boolean,
      required: false,
      default: true
    },
    categoryIds: {
      type: Array as PropType<string[]>,
      required: true
    },
    forceQuantityToMaxSelectableAmount: {
      type: Boolean,
      required: false,
      default: false
    },
    maxStackableAmount: {
      type: Number,
      required: false,
      default: undefined
    },
    path: {
      type: String,
      required: true
    },
    modelValue: {
      type: Object as PropType<IInventoryItem | undefined>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const compatibilityService = Services.get(CompatibilityService)
    const inventoryItemService = Services.get(InventoryItemService)
    const itemService = Services.get(ItemService)
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const notificationService = Services.get(NotificationService)

    const editing = inject<Ref<boolean>>('editing')

    const inventoryItem = computed({
      get: () => props.modelValue,
      set: (value: IInventoryItem | undefined) => emit('update:modelValue', value)
    })

    const optionsCategory = computed(() => props.categoryIds.length === 1 ? props.categoryIds[0] : 'item') // When items from multiple categories can be selected, components use the base type IItem for compatibility
    const optionsFilter = ref('')
    const optionsMaxNumber = 200
    const optionsEmptyMessage = ref<string>('message.itemsNotFound')
    const optionsSortingData = ref<SortingData>(new SortingData())
    const options = ref<IItem[]>([])

    const selectedItem = ref<IItem | undefined>()
    const itemChanging = ref(false)

    const ignorePrice = ref(false)

    const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? selectedItem.value?.maxStackableAmount ?? 1)
    const quantity = ref(props.modelValue?.quantity ?? 1)

    const selectedItemIsModdable = ref(false)
    const selectedItemIsContainer = ref(false)
    const selectedTab = ref(SelectableTab.hidden)

    const contentPathPrefix = PathUtils.contentPrefix
    const modSlotPathPrefix = PathUtils.modSlotPrefix

    const preset = ref<IInventoryModSlot>()

    watch(() => props.acceptedItems, () => onFilterOptions(optionsFilter.value))

    watch(() => props.modelValue, () => setSelectedItem())

    watch(() => props.forceQuantityToMaxSelectableAmount, () => {
      if (props.forceQuantityToMaxSelectableAmount && quantity.value !== maxSelectableQuantity.value) {
        quantity.value = maxSelectableQuantity.value
      }
    })

    watch(() => maxSelectableQuantity.value, () => {
      if (props.forceQuantityToMaxSelectableAmount || quantity.value > maxSelectableQuantity.value) {
        quantity.value = maxSelectableQuantity.value
      }
    })

    onMounted(() => {
      setOptions(optionsFilter.value, optionsSortingData.value)
      setSelectedItem()
    })

    /**
     * Sorts the options items.
     */
    function onFilterOptions(newValue: string) {
      optionsFilter.value = newValue
      setOptions(newValue, optionsSortingData.value)
    }

    /**
     * Updates the inventory item based on the ignored price value.
     */
    async function onIgnorePriceChanged(newIgnorePrice: boolean) {
      if (inventoryItem.value === undefined) {
        return
      }

      inventoryItem.value = {
        content: inventoryItem.value.content,
        ignorePrice: newIgnorePrice,
        itemId: inventoryItem.value.itemId,
        modSlots: inventoryItem.value.modSlots,
        quantity: inventoryItem.value.quantity
      }
    }

    /**
     * Updates the inventory item based on the quantity.
     */
    async function onQuantityChanged(newQuantity: number) {
      if (inventoryItem.value === undefined) {
        return
      }

      inventoryItem.value.quantity = newQuantity
    }

    /**
     * Updates the inventory item based on the selected item.
     */
    async function onSelectedItemChanged() {
      if (selectedItem.value?.id === props.modelValue?.itemId) {
        return
      }

      if (selectedItem.value == undefined) {
        selectedItem.value = undefined
        inventoryItem.value = undefined
        ignorePrice.value = false
        quantity.value = 0

        return
      }

      itemChanging.value = true

      preset.value = await inventoryItemService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)

      if (itemPropertiesService.isMod(selectedItem.value) && PathUtils.checkIsModSlotPath(props.path)) {
        // Checking the compatibility if the selected item is a mod and we are in mod slot
        const path = props.path.slice(0, props.path.lastIndexOf('/' + PathUtils.itemPrefix))
        compatibilityService.checkCompatibility(CompatibilityRequestType.mod, selectedItem.value.id, path)
          .then((v) => updateInventoryItem(selectedItem.value as IItem, v))
      } else {
        updateInventoryItem(selectedItem.value as IItem, Result.ok())
      }
    }

    /**
     * Sorts the options items.
     */
    async function onSortOptions(newValue: SortingData) {
      const currentOptions = [...options.value] // Creating a new array because options.value can be updated while this function is being executed
      optionsSortingData.value = newValue
      const sortedOptions: IItem[] = []

      const itemCategories = await itemService.getItemCategories()

      for (const itemCategory of itemCategories) {
        let optionsOfCategory = currentOptions.filter((o) => o.categoryId === itemCategory.id)
        optionsOfCategory = await SortingService.sort(optionsOfCategory, newValue)
        sortedOptions.push(...optionsOfCategory)
      }

      options.value = sortedOptions
    }

    /**
     * Sets the options selectable in the drop down input.
     * When more than x items are found, displays a message asking the user to filter.
     * @param filter - Filter.
     * @param sortingData - Sorting data.
     */
    function setOptions(filter: string, sortingData: SortingData) {
      let newOptions: IItem[]

      if (filter === '') {
        newOptions = [...props.acceptedItems]
      } else {
        newOptions = [...props.acceptedItems.filter((o) => StringUtils.contains(o.name, filter))]
      }

      if (newOptions.length > optionsMaxNumber) {
        optionsEmptyMessage.value = 'message.searchForItem'
        options.value = []
      } else {
        options.value = newOptions
        optionsEmptyMessage.value = 'message.itemsNotFound'
        onSortOptions(sortingData)
      }
    }

    /**
     * Sets the selected item based on the inventory item passed to the component.
     */
    async function setSelectedItem() {
      if (props.modelValue == undefined) {
        selectedItem.value = undefined
        ignorePrice.value = false
        quantity.value = 0
        selectedItemIsModdable.value = false
        selectedItemIsContainer.value = false

        return
      } else {
        const selectedItemResult = await itemService.getItem(props.modelValue.itemId)

        if (!selectedItemResult.success) {
          notificationService.notify(NotificationType.error, selectedItemResult.failureMessage)

          return
        }

        selectedItem.value = selectedItemResult.value
        ignorePrice.value = props.modelValue.ignorePrice

        if (props.modelValue.quantity === 0
          || props.forceQuantityToMaxSelectableAmount
          || quantity.value > maxSelectableQuantity.value) {
          quantity.value = maxSelectableQuantity.value
        } else {
          quantity.value = props.modelValue.quantity
        }
      }

      selectedItemIsModdable.value = itemPropertiesService.isModdable(selectedItem.value)
      selectedItemIsContainer.value = itemPropertiesService.isContainer(selectedItem.value)

      if (selectedItemIsModdable.value) {
        selectedTab.value = SelectableTab.mods
      } else if (selectedItemIsContainer.value) {
        selectedTab.value = SelectableTab.content
      }

      if (selectedItem.value != undefined) {
        preset.value = await inventoryItemService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)
      }
    }

    /**
     * Updates the inventory item based on a new selected item if it is compatible; otherwise puts back the previous selected item.
     * @param newSelectedItem - New selected item.
     * @param isCompatible - Indicates whether the new selected item is compatible or not.
     */
    async function updateInventoryItem(newSelectedItem: IItem, isCompatible: Result) {
      if (isCompatible.success) {
        const preset = await itemService.getPreset(newSelectedItem.id)

        if (preset !== undefined) {
          inventoryItem.value = preset
        } else {
          const updatedInventoryItem = {
            content: selectedItemIsContainer.value ? (inventoryItem.value?.content ?? []) : [], // Keeping the content of containers
            ignorePrice: false,
            itemId: newSelectedItem.id,
            modSlots: [],
            quantity: quantity.value
          } as IInventoryItem

          if (updatedInventoryItem.quantity === 0
            || props.forceQuantityToMaxSelectableAmount
            || updatedInventoryItem.quantity > maxSelectableQuantity.value) {
            updatedInventoryItem.quantity = maxSelectableQuantity.value
          }

          inventoryItem.value = updatedInventoryItem
        }
      } else {
        notificationService.notify(NotificationType.warning, isCompatible.failureMessage, true)
        setSelectedItem() // Putting back the previous selected item
      }

      itemChanging.value = false
    }

    return {
      contentPathPrefix,
      editing,
      ignorePrice,
      inventoryItem,
      itemChanging,
      maxSelectableQuantity,
      modSlotPathPrefix,
      onFilterOptions,
      onIgnorePriceChanged,
      onQuantityChanged,
      onSelectedItemChanged,
      onSortOptions,
      options,
      optionsCategory,
      optionsEmptyMessage,
      optionsFilter,
      optionsSortingData,
      preset,
      quantity,
      SelectableTab,
      selectedItem,
      selectedItemIsContainer,
      selectedItemIsModdable,
      selectedTab
    }
  }
})
