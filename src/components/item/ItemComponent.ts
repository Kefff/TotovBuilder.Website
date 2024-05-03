import { computed, defineComponent, inject, nextTick, onMounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { SelectableTab } from '../../models/utils/SelectableTab'
import SortingData from '../../models/utils/SortingData'
import { CompatibilityRequestType } from '../../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../../services/compatibility/CompatibilityService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { SortingService } from '../../services/sorting/SortingService'
import { PathUtils } from '../../utils/PathUtils'
import Result from '../../utils/Result'
import StringUtils from '../../utils/StringUtils'
import InputNumberField from '../input-number-field/InputNumberFieldComponent.vue'
import ItemContent from '../item-content/ItemContentComponent.vue'
import ItemMods from '../item-mods/ItemModsComponent.vue'
import OptionHeaderSelector from '../option-header/selector/OptionHeaderSelectorComponent.vue'
import SelectedItemFunctionalities from '../selected-item-functionalities/SelectedItemFunctionalitiesComponent.vue'
import SelectedItemSummarySelector from '../selected-item-summary/selector/SelectedItemSummarySelectorComponent.vue'
import SelectedItem from '../selected-item/SelectedItemComponent.vue'
import StatsSelector from '../stats/selector/StatsSelectorComponent.vue'
import SummarySelector from '../summary/selector/SummarySelectorComponent.vue'

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

    const canIgnorePrice = computed(() => presetModSlotContainingItem.value?.item?.itemId !== selectedItem.value?.id)
    const dropdownPanelHeight = computed(() => Math.min(options.value.length === 0 ? 1 : options.value.length, 5) * 4 + 'rem') // Shows 5 items or less
    const optionHeight = computed(() => Number.parseInt(window.getComputedStyle(document.documentElement).fontSize.replace('px', '')) * 4)
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
    const presetModSlotContainingItem = ref<IInventoryModSlot>()
    const selectedItem = ref<IItem | undefined>()
    const selectedItemIsContainer = ref(false)
    const selectedItemIsModdable = ref(false)
    const selectedTab = ref(SelectableTab.hidden)
    const showStats = ref(false)

    watch(() => props.acceptedItems, () => onFilterOptions(optionsFilter.value))
    watch(() => props.modelValue?.itemId, () => initializeSelectedItem())
    watch(() => props.modelValue?.quantity, () => quantity.value = props.modelValue?.quantity ?? 0)
    watch(
      () => selectedItem.value?.id,
      () => {
        if (selectedItem.value?.id != null) {
          selectedItemIsModdable.value = itemPropertiesService.canBeModded(selectedItem.value)
          selectedItemIsContainer.value = itemPropertiesService.canContain(selectedItem.value)

          if (selectedTab.value === SelectableTab.hidden) {
            if (selectedItemIsContainer.value) {
              selectedTab.value = SelectableTab.content
            } else if (selectedItemIsModdable.value) {
              selectedTab.value = SelectableTab.mods
            } else {
              selectedTab.value = SelectableTab.hidden
            }
          }
        } else {
          selectedItemIsModdable.value = false
          selectedItemIsContainer.value = false
          selectedTab.value = SelectableTab.hidden
        }
      })

    onMounted(() => {
      setOptions(optionsFilter.value, optionsSortingData.value)
      initializeSelectedItem()
    })

    /**
     * Emits an event for the build and the inventory slot to updated their summary when the selected item changes.
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

        return
      }

      if (selectedItem.value?.id === selectedInventoryItem.value?.itemId) {
        return
      }

      selectedItem.value = await itemService.getItem(props.modelValue.itemId)
      quantity.value = props.modelValue.quantity

      if (selectedItem.value != null) {
        presetModSlotContainingItem.value = await presetService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)
      } else {
        presetModSlotContainingItem.value = undefined
      }
    }

    /**
     * Scrolls to the selected item in the item dropdown.
     */
    function onDropdownOpen() {
      if (selectedItem.value == null) {
        return
      }

      // Hack for scrolling to the selected item when opening an item dropdown.
      // Needed because PrimeVue VirtualScroller automatically loads 12 items when opening.
      // Those 12 items a considered visible, therefore no scroll happens.
      // However, since we only display 5 elements, we cannot see element 6 to 12.
      // If the selected item is the 13th or higher, then the PrimeVue correctly scrolls to the item.
      // The PrimeVue behaviour can be "controled" by playing with the options height and the dropdown panel height
      // but I could not find a good combination of values for reducing the number of loaded elements
      // while avoiding having white space displayed in the dropdown panel.
      // Hence this hack.
      scrollToSelectedItemInDropdown()
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

        // Emitting an event for the build and the inventory slot to updated their summary
        emitItemChangedEvent()

        return
      }

      itemChanging.value = true
      presetModSlotContainingItem.value = await presetService.getPresetModSlotContainingItem(selectedItem.value.id, props.path)

      if (itemPropertiesService.isModdable(selectedItem.value) && PathUtils.checkIsModSlotPath(props.path)) {
        // Checking the compatibility if the selected item is a mod and we are in mod slot
        const path = props.path.slice(0, props.path.lastIndexOf('/' + PathUtils.itemPrefix))
        const compatibilityResult = await compatibilityService.checkCompatibility(CompatibilityRequestType.mod, selectedItem.value.id, path)

        updateInventoryItem(selectedItem.value, compatibilityResult)
      } else {
        updateInventoryItem(selectedItem.value, Result.ok())
      }
    }

    /**
     * Sorts the options items.
     */
    async function onSortOptions(newSortingData: SortingData<IItem>) {
      const currentOptions = [...options.value] // Creating a new array because options.value can be updated while this function is being executed
      optionsSortingData.value = newSortingData
      options.value = await SortingService.sort(currentOptions, optionsSortingData.value)

      scrollToSelectedItemInDropdown()
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
     * Scrolls the dropdown to the selected item.
     */
    function scrollToSelectedItemInDropdown() {
      if (selectedItem.value == null) {
        return
      }

      const selectedItemPosition = options.value.findIndex(o => o.id === selectedItem.value!.id)
      const selectedItemXPositionInDropdown = selectedItemPosition * optionHeight.value

      const virtualScrollerElement = document.querySelector('.p-virtualscroller')
      virtualScrollerElement?.scrollTo({ behavior: 'smooth', top: selectedItemXPositionInDropdown })
    }

    /**
     * Updates the inventory item based on a new selected item if it is compatible; otherwise puts back the previous selected item.
     * @param newSelectedItem - New selected item.
     * @param compatibilityCheckResult - Indicates whether the new selected item is compatible or not.
     */
    function updateInventoryItem(newSelectedItem: IItem, compatibilityCheckResult: Result) {
      if (compatibilityCheckResult.success) {
        quantity.value = maxSelectableQuantity.value
        const ignorePrice = selectedInventoryItem.value?.ignorePrice ?? false

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

        // Setting the preset content and mods when the newly selected item is a preset
        const preset = presetService.getPreset(newSelectedItem.id)

        if (preset != null) {
          // Creating a copy of the preset, otherwise the preset is modified for the whole application
          const newSelectedInventoryItem = JSON.parse(JSON.stringify(preset)) as IInventoryItem
          newSelectedInventoryItem.content = newContent
          newSelectedInventoryItem.ignorePrice = ignorePrice
          selectedInventoryItem.value = newSelectedInventoryItem
        } else {
          selectedInventoryItem.value = {
            content: newContent,
            ignorePrice,
            itemId: newSelectedItem.id,
            modSlots: [],
            quantity: quantity.value
          }
        }

        emitItemChangedEvent()
      } else {
        notificationService.notify(NotificationType.warning, compatibilityCheckResult.failureMessage)
        initializeSelectedItem() // Putting back the previous selected item
      }

      itemChanging.value = false
    }

    return {
      canIgnorePrice,
      dropdownPanelHeight,
      editing,
      itemChanging,
      maxSelectableQuantity,
      onDropdownOpen,
      onFilterOptions,
      onIgnorePriceChanged,
      onQuantityChanged,
      onSelectedItemChanged,
      onSortOptions,
      optionHeight,
      options,
      optionsFilter,
      optionsSortingData,
      presetModSlotContainingItem,
      quantity,
      SelectableTab,
      selectedInventoryItem,
      selectedItem,
      selectedItemIsContainer,
      selectedItemIsModdable,
      selectedTab,
      showStats
    }
  }
})
