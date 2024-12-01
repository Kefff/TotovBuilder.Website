<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IContainer } from '../models/item/IContainer'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IMagazine } from '../models/item/IMagazine'
import { IModdable } from '../models/item/IModdable'
import { SelectableTab } from '../models/utils/SelectableTab'
import SortingData from '../models/utils/SortingData'
import { CompatibilityRequestType } from '../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../services/compatibility/CompatibilityService'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import { ItemService } from '../services/ItemService'
import { PresetService } from '../services/PresetService'
import Services from '../services/repository/Services'
import { SortingService } from '../services/sorting/SortingService'
import { PathUtils } from '../utils/PathUtils'
import InputNumberField from './InputNumberFieldComponent.vue'
import ItemContent from './ItemContentComponent.vue'
import ItemMods from './ItemModsComponent.vue'
import Loading from './LoadingComponent.vue'
import OptionHeaderSelector from './option-header/OptionHeaderSelectorComponent.vue'
import SelectedItem from './SelectedItemComponent.vue'
import SelectedItemFunctionalities from './SelectedItemFunctionalitiesComponent.vue'
import SelectedItemSummarySelector from './summary/SelectedItemSummarySelectorComponent.vue'
import SummarySelector from './summary/SummarySelectorComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const props = withDefaults(
  defineProps<{
    acceptedItems: IItem[],
    acceptedItemsCategoryId?: ItemCategoryId,
    canBeLooted?: boolean,
    forceQuantityToMaxSelectableAmount?: boolean,
    inventoryItem?: IInventoryItem,
    isBaseItem?: boolean,
    isMainInventorySlotItem?: boolean,
    maxStackableAmount?: number,
    path: string
  }>(),
  {
    acceptedItemsCategoryId: undefined,
    canBeLooted: true,
    forceQuantityToMaxSelectableAmount: false,
    inventoryItem: undefined,
    isBaseItem: false,
    isMainInventorySlotItem: false,
    maxStackableAmount: undefined
  })

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
const contentCount = computed(() => modelInventoryItem.value?.content.length ?? 0)
const dropdownPanelHeight = computed(() => Math.min(options.value.length === 0 ? 1 : options.value.length, 5) * 4 + 'rem') // Shows 5 items or less
const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? item.value?.maxStackableAmount ?? 1)
const modsCount = computed(() => modelInventoryItem.value?.modSlots.filter(ms => ms.item != null).length ?? 0)
const optionHeight = computed(() => Number.parseInt(window.getComputedStyle(document.documentElement).fontSize.replace('px', '')) * 4)

watch(
  () => props.acceptedItems,
  () => neetToSetOptions.value = true)
watch(
  () => props.inventoryItem?.itemId,
  () => initializeItemAsync())
watch(
  () => props.inventoryItem?.quantity,
  () => quantity.value = props.inventoryItem?.quantity ?? 0)
watch(
  () => item.value?.id,
  () => setSelectedTab())

onMounted(() => {
  initializeItemAsync()
})

/**
 * Initializes the item based on the inventory item passed to the component.
 */
async function initializeItemAsync(): Promise<void> {
  if (props.inventoryItem == null) {
    quantity.value = 0
    item.value = undefined

    return
  }

  if (item.value?.id === modelInventoryItem.value?.itemId) {
    return
  }

  item.value = await _itemService.getItemAsync(props.inventoryItem.itemId)
  quantity.value = props.inventoryItem.quantity
  presetModSlotContainingItem.value = _presetService.getPresetModSlotContainingItem(item.value.id, props.path)
  setBaseItem(item.value)
}

/**
 * Reacts to the inventory item content being changed.
 *
 * Updates the inventory item based on the contained items.
 */
function onContentChanged(newContent: IInventoryItem[]): void {
  if (modelInventoryItem.value == null) {
    return
  }

  modelInventoryItem.value = {
    content: newContent,
    ignorePrice: modelInventoryItem.value.ignorePrice,
    itemId: modelInventoryItem.value.itemId,
    modSlots: modelInventoryItem.value.modSlots,
    quantity: modelInventoryItem.value.quantity
  }
}

/**
 * Reacts to the items selection dropdown being opened.
 *
 * Scrolls to the item in the item dropdown.
 */
function onDropdownOpen(): void {
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
function onFilterOptions(newValue: string): void {
  optionsFilter.value = newValue
  neetToSetOptions.value = true
  setOptionsAsync()
}

/**
 * Reacts to the click on the item ignore price button.
 *
 * Updates the inventory item based on the fact that the price is ignored or not.
 */
function onIgnorePriceChanged(newIgnorePrice: boolean): void {
  if (modelInventoryItem.value == null) {
    return
  }

  modelInventoryItem.value = {
    content: modelInventoryItem.value.content,
    ignorePrice: newIgnorePrice,
    itemId: modelInventoryItem.value.itemId,
    modSlots: modelInventoryItem.value.modSlots,
    quantity: modelInventoryItem.value?.quantity
  }
}

/**
 * Reacts to the selected item being changed.
 *
 * Updates the inventory item based on the selected item.
 */
async function onItemChangedAsync(): Promise<void> {
  if (item.value?.id === modelInventoryItem.value?.itemId) {
    return
  }

  if (item.value == null) {
    quantity.value = 0
    modelInventoryItem.value = undefined

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
function onModsChanged(newModsSlots: IInventoryModSlot[]): void {
  if (modelInventoryItem.value == null) {
    return
  }

  modelInventoryItem.value = {
    content: modelInventoryItem.value.content,
    ignorePrice: modelInventoryItem.value.ignorePrice,
    itemId: modelInventoryItem.value.itemId,
    modSlots: newModsSlots,
    quantity: modelInventoryItem.value.quantity
  }
}

/**
 * Reacts to the item quantity being changed.
 *
 * Updates the inventory item based on the quantity.
 */
function onQuantityChanged(newQuantity: number): void {
  if (modelInventoryItem.value == null) {
    return
  }

  modelInventoryItem.value = {
    content: modelInventoryItem.value.content,
    ignorePrice: modelInventoryItem.value.ignorePrice,
    itemId: modelInventoryItem.value.itemId,
    modSlots: modelInventoryItem.value.modSlots,
    quantity: newQuantity
  }
}

/**
 * Reacts to the click on an item selection sort button.
 *
 * Sorts the options items.
 */
async function onSortOptionsAsync(newSortingData: SortingData<IItem>): Promise<void> {
  loadingOptions.value = true

  optionsSortingData.value = newSortingData
  const currentOptions = [...options.value] // Creating a new array because options.value can be updated while this function is being executed
  options.value = await Services.get(SortingService).sortAsync(currentOptions, optionsSortingData.value)

  loadingOptions.value = false

  scrollToItemInDropdown()
}

/**
 * Removes the selected item.
 * @param event - Click event.
 */
async function removeItemAsync(event: MouseEvent): Promise<void> {
  event.stopPropagation()

  item.value = undefined
  await onItemChangedAsync()
}

/**
 * Sets the base item.
 * This can correspond to the base item if the selected item is a preset.
 * This can also correspond to the item itselft if it is the base item of a preset.
 * @param item - Item from which we search the base item.
 */
function setBaseItem(item: IItem): void {
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
async function setOptionsAsync(): Promise<void> {
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
  }

  onSortOptionsAsync(optionsSortingData.value)

  loadingOptions.value = false
}

/**
 * Scrolls the dropdown to the selected item.
 *
 * This is to workaround for an issue where the PrimeVue scrolling to the selected element breaks
 * because we focus the filter input.
 */
function scrollToItemInDropdown(): void {
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
function setSelectedTab(): void {
  if (item.value?.id != null) {
    // When an item is not found, but has mods or content, we consider it is moddable / a container in order to be able to display its possible child items
    itemIsModdable.value = _itemPropertiesService.canBeModded(item.value)
      || (item.value.categoryId === ItemCategoryId.notFound && (props.inventoryItem?.modSlots.length ?? 0) > 0)
    itemIsContainer.value = _itemPropertiesService.canContain(item.value)
      || (item.value.categoryId === ItemCategoryId.notFound && (props.inventoryItem?.content.length ?? 0) > 0)

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
function updateInventoryItem(newItem: IItem, compatibilityCheckResult: boolean): void {
  if (!compatibilityCheckResult) {
    initializeItemAsync() // Putting back the previous selected item when the new item is incomptatible
  } else {
    quantity.value = maxSelectableQuantity.value
    const ignorePrice = modelInventoryItem.value?.ignorePrice ?? false

    // Keeping the old item content if the new item is a container
    const newContent: IInventoryItem[] = []
    const newItemIsContainer = _itemPropertiesService.canContain(newItem)

    if (newItemIsContainer
      && modelInventoryItem.value != null
      && modelInventoryItem.value.content.length > 0) {
      const newItemIsMagazine = _itemPropertiesService.isMagazine(newItem)

      if (newItemIsMagazine) {
        const magazine = (newItem as IMagazine)

        for (const ammunitionInventoryItem of modelInventoryItem.value.content) {
          const isCompatible = magazine.acceptedAmmunitionIds.some(aci => aci === ammunitionInventoryItem.itemId)

          if (isCompatible) {
            ammunitionInventoryItem.quantity = magazine.capacity
            newContent.push(ammunitionInventoryItem)
          }
        }
      } else {
        newContent.push(...modelInventoryItem.value.content)
      }
    }

    // Setting the preset content and mods when the newly selected item is a preset
    const preset = _presetService.getPreset(newItem.id)

    if (preset != null) {
      // Creating a copy of the preset, otherwise the preset is modified for the whole application
      const newSelectedInventoryItem = JSON.parse(JSON.stringify(preset)) as IInventoryItem
      newSelectedInventoryItem.content = newContent
      newSelectedInventoryItem.ignorePrice = ignorePrice
      modelInventoryItem.value = newSelectedInventoryItem
    } else {
      modelInventoryItem.value = {
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
</script>










<template>
  <div
    v-if="modelInventoryItem != null || isEditing"
    class="item"
  >
    <div
      class="item-selection"
      :class="{
        'item-selection-main': item != null && isMainInventorySlotItem
      }"
    >
      <div class="item-selection-dropdown">
        <Dropdown
          v-model="item"
          :disabled="!isEditing || isBaseItem"
          :options="options"
          :scroll-height="dropdownPanelHeight"
          :show-clear="isEditing && !isBaseItem"
          :virtual-scroller-options="{ orientation: 'vertical', itemSize: optionHeight }"
          class="item-dropdown"
          data-key="id"
          @before-show="setOptionsAsync()"
          @change="onItemChangedAsync()"
          @show="onDropdownOpen()"
        >
          <template #clearicon>
            <Tooltip :tooltip="$t('caption.clearItem')">
              <div
                class="item-clear-button"
                @click="removeItemAsync"
              >
                <font-awesome-icon icon="times" />
              </div>
            </Tooltip>
          </template>
          <template #empty>
            <div class="item-dropdown-empty">
              <Loading
                v-if="loadingOptions"
                :scale="0.5"
              />
              <span v-else>
                {{ $t('message.noItemsFound') }}
              </span>
              <div />
            </div>
          </template>
          <template #header>
            <OptionHeaderSelector
              :category-id="acceptedItemsCategoryId"
              :filter="optionsFilter"
              :sorting-data="optionsSortingData"
              @update:filter="onFilterOptions($event)"
              @update:sorting-data="onSortOptionsAsync($event)"
            />
          </template>
          <template #option="slotProps">
            <div class="item-dropdown-option">
              <SummarySelector :item="slotProps.option" />
            </div>
          </template>
          <template #value="slotProps">
            <Tooltip
              :apply-hover-style="false"
              :tooltip="item?.name"
            >
              <SelectedItem v-model:item="slotProps.value" />
            </Tooltip>
          </template>
        </Dropdown>
      </div>
      <div
        v-if="item != null && maxSelectableQuantity > 1"
        class="item-quantity"
      >
        <InputNumberField
          v-model:value="quantity"
          :caption="$t('caption.quantity')"
          :max="maxSelectableQuantity"
          :min="1"
          :read-only="!isEditing || forceQuantityToMaxSelectableAmount"
          :required="true"
          caption-mode="placeholder"
          required-message-position="right"
          @update:value="onQuantityChanged($event)"
        />
      </div>
      <SelectedItemFunctionalities
        v-if="modelInventoryItem != null && item != null"
        v-model:selected-tab="selectedTab"
        :can-be-looted="canBeLooted"
        :can-have-content="itemIsContainer"
        :can-have-mods="itemIsModdable && !isBaseItem"
        :can-ignore-price="canIgnorePrice"
        :content-count="contentCount"
        :ignore-price="modelInventoryItem.ignorePrice"
        :item="item"
        :mods-count="modsCount"
        @update:ignore-price="onIgnorePriceChanged($event)"
      />
      <SelectedItemSummarySelector
        v-if="modelInventoryItem != null && item != null"
        :can-be-looted="canBeLooted"
        :include-mods-and-content="includeModsAndContentInSummary"
        :inventory-item-in-same-slot-in-preset="presetModSlotContainingItem?.item"
        :inventory-item="modelInventoryItem"
        :is-base-item="isBaseItem"
        :selected-item="item"
        :show-price="showPrice"
        :show-weight="showWeight"
      />
    </div>
    <div
      v-if="modelInventoryItem != null && item != null && !itemChanging && !isBaseItem"
      :class="(item != null && isMainInventorySlotItem) ? 'item-content-and-mods-main' : ''"
    >
      <div v-if="itemIsModdable">
        <div
          v-if="baseItem != null"
          v-show="selectedTab === SelectableTab.mods"
          class="item-base-item"
        >
          <div class="item-base-item-name">
            {{ $t('caption.baseItem') }}
          </div>
          <ItemComponent
            :accepted-items="[]"
            :can-be-looted="showBaseItemPrice"
            :inventory-item="baseItem"
            :is-base-item="true"
            :path="path"
          />
        </div>
        <ItemMods
          v-show="selectedTab === SelectableTab.mods"
          :inventory-mod-slots="modelInventoryItem.modSlots"
          :moddable-item="(item as IModdable)"
          :path="path"
          @update:inventory-mod-slots="onModsChanged($event)"
        />
      </div>
      <div v-if="itemIsContainer">
        <div v-show="selectedTab === SelectableTab.content">
          <ItemContent
            :inventory-items="modelInventoryItem.content"
            :container-item="(item as IContainer)"
            :path="path"
            @update:inventory-items="onContentChanged($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>










<style scoped>
.item {
  margin-bottom: 0.5rem;
}

.item:last-child {
  margin-bottom: 0;
}

.item-base-item {
  margin-left: 3.125rem;
  margin-top: 0.25rem;
}

.item-base-item-name {
  margin-bottom: 0.25rem;
}

.item-clear-button {
  align-items: center;
  color: var(--error-color);
  display: flex;
  height: 100%;
  justify-content: center;
  width: 2.375rem;
}

.item-content-and-mods-main {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.item-dropdown {
  width: 25rem;
}

.item-dropdown-empty {
  align-items: center;
  display: flex;
  height: 4rem;
  justify-content: center;
}

.item-dropdown-option {
  align-items: center;
  display: flex;
  height: 4rem;
  /* Matches the 60px set in the virtual scroller options */
  margin-left: 1rem;
}

.item-selection {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.item-selection-main {
  background-color: var(--primary-color6);
  border-radius: 6px;
  padding: 0.5rem;
}

.item-quantity {
  width: 11rem;
}
</style>

<style>
.item-selection-dropdown > .p-dropdown {
  height: 3.5rem;
}

.item-selection-dropdown .placeholder {
  padding: 1rem;
}

.item-selection-dropdown > .p-disabled {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.1);
}

.item-selection-dropdown .p-disabled .selected-item .item-icon {
  border-color: rgba(255, 255, 255, 0.1);
}

.item-selection-dropdown > .p-disabled > .p-dropdown-trigger {
  opacity: 0.38;
}

.item-selection-dropdown > .p-dropdown > .p-dropdown-label {
  padding: 0rem
}

.item-selection-dropdown > .p-dropdown > .p-dropdown-label > span > div {
  height: 100%;
}

.p-dropdown-panel > .p-dropdown-items-wrapper > .p-virtualscroller > .p-dropdown-items > .p-dropdown-item {
  padding: 0;
}
</style>