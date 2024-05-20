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
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { SortingService } from '../../services/sorting/SortingService'
import { PathUtils } from '../../utils/PathUtils'
import StringUtils from '../../utils/StringUtils'
import InputNumberField from '../InputNumberFieldComponent.vue'
import ItemContent from '../ItemContentComponent.vue'
import ItemMods from '../ItemModsComponent.vue'
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
    SelectedItem,
    SelectedItemFunctionalities,
    SelectedItemSummarySelector,
    StatsSelector,
    SummarySelector
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
    inventoryItem: {
      type: Object as PropType<IInventoryItem | undefined>,
      required: false,
      default: undefined
    },
    maxStackableAmount: {
      type: Number,
      required: false,
      default: undefined
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:inventory-item'],
  setup: (props, { emit }) => {
    const compatibilityService = Services.get(CompatibilityService)
    const inventoryItemService = Services.get(InventoryItemService)
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const itemService = Services.get(ItemService)
    const presetService = Services.get(PresetService)

    const editing = inject<Ref<boolean>>('editing')

    const canIgnorePrice = computed(() => presetModSlotContainingItem.value?.item?.itemId !== item.value?.id)
    const contentCount = computed(() => inventoryItemInternal.value?.content.length ?? 0)
    const dropdownPanelHeight = computed(() => Math.min(options.value.length === 0 ? 1 : options.value.length, 5) * 4 + 'rem') // Shows 5 items or less
    const inventoryItemInternal = computed<IInventoryItem | undefined>({
      get: () => props.inventoryItem,
      set: (value: IInventoryItem | undefined) => emit('update:inventory-item', value)
    })
    const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? item.value?.maxStackableAmount ?? 1)
    const modsCount = computed(() => inventoryItemInternal.value?.modSlots.filter(ms => ms.item != null).length ?? 0)
    const optionHeight = computed(() => Number.parseInt(window.getComputedStyle(document.documentElement).fontSize.replace('px', '')) * 4)

    const item = ref<IItem | undefined>()
    const itemChanging = ref(false)
    const itemIsContainer = ref(false)
    const itemIsModdable = ref(false)
    const options = ref<IItem[]>([])
    const optionsFilter = ref('')
    const optionsSortingData = ref(new SortingData<IItem>())
    const presetModSlotContainingItem = ref<IInventoryModSlot>()
    const quantity = ref(props.inventoryItem?.quantity ?? 1)
    const selectedTab = ref(SelectableTab.hidden)
    const showStats = ref(false)

    watch(() => props.acceptedItems, () => onFilterOptions(optionsFilter.value))
    watch(() => props.inventoryItem?.itemId, () => initializeItem())
    watch(() => props.inventoryItem?.quantity, () => quantity.value = props.inventoryItem?.quantity ?? 0)
    watch(
      () => item.value?.id,
      () => {
        if (item.value?.id != null) {
          // When an item is not found, but has mods or content, we consider it is moddable / a container in order to be able to display its possible child items
          itemIsModdable.value = itemPropertiesService.canBeModded(item.value)
            || (item.value.categoryId === 'notFound' && (props.inventoryItem?.modSlots.length ?? 0) > 0)
          itemIsContainer.value = itemPropertiesService.canContain(item.value)
            || (item.value.categoryId === 'notFound' && (props.inventoryItem?.content.length ?? 0) > 0)

          if (selectedTab.value === SelectableTab.hidden) {
            if (itemIsContainer.value) {
              selectedTab.value = SelectableTab.content
            } else if (itemIsModdable.value) {
              selectedTab.value = SelectableTab.mods
            } else {
              selectedTab.value = SelectableTab.hidden
            }
          }
        } else {
          itemIsModdable.value = false
          itemIsContainer.value = false
          selectedTab.value = SelectableTab.hidden
        }
      })

    onMounted(() => {
      setOptions(optionsFilter.value, optionsSortingData.value)
      initializeItem()
    })

    /**
     * Emits an event for the build and the inventory slot to updated their summary when the item changes.
     */
    function emitItemChangedEvent() {
      nextTick(() => inventoryItemService.emitter.emit(InventoryItemService.inventoryItemChangeEvent, props.path))
    }

    /**
     * Initializes the item based on the inventory item passed to the component.
     */
    async function initializeItem() {
      if (props.inventoryItem == null) {
        quantity.value = 0
        item.value = undefined

        return
      }

      if (item.value?.id === inventoryItemInternal.value?.itemId) {
        return
      }

      item.value = await itemService.getItem(props.inventoryItem.itemId)
      quantity.value = props.inventoryItem.quantity
      presetModSlotContainingItem.value = presetService.getPresetModSlotContainingItem(item.value.id, props.path)
    }

    /**
     * Scrolls to the item in the item dropdown.
     */
    function onDropdownOpen() {
      if (item.value == null) {
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
      scrollToItemInDropdown()
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
      if (inventoryItemInternal.value == null) {
        return
      }

      inventoryItemInternal.value.quantity = newQuantity

      // Emitting an event for the build and the inventory slot to updated their summary
      emitItemChangedEvent()
    }

    /**
     * Updates the inventory item based on the selected item.
     */
    async function onItemChanged() {
      if (item.value?.id === inventoryItemInternal.value?.itemId) {
        return
      }

      if (item.value == null) {
        quantity.value = 0
        inventoryItemInternal.value = undefined

        // Emitting an event for the build and the inventory slot to updated their summary
        emitItemChangedEvent()

        return
      }

      itemChanging.value = true
      presetModSlotContainingItem.value = presetService.getPresetModSlotContainingItem(item.value.id, props.path)

      if (itemPropertiesService.isModdable(item.value) && PathUtils.checkIsModSlotPath(props.path)) {
        // Checking the compatibility if the selected item is a mod and we are in mod slot
        const path = props.path.slice(0, props.path.lastIndexOf('/' + PathUtils.itemPrefix))
        const compatibilityResult = await compatibilityService.checkCompatibility(CompatibilityRequestType.mod, item.value.id, path)

        updateInventoryItem(item.value, compatibilityResult)
      } else {
        updateInventoryItem(item.value, true)
      }
    }

    /**
     * Sorts the options items.
     */
    async function onSortOptions(newSortingData: SortingData<IItem>) {
      const currentOptions = [...options.value] // Creating a new array because options.value can be updated while this function is being executed
      optionsSortingData.value = newSortingData
      options.value = await SortingService.sort(currentOptions, optionsSortingData.value)

      scrollToItemInDropdown()
    }

    /**
     * Removes the selected item.
     * @param event - Click event.
     */
    async function removeItem(event: MouseEvent) {
      event.stopPropagation()

      item.value = undefined
      await onItemChanged()
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
    function scrollToItemInDropdown() {
      if (item.value == null) {
        return
      }

      const itemPosition = options.value.findIndex(o => o.id === item.value!.id)
      const itemXPositionInDropdown = itemPosition * optionHeight.value

      const virtualScrollerElement = document.querySelector('.p-virtualscroller')
      virtualScrollerElement?.scrollTo({ behavior: 'smooth', top: itemXPositionInDropdown })
    }

    /**
     * Updates the inventory item based on a new selected item if it is compatible; otherwise puts back the previous selected item.
     * @param newItem - New selected item.
     * @param compatibilityCheckResult - Indicates whether the new selected item is compatible or not.
     */
    function updateInventoryItem(newItem: IItem, compatibilityCheckResult: boolean) {
      if (!compatibilityCheckResult) {
        initializeItem() // Putting back the previous selected item when the new item is incomptatible
      } else {
        quantity.value = maxSelectableQuantity.value
        const ignorePrice = inventoryItemInternal.value?.ignorePrice ?? false

        // Keeping the old item content if the new item is a container
        const newContent: IInventoryItem[] = []
        const newItemIsContainer = itemPropertiesService.canContain(newItem)

        if (newItemIsContainer
          && inventoryItemInternal.value != null
          && inventoryItemInternal.value.content.length > 0) {
          const newItemIsMagazine = itemPropertiesService.isMagazine(newItem)

          if (newItemIsMagazine) {
            const magazine = (newItem as IMagazine)

            for (const ammunitionInventoryItem of inventoryItemInternal.value.content) {
              const isCompatible = magazine.acceptedAmmunitionIds.some(aci => aci === ammunitionInventoryItem.itemId)

              if (isCompatible) {
                ammunitionInventoryItem.quantity = magazine.capacity
                newContent.push(ammunitionInventoryItem)
              }
            }
          } else {
            newContent.push(...inventoryItemInternal.value.content)
          }
        }

        // Setting the preset content and mods when the newly selected item is a preset
        const preset = presetService.getPreset(newItem.id)

        if (preset != null) {
          // Creating a copy of the preset, otherwise the preset is modified for the whole application
          const newSelectedInventoryItem = JSON.parse(JSON.stringify(preset)) as IInventoryItem
          newSelectedInventoryItem.content = newContent
          newSelectedInventoryItem.ignorePrice = ignorePrice
          inventoryItemInternal.value = newSelectedInventoryItem
        } else {
          inventoryItemInternal.value = {
            content: newContent,
            ignorePrice,
            itemId: newItem.id,
            modSlots: [],
            quantity: quantity.value
          }
        }

        emitItemChangedEvent()
      }

      itemChanging.value = false
    }

    return {
      canIgnorePrice,
      contentCount,
      dropdownPanelHeight,
      editing,
      inventoryItemInternal,
      item,
      itemChanging,
      itemIsContainer,
      itemIsModdable,
      maxSelectableQuantity,
      modsCount,
      onDropdownOpen,
      onFilterOptions,
      onIgnorePriceChanged,
      onItemChanged,
      onQuantityChanged,
      onSortOptions,
      optionHeight,
      options,
      optionsFilter,
      optionsSortingData,
      presetModSlotContainingItem,
      quantity,
      removeItem,
      SelectableTab,
      selectedTab,
      showStats
    }
  }
})
