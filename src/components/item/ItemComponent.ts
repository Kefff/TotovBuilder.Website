import { computed, defineComponent, inject, nextTick, onMounted, PropType, Ref, ref, watch } from 'vue'
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
import { PresetService } from '../../services/PresetService'

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
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const itemService = Services.get(ItemService)
    const presetService = Services.get(PresetService)
    const notificationService = Services.get(NotificationService)

    const optionsMaxNumber = 200

    const editing = inject<Ref<boolean>>('editing')

    const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? selectedItem.value?.maxStackableAmount ?? 1)
    const optionsCategory = computed(() => props.categoryIds.length === 1 ? props.categoryIds[0] : 'item') // When items from multiple categories can be selected, components use the base type IItem for compatibility
    const selectedInventoryItem = computed<IInventoryItem | undefined>({
      get: () => props.modelValue,
      set: (value: IInventoryItem | undefined) => emit('update:modelValue', value)
    })

    const itemChanging = ref(false)
    const options = ref<IItem[]>([])
    const optionsEmptyMessage = ref<string>('message.noItemsFound')
    const optionsFilter = ref('')
    const optionsSortingData = ref(new SortingData<IItem>())
    const quantity = ref(props.modelValue?.quantity ?? 1)
    const preset = ref<IInventoryModSlot>()
    const selectedItem = ref<IItem | undefined>()
    const selectedItemIsContainer = ref(false)
    const selectedItemIsModdable = ref(false)
    const selectedTab = ref(SelectableTab.hidden)

    watch(() => props.acceptedItems, () => onFilterOptions(optionsFilter.value))
    watch(() => props.modelValue?.itemId, () => initializeSelectedItem())
    watch(() => props.modelValue?.quantity, () => quantity.value = props.modelValue?.quantity ?? 0)

    onMounted(() => {
      setOptions(optionsFilter.value, optionsSortingData.value)
      initializeSelectedItem()
    })

    /**
     * Emits an event for the build and the inventory slot to updated their summary.
     */
    function emitItemChangedEvent() {
      nextTick(() => inventoryItemService.emitter.emit(InventoryItemService.inventoryItemChangeEvent, props.path))
    }

    /**
     * Initializes the selected item based on the inventory item passed to the component.
     */
    async function initializeSelectedItem() {
      if (props.modelValue == null) {
        quantity.value = 0
        selectedItem.value = undefined
        selectedItemIsContainer.value = false
        selectedItemIsModdable.value = false

        return
      }

      if (selectedItem.value?.id === selectedInventoryItem.value?.itemId) {
        return
      }

      quantity.value = props.modelValue.quantity

      const selectedItemResult = await itemService.getItem(props.modelValue.itemId)

      if (!selectedItemResult.success) {
        notificationService.notify(NotificationType.error, selectedItemResult.failureMessage)

        return
      }

      selectedItem.value = selectedItemResult.value
      setSelectedTab()

      if (selectedItem.value != null) {
        preset.value = await presetService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)
      }
    }

    /**
     * Sorts the options items.
     */
    function onFilterOptions(newValue: string) {
      optionsFilter.value = newValue
      setOptions(newValue, optionsSortingData.value)
    }

    /**
     * Updates the inventory item based on the fact that the price is ignored or not.
     */
    function onIgnorePriceChanged() {
      // Emitting an event for the build and the inventory slot to updated their summary
      emitItemChangedEvent()
    }

    /**
     * Updates the inventory item based on the quantity.
     */
    function onQuantityChanged(newQuantity: number) {
      if (selectedInventoryItem.value == null) {
        return
      }

      selectedInventoryItem.value.quantity = newQuantity

      // Emitting an event for the build and the inventory slot to updated their summary
      emitItemChangedEvent()
    }

    /**
     * Updates the inventory item based on the selected item.
     */
    async function onSelectedItemChanged() {
      if (selectedItem.value?.id === selectedInventoryItem.value?.itemId) {
        return
      }

      if (selectedItem.value == null) {
        quantity.value = 0
        selectedInventoryItem.value = undefined
        selectedItemIsContainer.value = false
        selectedItemIsModdable.value = false

        // Emitting an event for the build and the inventory slot to updated their summary
        emitItemChangedEvent()

        return
      }

      itemChanging.value = true
      preset.value = await presetService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)

      if (itemPropertiesService.isModdable(selectedItem.value) && PathUtils.checkIsModSlotPath(props.path)) {
        // Checking the compatibility if the selected item is a mod and we are in mod slot
        const path = props.path.slice(0, props.path.lastIndexOf('/' + PathUtils.itemPrefix))
        const compatibilityResult = await compatibilityService.checkCompatibility(CompatibilityRequestType.mod, selectedItem.value.id, path)

        await updateInventoryItem(selectedItem.value, compatibilityResult)
      } else {
        await updateInventoryItem(selectedItem.value, Result.ok())
      }
    }

    /**
     * Sorts the options items.
     */
    async function onSortOptions(newSortingData: SortingData<IItem>) {
      const currentOptions = [...options.value] // Creating a new array because options.value can be updated while this function is being executed
      optionsSortingData.value = newSortingData
      options.value = await SortingService.sort(currentOptions, optionsSortingData.value)
    }

    /**
     * Sets the options selectable in the drop down input.
     * When more than x items are found, displays a message asking the user to filter.
     * @param filter - Filter.
     * @param sortingData - Sorting data.
     */
    function setOptions(filter: string, sortingData: SortingData<IItem>) {
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
        optionsEmptyMessage.value = 'message.noItemsFound'
        onSortOptions(sortingData)
      }
    }

    /**
     * Sets the selected tab based on the selected item.
     */
    function setSelectedTab() {
      if (selectedItem.value == null) {
        selectedTab.value = SelectableTab.hidden

        return
      }

      selectedItemIsModdable.value = itemPropertiesService.canBeModded(selectedItem.value)
      selectedItemIsContainer.value = itemPropertiesService.canContain(selectedItem.value)

      if (selectedItemIsModdable.value) {
        selectedTab.value = SelectableTab.mods
      } else if (selectedItemIsContainer.value) {
        selectedTab.value = SelectableTab.content
      }
    }

    /**
     * Updates the inventory item based on a new selected item if it is compatible; otherwise puts back the previous selected item.
     * @param newSelectedItem - New selected item.
     * @param isCompatible - Indicates whether the new selected item is compatible or not.
     */
    async function updateInventoryItem(newSelectedItem: IItem, isCompatible: Result) {
      if (isCompatible.success) {
        const preset = presetService.getPreset(newSelectedItem.id)

        if (preset != null) {
          // Creating a new object, otherwise the preset itself in the application presets list is modified when we change the selected item mods and content in the build
          selectedInventoryItem.value = JSON.parse(JSON.stringify(preset))
        } else {
          if (quantity.value === 0
            || props.forceQuantityToMaxSelectableAmount
            || quantity.value > maxSelectableQuantity.value) {
            quantity.value = maxSelectableQuantity.value
          }

          selectedInventoryItem.value = {
            content: [],
            ignorePrice: false,
            itemId: newSelectedItem.id,
            modSlots: [],
            quantity: quantity.value
          }
        }

        emitItemChangedEvent()
        setSelectedTab()
      } else {
        notificationService.notify(NotificationType.warning, isCompatible.failureMessage, true)
        initializeSelectedItem() // Putting back the previous selected item
      }

      itemChanging.value = false
    }

    return {
      editing,
      itemChanging,
      maxSelectableQuantity,
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
      selectedInventoryItem,
      selectedItem,
      selectedItemIsContainer,
      selectedItemIsModdable,
      selectedTab
    }
  }
})
