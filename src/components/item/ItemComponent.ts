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
import { IMagazine } from '../../models/item/IMagazine'

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
    acceptedItemsCategoryId: {
      type: String,
      required: false,
      default: undefined
    },
    canBeLooted: {
      type: Boolean,
      required: false,
      default: true
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

    const editing = inject<Ref<boolean>>('editing')

    const dropdownPanelHeight = computed(() => Math.min(options.value.length === 0 ? 1 : options.value.length, 5) * 4 + 'rem') // Shows 5 items or less
    const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? selectedItem.value?.maxStackableAmount ?? 1)
    const selectedInventoryItem = computed<IInventoryItem | undefined>({
      get: () => props.modelValue,
      set: (value: IInventoryItem | undefined) => emit('update:modelValue', value)
    })

    const itemChanging = ref(false)
    const options = ref<IItem[]>([])
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

      if (selectedItemResult.success) {
        selectedItem.value = selectedItemResult.value
      } else {
        selectedItem.value = undefined
      }

      setSelectedTab()

      if (selectedItem.value != null) {
        preset.value = await presetService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)
      } else {
        preset.value = undefined
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
     * Sets an item as an option if it matches the filter.
     * @param acceptedItem - Item that must set as an options.
     * @param filterWords - Filter words.
     * @param options - Option list in which the item mus be added.
     */
    async function setOption(acceptedItem: IItem, filterWords: string[], options: IItem[]) {
      let contains = await StringUtils.containsAll(acceptedItem.shortName, filterWords)

      if (contains) {
        options.push(acceptedItem)

        return
      }

      contains = await StringUtils.containsAll(acceptedItem.name, filterWords)

      if (contains) {
        options.push(acceptedItem)
      }
    }

    /**
     * Sets the options selectable in the drop down input.
     * @param filter - Filter.
     * @param sortingData - Sorting data.
     */
    async function setOptions(filter: string, sortingData: SortingData<IItem>) {
      let newOptions: IItem[] = []

      if (filter === '') {
        newOptions = [...props.acceptedItems]
      } else {
        const filterWords = filter.split(' ')
        const promises: Promise<void>[] = []

        for (const acceptedItem of props.acceptedItems) {
          promises.push(setOption(acceptedItem, filterWords, newOptions))
        }

        await Promise.allSettled(promises)
      }

      options.value = newOptions
      onSortOptions(sortingData)
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
          quantity.value = maxSelectableQuantity.value

          // Keeping the old item content if the new item is a container
          const newContent: IInventoryItem[] = []
          const newSelectedItemIsContainer = itemPropertiesService.canContain(newSelectedItem)

          if (newSelectedItemIsContainer
            && selectedInventoryItem.value != null
            && selectedInventoryItem.value.content.length > 0) {
            const newSelectedItemIsMagazine = itemPropertiesService.isMagazine(newSelectedItem)

            if (newSelectedItemIsMagazine) {
              const magazine = (newSelectedItem as IMagazine)

              for (const ammunitionInventoryItem of selectedInventoryItem.value.content) {
                const isCompatible = magazine.acceptedAmmunitionIds.some(aci => aci === ammunitionInventoryItem.itemId)

                if (isCompatible) {
                  ammunitionInventoryItem.quantity = magazine.capacity
                  newContent.push(ammunitionInventoryItem)
                }
              }
            } else {
              newContent.push(...selectedInventoryItem.value.content)
            }
          }

          selectedInventoryItem.value = {
            content: newContent,
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
      dropdownPanelHeight,
      editing,
      itemChanging,
      maxSelectableQuantity,
      onFilterOptions,
      onIgnorePriceChanged,
      onQuantityChanged,
      onSelectedItemChanged,
      onSortOptions,
      options,
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
