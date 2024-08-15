import { computed, defineComponent, inject, onMounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { IModdable } from '../../models/item/IModdable'
import { SelectableTab } from '../../models/utils/SelectableTab'
import SortingData from '../../models/utils/SortingData'
import { CompatibilityRequestType } from '../../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../../services/compatibility/CompatibilityService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { SortingService } from '../../services/sorting/SortingService'
import { PathUtils } from '../../utils/PathUtils'
import InputNumberField from '../InputNumberFieldComponent.vue'
import ItemContent from '../ItemContentComponent.vue'
import ItemMods from '../ItemModsComponent.vue'
import Loading from '../LoadingComponent.vue'
import OptionHeaderSelector from '../option-header/OptionHeaderSelectorComponent.vue'
import SelectedItem from '../SelectedItemComponent.vue'
import SelectedItemFunctionalities from '../SelectedItemFunctionalitiesComponent.vue'
import SelectedItemSummarySelector from '../summary/SelectedItemSummarySelectorComponent.vue'
import SummarySelector from '../summary/SummarySelectorComponent.vue'

export default defineComponent({
  components: {
    InputNumberField,
    ItemContent,
    ItemMods,
    Loading,
    OptionHeaderSelector,
    SelectedItem,
    SelectedItemFunctionalities,
    SelectedItemSummarySelector,
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
    isBaseItem: {
      type: Boolean,
      required: false,
      default: false
    },
    isMainInventorySlotItem: {
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
    }
  },
  emits: ['update:inventory-item'],
  setup: (props, { emit }) => {
    const _compatibilityService = Services.get(CompatibilityService)
    const _itemPropertiesService = Services.get(ItemPropertiesService)
    const _itemService = Services.get(ItemService)
    const _presetService = Services.get(PresetService)

    const baseItem = ref<IInventoryItem | undefined>()
    const includeModsAndContentInSummary = computed(() =>
      (itemIsModdable.value
        && baseItem.value != null
        && !props.isBaseItem)
      || (itemIsContainer.value
        && props.isMainInventorySlotItem))
    const isEditing = inject<Ref<boolean>>('isEditing')
    const item = ref<IItem | undefined>()
    const itemChanging = ref(false)
    const itemIsContainer = ref(false)
    const itemIsModdable = ref(false)
    const loadingOptions = ref(false)
    const neetToSetOptions = ref(true)
    const options = ref<IItem[]>([])
    const optionsFilter = ref('')
    const optionsSortingData = ref(new SortingData<IItem>())
    const presetModSlotContainingItem = ref<IInventoryModSlot>()
    const quantity = ref(props.inventoryItem?.quantity ?? 1)
    const selectedTab = ref(SelectableTab.hidden)
    const showBaseItemPrice = ref(false)
    const showPrice = ref(true)
    const showWeight = ref(true)

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

    watch(
      () => props.acceptedItems,
      () => neetToSetOptions.value = true)
    watch(
      () => props.inventoryItem?.itemId,
      () => initializeItem())
    watch(
      () => props.inventoryItem?.quantity,
      () => quantity.value = props.inventoryItem?.quantity ?? 0)
    watch(
      () => item.value?.id,
      () => setSelectedTab())

    onMounted(() => {
      initializeItem()
    })

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

      item.value = await _itemService.getItem(props.inventoryItem.itemId)
      quantity.value = props.inventoryItem.quantity
      presetModSlotContainingItem.value = _presetService.getPresetModSlotContainingItem(item.value.id, props.path)
      setBaseItem(item.value)
    }

    /**
     * Reacts to the inventory item content being changed.
     *
     * Updates the inventory item based on the contained items.
     */
    function onContentChanged(newContent: IInventoryItem[]) {
      if (inventoryItemInternal.value == null) {
        return
      }

      inventoryItemInternal.value = {
        content: newContent,
        ignorePrice: inventoryItemInternal.value.ignorePrice,
        itemId: inventoryItemInternal.value.itemId,
        modSlots: inventoryItemInternal.value.modSlots,
        quantity: inventoryItemInternal.value.quantity
      }
    }

    /**
     * Reacts to the items selection dropdown being opened.
     *
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
     * Reacts to the item selection filter being changed.
     *
     * Filters the options items.
     */
    function onFilterOptions(newValue: string) {
      optionsFilter.value = newValue
      neetToSetOptions.value = true
      setOptions()
    }

    /**
     * Reacts to the click on the item ignore price button.
     *
     * Updates the inventory item based on the fact that the price is ignored or not.
     */
    function onIgnorePriceChanged(newIgnorePrice: boolean) {
      if (inventoryItemInternal.value == null) {
        return
      }

      inventoryItemInternal.value = {
        content: inventoryItemInternal.value.content,
        ignorePrice: newIgnorePrice,
        itemId: inventoryItemInternal.value.itemId,
        modSlots: inventoryItemInternal.value.modSlots,
        quantity: inventoryItemInternal.value?.quantity
      }
    }

    /**
     * Reacts to the selected item being changed.
     *
     * Updates the inventory item based on the selected item.
     */
    async function onItemChanged() {
      if (item.value?.id === inventoryItemInternal.value?.itemId) {
        return
      }

      if (item.value == null) {
        quantity.value = 0
        inventoryItemInternal.value = undefined

        return
      }

      itemChanging.value = true
      presetModSlotContainingItem.value = _presetService.getPresetModSlotContainingItem(item.value.id, props.path)

      if (_itemPropertiesService.isModdable(item.value) && PathUtils.checkIsModSlotPath(props.path)) {
        // Checking the compatibility if the selected item is a mod and we are in mod slot
        const path = props.path.slice(0, props.path.lastIndexOf('/' + PathUtils.itemPrefix))
        const compatibilityResult = await _compatibilityService.checkCompatibility(CompatibilityRequestType.mod, item.value.id, path)

        updateInventoryItem(item.value, compatibilityResult)
      } else {
        updateInventoryItem(item.value, true)
      }
    }

    /**
     * Reacts to the inventory item mods being changed.
     *
     * Updates the inventory item based on the mods.
     */
    function onModsChanged(newModsSlots: IInventoryModSlot[]) {
      if (inventoryItemInternal.value == null) {
        return
      }

      inventoryItemInternal.value = {
        content: inventoryItemInternal.value.content,
        ignorePrice: inventoryItemInternal.value.ignorePrice,
        itemId: inventoryItemInternal.value.itemId,
        modSlots: newModsSlots,
        quantity: inventoryItemInternal.value.quantity
      }
    }

    /**
     * Reacts to the item quantity being changed.
     *
     * Updates the inventory item based on the quantity.
     */
    function onQuantityChanged(newQuantity: number) {
      if (inventoryItemInternal.value == null) {
        return
      }

      inventoryItemInternal.value = {
        content: inventoryItemInternal.value.content,
        ignorePrice: inventoryItemInternal.value.ignorePrice,
        itemId: inventoryItemInternal.value.itemId,
        modSlots: inventoryItemInternal.value.modSlots,
        quantity: newQuantity
      }
    }

    /**
     * Reacts to the click on an item selection sort button.
     *
     * Sorts the options items.
     */
    async function onSortOptions(newSortingData: SortingData<IItem>) {
      loadingOptions.value = true

      optionsSortingData.value = newSortingData
      const currentOptions = [...options.value] // Creating a new array because options.value can be updated while this function is being executed
      options.value = await Services.get(SortingService).sort(currentOptions, optionsSortingData.value)

      loadingOptions.value = false

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
     * Sets the base item.
     * This can correspond to the base item if the selected item is a preset.
     * This can also correspond to the item itselft if it is the base item of a preset.
     * @param item - Item from which we search the base item.
     */
    function setBaseItem(item: IItem) {
      if (_itemPropertiesService.isModdable(item) && !props.isBaseItem) {
        const moddable = item as IModdable
        let baseItemId = moddable.defaultPresetId == null ? moddable.baseItemId : moddable.id

        if (baseItemId == null
          && _itemPropertiesService.isHeadwear(moddable)
          && moddable.modSlots.length > 0) {
          // Special case for moddable helmets that for the most part do not have presets like weapons
          baseItemId = moddable.id
        }

        if (baseItemId != null) {
          baseItem.value = {
            content: [],
            ignorePrice: false,
            itemId: baseItemId,
            modSlots: [],
            quantity: 1
          }

          if (moddable.id === baseItemId) {
            // When the selected item is the same as the base item,
            // we display its price on the base item
            showBaseItemPrice.value = true
            showPrice.value = false
            showWeight.value = false
          } else {
            // When the selected item is a preset we display the price of the preset
            showBaseItemPrice.value = false
            showPrice.value = true
            showWeight.value = false
          }

          return
        }
      }

      baseItem.value = undefined
      showBaseItemPrice.value = true
      showPrice.value = true
      showWeight.value = true
    }

    /**
     * Sets the options selectable in the drop down input based on the current filter and sorting.
     */
    async function setOptions() {
      if (!neetToSetOptions.value) {
        return
      }

      neetToSetOptions.value = false
      loadingOptions.value = true

      if (optionsFilter.value === '') {
        options.value = [...props.acceptedItems]
      } else {
        const filteredOptions: IItem[] = []
        const promises: Promise<void>[] = []

        for (const acceptedItem of props.acceptedItems) {
          promises.push(new Promise(resolve => {
            const matchesFilter = _itemPropertiesService.checkMatchesFilter(acceptedItem, optionsFilter.value)

            if (matchesFilter) {
              filteredOptions.push(acceptedItem)
            }

            resolve()
          }))
        }

        await Promise.allSettled(promises)
        options.value = filteredOptions
        onSortOptions(optionsSortingData.value)
      }

      loadingOptions.value = false
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
     * Sets the selected tab based on the type of selected item.
     */
    function setSelectedTab() {
      if (item.value?.id != null) {
        // When an item is not found, but has mods or content, we consider it is moddable / a container in order to be able to display its possible child items
        itemIsModdable.value = _itemPropertiesService.canBeModded(item.value)
          || (item.value.categoryId === 'notFound' && (props.inventoryItem?.modSlots.length ?? 0) > 0)
        itemIsContainer.value = _itemPropertiesService.canContain(item.value)
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
        const newItemIsContainer = _itemPropertiesService.canContain(newItem)

        if (newItemIsContainer
          && inventoryItemInternal.value != null
          && inventoryItemInternal.value.content.length > 0) {
          const newItemIsMagazine = _itemPropertiesService.isMagazine(newItem)

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
        const preset = _presetService.getPreset(newItem.id)

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

        setBaseItem(newItem)
      }

      itemChanging.value = false
    }

    return {
      baseItem,
      canIgnorePrice,
      contentCount,
      dropdownPanelHeight,
      includeModsAndContentInSummary,
      inventoryItemInternal,
      isEditing,
      item,
      itemChanging,
      itemIsContainer,
      itemIsModdable,
      loadingOptions,
      maxSelectableQuantity,
      modsCount,
      onContentChanged,
      onDropdownOpen,
      onFilterOptions,
      onIgnorePriceChanged,
      onItemChanged,
      onModsChanged,
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
      setOptions,
      showBaseItemPrice,
      showPrice,
      showWeight
    }
  }
})
