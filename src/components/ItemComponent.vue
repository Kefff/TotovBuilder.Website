<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref, watch } from 'vue'
import { IBuildItemWithPath } from '../models/build/IBuildItemWithPath'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IContainer } from '../models/item/IContainer'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IModdable } from '../models/item/IModdable'
import { ItemSelectionSidebarParameters } from '../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { SelectableTab } from '../models/utils/UI/SelectableTab'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ItemComponentService } from '../services/ItemComponentService'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import { ItemService } from '../services/ItemService'
import { PresetService } from '../services/PresetService'
import Services from '../services/repository/Services'
import { ItemSortingFunctions } from '../services/sorting/functions/itemSortingFunctions'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InputNumberField from './InputNumberFieldComponent.vue'
import SelectedItemItemCardSelector from './item-card/SelectedItemItemCardSelectorComponent.vue'
import ItemContent from './ItemContentComponent.vue'
import ItemHierarchyIndicator from './ItemHierarchyIndicatorComponent.vue'
import ItemIcon from './ItemIconComponent.vue'
import ItemMods from './ItemModsComponent.vue'
import SelectedItemFunctionalities from './SelectedItemFunctionalitiesComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const props = withDefaults(
  defineProps<{
    canBeLooted?: boolean,
    forceQuantityToMaxSelectableAmount?: boolean,
    getAcceptedItemsFunction: () => Promise<IItem[]>,
    inventoryItem?: IInventoryItem,
    isBaseItem?: boolean,
    isMainInventorySlotItem?: boolean,
    maxStackableAmount?: number,
    path: string
  }>(),
  {
    canBeLooted: true,
    forceQuantityToMaxSelectableAmount: false,
    inventoryItem: undefined,
    isBaseItem: false,
    isMainInventorySlotItem: false,
    maxStackableAmount: undefined
  })

const _globalSidebarService = Services.get(GlobalSidebarService)
const _itemComponentService = Services.get(ItemComponentService)
const _itemPropertiesService = Services.get(ItemPropertiesService)
const _itemService = Services.get(ItemService)
const _presetService = Services.get(PresetService)

const canIgnorePrice = computed(() => presetModSlotContainingItem.value?.item?.itemId !== item.value?.id)
const contentCount = computed(() => modelInventoryItem.value?.content.length ?? 0)
const includeModsAndContentInSummary = computed(() =>
  (itemIsModdable.value
    && baseItem.value != null
    && !props.isBaseItem)
  || (itemIsContainer.value
    && props.isMainInventorySlotItem))
const itemHeaderGridTemplateColumns = computed(() => {
  if (isEditing?.value) {
    return '1fr auto auto'
  }

  return '1fr auto'
})
const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? item.value?.maxStackableAmount ?? 1)
const modsCount = computed(() => modelInventoryItem.value?.modSlots.filter(ms => ms.item != null).length ?? 0)

const baseItem = ref<IInventoryItem | undefined>()
const buildItemsWithPath = inject<Ref<IBuildItemWithPath[]>>('buildItemsWithPath')
const isEditing = inject<Ref<boolean>>('isEditing')
const { isTabletLandscapeOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()
const item = ref<IItem | undefined>()
const itemChanging = ref(false)
const itemIsContainer = ref(false)
const itemIsModdable = ref(false)
const lastSelectionFilterAndSortingData = ref<ItemFilterAndSortingData>()
const presetModSlotContainingItem = ref<IInventoryModSlot>()
const quantity = ref(props.inventoryItem?.quantity ?? 1)
const selectedTab = ref(SelectableTab.hidden)
const showBaseItemPrice = ref(false)
const showPrice = ref(true)
const showWeight = ref(true)

watch(
  () => props.inventoryItem?.itemId,
  () => initializeItemAsync())
watch(
  () => props.inventoryItem?.quantity,
  () => quantity.value = props.inventoryItem?.quantity ?? 1)
watch(
  () => item.value?.id,
  () => setSelectedTab())

onMounted(() => initializeItemAsync())

/**
 * Gets the accepted items for the base item selection side bar.
 */
function getAcceptedItemsForBaseItem(): Promise<IItem[]> {
  // The base item cannot be updated so we return an empty list
  return Promise.resolve([])
}

/**
 * Initializes the item based on the inventory item passed to the component.
 */
async function initializeItemAsync(): Promise<void> {
  if (item.value?.id === modelInventoryItem.value?.itemId) {
    return
  }

  if (props.inventoryItem == null) {
    quantity.value = 1
    item.value = undefined

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
function onItemChanged(): void {
  if (item.value?.id === modelInventoryItem.value?.itemId) {
    return
  }

  itemChanging.value = true

  if (item.value == null) {
    modelInventoryItem.value = undefined
  } else {
    presetModSlotContainingItem.value = _presetService.getPresetModSlotContainingItem(item.value.id, props.path)
    const newContent = _itemComponentService.getReplacingItemContent(modelInventoryItem.value, item.value)
    const newModSlots = _itemComponentService.getReplacingModSlots(modelInventoryItem.value, item.value)
    modelInventoryItem.value = {
      content: newContent,
      ignorePrice: modelInventoryItem.value?.ignorePrice ?? false,
      itemId: item.value.id,
      modSlots: newModSlots,
      quantity: maxSelectableQuantity.value
    }
    setBaseItem(item.value)
  }

  itemChanging.value = false
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
function onQuantityChanged(newQuantity: number | undefined): void {
  if (modelInventoryItem.value == null) {
    return
  }

  quantity.value = newQuantity ?? 1
  modelInventoryItem.value = {
    content: modelInventoryItem.value.content,
    ignorePrice: modelInventoryItem.value.ignorePrice,
    itemId: modelInventoryItem.value.itemId,
    modSlots: modelInventoryItem.value.modSlots,
    quantity: quantity.value
  }
}

/**
 * Reacts to the item selection input being clicked.
 *
 * Opens the item selection sidebar.
 */
function onSelectionInputClick(): void {
  let filterAndSortingData = lastSelectionFilterAndSortingData.value

  if (filterAndSortingData == null) {
    filterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
  }

  _globalSidebarService.display({
    displayedComponentType: 'ItemSelectionSidebar',
    displayedComponentParameters: {
      buildItemsWithPath: buildItemsWithPath?.value,
      filterAndSortingData,
      getSelectableItemsFunction: props.getAcceptedItemsFunction,
      path: props.path,
      selectedItems: item.value != null ? [item.value] : []
    },
    onCloseAction: (updatedParameters) => {
      const up = updatedParameters as ItemSelectionSidebarParameters
      lastSelectionFilterAndSortingData.value = up.filterAndSortingData
      const selectedItem: IItem | undefined = up.selectedItems[0]

      if (item.value?.id !== selectedItem?.id) {
        item.value = selectedItem
        onItemChanged()
      }
    }
  })
}

/**
 * Removes the selected item.
 * @param event - Click event.
 */
function removeItem(event: MouseEvent): void {
  event.stopPropagation()

  item.value = undefined
  onItemChanged()
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
      if (itemIsContainer.value && (contentCount.value > 0 || !itemIsModdable.value)) {
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
 * Displays the statistics of the item.
 */
function showDetails(): void {
  _globalSidebarService.display({
    displayedComponentType: 'StatsSidebar',
    displayedComponentParameters: item.value
  })
}
</script>










<template>
  <div
    v-if="modelInventoryItem != null || isEditing"
    class="item"
  >
    <div
      class="item-header-container"
      :class="{
        'item-header-container-compact': isCompactMode,
        'item-main': item != null && isMainInventorySlotItem,
        'item-padding': item == null || !isMainInventorySlotItem
      }"
    >
      <div>
        <div class="item-header">
          <div v-if="item != null && (!isEditing || isBaseItem)">
            <ItemIcon
              :item="item"
              :quantity="quantity"
            />
            <div class="item-header-title">
              <Tooltip :tooltip="item?.name">
                <span>{{ item.name }}</span>
              </Tooltip>
            </div>
          </div>
          <div
            v-else-if="isEditing"
            class="item-header-dropdown-container"
          >
            <Dropdown
              v-if="!isBaseItem"
              v-model="item"
              class="item-header-dropdown"
              @click="onSelectionInputClick"
            >
              <template #empty>
                <!-- Display nothing when the dropdown is opened because we open the sidebar instead -->
                <div />
              </template>
              <template #value>
                <Tooltip
                  v-if="item != null"
                  :apply-hover-style="false"
                  :disabled-on-mobile="true"
                  :tooltip="item?.name"
                >
                  <div class="item-header-dropdown-value">
                    <ItemIcon
                      :item="item"
                      :quantity="quantity"
                    />
                    <div
                      v-if="item != null"
                      class="item-header-title"
                    >
                      {{ item?.name }}
                    </div>
                  </div>
                </Tooltip>
                <div
                  v-else
                  class="item-header-dropdown-value"
                >
                  <font-awesome-icon
                    icon="plus"
                    class="item-header-dropdown-value-placeholder-icon"
                  />
                  <span class="item-header-dropdown-value-placeholder-text">
                    {{ $t('caption.selectItem') }}
                  </span>
                </div>
              </template>
            </Dropdown>
            <InputNumberField
              v-if="item != null
                && maxSelectableQuantity > 1
                && !forceQuantityToMaxSelectableAmount"
              v-show="isEditing"
              :value="quantity"
              :caption="$t('caption.quantity')"
              :max="maxSelectableQuantity"
              :min="1"
              :required="true"
              caption-mode="placeholder"
              required-message-position="right"
              class="item-header-quantity"
              @update:value="onQuantityChanged($event!)"
            />
          </div>
          <div
            v-if="isEditing"
            class="item-header-button"
          >
            <Tooltip
              v-if="isEditing && item != null && !isBaseItem"
              :apply-hover-style="false"
              :disabled-on-mobile="true"
              :tooltip="$t('caption.clear')"
            >
              <Button
                class="p-button-sm"
                outlined
                severity="danger"
                @click="removeItem"
              >
                <font-awesome-icon icon="times" />
              </Button>
            </Tooltip>
          </div>
          <div
            v-if="item != null || isEditing"
            class="item-header-button"
          >
            <Tooltip
              v-if="item != null && item.categoryId !== 'notFound'"
              :apply-hover-style="false"
              :disabled-on-mobile="true"
              :tooltip="$t('caption.showDetails')"
            >
              <Button
                class="p-button-sm"
                outlined
                @click="showDetails()"
              >
                <font-awesome-icon icon="clipboard-list" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <SelectedItemItemCardSelector
          v-if="modelInventoryItem != null && item != null"
          :can-be-looted="canBeLooted"
          :can-ignore-price="canIgnorePrice"
          :ignore-price="modelInventoryItem.ignorePrice"
          :include-mods-and-content="includeModsAndContentInSummary"
          :inventory-item-in-same-slot-in-preset="presetModSlotContainingItem?.item"
          :inventory-item="modelInventoryItem"
          :selected-item="item"
          :show-price="showPrice"
          :show-weight="showWeight"
          class="item-header-stats"
          :class="{ 'item-header-stats-compact': isCompactMode }"
          @update:ignore-price="onIgnorePriceChanged($event!)"
        />
        <!-- Empty zone that matches the size of SelectedItemItemCardSelector to make the dropdown respect alignment when no item is selected -->
        <div
          v-else-if="!isCompactMode"
          class="item-header-selected-item-placeholder"
        />
      </div>
    </div>
    <div v-if="modelInventoryItem != null">
      <SelectedItemFunctionalities
        v-if="item != null"
        v-model:selected-tab="selectedTab"
        :can-be-looted="canBeLooted"
        :can-have-content="itemIsContainer && !isBaseItem"
        :can-have-mods="itemIsModdable && !isBaseItem"
        :can-ignore-price="canIgnorePrice"
        :contains-base-item="baseItem != null"
        :content-count="contentCount"
        :ignore-price="modelInventoryItem.ignorePrice"
        :item="item"
        :mods-count="modsCount"
        @update:ignore-price="onIgnorePriceChanged($event)"
      />
      <!-- Mods an content -->
      <div v-if="!isBaseItem && !itemChanging">
        <div
          v-if="itemIsModdable
            && baseItem != null"
          v-show="selectedTab === SelectableTab.mods"
          class="item-content-and-mods-base-item"
        >
          <ItemHierarchyIndicator
            :is-first="true"
            :is-last="modsCount === 0 && !(isEditing ?? false)"
            :is-visible="true"
            mode="baseItem"
          />
          <div
            v-if="itemIsModdable"
            v-show="selectedTab === SelectableTab.mods"
            class="item-content-and-mods-base-item-mods"
          >
            <div class="item-content-and-mods-base-item-mods-name">
              {{ $t('caption.baseItem') }}
            </div>
            <ItemComponent
              v-model:inventory-item="baseItem"
              :get-accepted-items-function="getAcceptedItemsForBaseItem"
              :can-be-looted="showBaseItemPrice"
              :is-base-item="true"
              :path="PathUtils.getBaseItemPath(path, baseItem.itemId)"
              @update:inventory-item="$event => onIgnorePriceChanged($event!.ignorePrice)"
            />
          </div>
        </div>
        <ItemMods
          v-if="itemIsModdable"
          v-show="selectedTab === SelectableTab.mods && (modsCount > 0 || isEditing)"
          :inventory-mod-slots="modelInventoryItem.modSlots"
          :moddable-item="(item as IModdable)"
          :path="path"
          @update:inventory-mod-slots="onModsChanged($event)"
        />
        <div
          v-if="itemIsContainer"
          v-show="selectedTab === SelectableTab.content && (contentCount > 0 || isEditing)"
        >
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
  width: 100%;
}

.item-content-and-mods-base-item {
  display: flex;
}

.item-content-and-mods-base-item-mods {
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  width: 100%;
}

.item-content-and-mods-base-item-mods-name {
  font-weight: bolder;
  margin-bottom: 0.25rem;
}

.item-header {
  display: grid;
  gap: 0.25rem;
  grid-template-columns: v-bind(itemHeaderGridTemplateColumns);
  min-width: 3.875rem;
  width: 100%;
}

.item-header > div {
  align-items: center;
  display: flex;
  gap: 0.25rem;
}

.item-header-button {
  display: flex;
  flex-shrink: 0;
  width: 1.75rem;
  height: 3.875rem;
}

.item-header-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: center;
  width: 100%;
}

.item-header-container > div:first-child {
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem
}

.item-header-container.item-header-container-compact > div {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  grid-template-columns: unset;
  justify-content: unset;
}

.item-header-container-compact {
  align-items: unset;
  flex-direction: column;
}

.item-header-dropdown {
  height: 3.875rem;
  min-width: 10.375rem;
  flex-grow: 1;
}

.item-header-dropdown-container {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.item-header-dropdown-name {
  height: 100%;
  margin-left: 0.25rem;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

.item-header-dropdown-value {
  align-items: center;
  display: flex;
  gap: 0.25rem;
  height: 100%;
}

.item-header-dropdown-value-placeholder-icon {
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  color: var(--success-color);
}

.item-header-dropdown-value-placeholder-text {
  color: var(--util-color7);
  overflow: auto;
  white-space: preserve;
  word-break: break-word;
}

.item-header-quantity {
  flex-shrink: 0;
  width: 10rem;
}

.item-header-selected-item-placeholder {
  /* Empty zone that matches the width of SelectedItemItemCardSelector to make the dropdown respect alignment when no item is selected*/
  width: 40.5rem;
}

.item-header-stats {
  display: grid;
  grid-template-columns: auto auto;
  gap: 1rem;
  width: 100%;
}

.item-header-stats-compact {
  justify-content: flex-end;
}

.item-header-title {
  align-self: center;
  display: flex;
  font-size: 1rem;
  font-weight: normal;
  max-height: 3.25rem;
  overflow: auto;
  white-space: preserve;
  width: 100%;
  word-break: break-word;
}

.item-main {
  background-color: var(--primary-color8);
  border-radius: 6px;
  padding: 0.5rem;
}

.item-padding {
  padding-right: 0.5rem;
}

.item-quantity {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr auto;
  height: unset;
  width: 100%;
}

.item-quantity-input-container {
  display: grid;
  gap: 0.25rem;
  grid-template-columns: 1fr auto auto;
  width: 100%;
}
</style>









<style>
.item-header > .item-header-dropdown.p-dropdown .p-dropdown-trigger {
  margin-right: 0.21rem;
  width: unset;
}

.item-header-stats.selected-item-item-card {
  align-items: flex-start;
}

.item-header-stats.selected-item-item-card > .selected-item-item-card-prices-and-weight {
  height: 3.875rem;
}

.item-header-stats.item-header-stats-compact.selected-item-item-card > .selected-item-item-card-prices-and-weight {
  height: unset;
}

.item-header-stats.selected-item-item-card > .selected-item-item-card-specialized {
  height: 3.875rem;
}

.item-header-stats.item-header-stats-compact.selected-item-item-card > .selected-item-item-card-specialized {
  height: unset;
}
</style>