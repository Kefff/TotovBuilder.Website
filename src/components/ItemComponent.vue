<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventoryModSlot } from '../models/build/IInventoryModSlot'
import { IContainer } from '../models/item/IContainer'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { IMagazine } from '../models/item/IMagazine'
import { IModdable } from '../models/item/IModdable'
import { ItemSelectionSidebarParameters } from '../models/utils/IGlobalSidebarOptions'
import ItemFilterAndSortingData from '../models/utils/ItemFilterAndSortingData'
import { SelectableTab } from '../models/utils/UI/SelectableTab'
import { CompatibilityRequestType } from '../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../services/compatibility/CompatibilityService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import { ItemService } from '../services/ItemService'
import { PresetService } from '../services/PresetService'
import Services from '../services/repository/Services'
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
    getAcceptedItemsFunction: (forceItemsListUpdate: boolean) => Promise<IItem[]>,
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

const _compatibilityService = Services.get(CompatibilityService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _itemPropertiesService = Services.get(ItemPropertiesService)
const _itemService = Services.get(ItemService)
const _presetService = Services.get(PresetService)

const baseItem = ref<IInventoryItem | undefined>()
const isEditing = inject<Ref<boolean>>('isEditing')
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

const canIgnorePrice = computed(() => presetModSlotContainingItem.value?.item?.itemId !== item.value?.id)
const contentCount = computed(() => modelInventoryItem.value?.content.length ?? 0)
const hasOnlyBaseItem = computed(() => itemIsModdable.value && (props.inventoryItem?.modSlots ?? []).every(ms => ms.item == null))
const includeModsAndContentInSummary = computed(() =>
  (itemIsModdable.value
    && baseItem.value != null
    && !props.isBaseItem)
  || (itemIsContainer.value
    && props.isMainInventorySlotItem))
const itemHeaderGridTemplateColumns = computed(() => {
  if (isEditing?.value && props.isBaseItem) {
    return 'auto 1fr auto auto'
  } else if (isEditing?.value) {
    return '1fr auto auto'
  }

  return 'auto 1fr auto'
})
const maxSelectableQuantity = computed(() => props.maxStackableAmount ?? item.value?.maxStackableAmount ?? 1)
const modsCount = computed(() => modelInventoryItem.value?.modSlots.filter(ms => ms.item != null).length ?? 0)

watch(
  () => props.inventoryItem?.itemId,
  () => initializeItemAsync())
watch(
  () => props.inventoryItem?.quantity,
  () => quantity.value = props.inventoryItem?.quantity ?? 0)
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

  let compatibilityResult = true

  // Checking the compatibility of the selected item depending where the item is being added
  if (_itemPropertiesService.isArmor(item.value)) {
    compatibilityResult = await _compatibilityService.checkCompatibility(CompatibilityRequestType.armor, item.value.id, props.path)
  } else if (_itemPropertiesService.isVest(item.value)) {
    compatibilityResult = await _compatibilityService.checkCompatibility(CompatibilityRequestType.tacticalRig, item.value.id, props.path)
  } else if (_itemPropertiesService.isModdable(item.value)) {
    compatibilityResult = await _compatibilityService.checkCompatibility(CompatibilityRequestType.mod, item.value.id, props.path)
  }

  updateInventoryItem(item.value, compatibilityResult)
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
 * Reacts to the item selection input being clicked.
 *
 * Opens the item selection sidebar.
 */
function onSelectionInputClick(): void {
  let filterAndSortingData = lastSelectionFilterAndSortingData.value

  if (filterAndSortingData == null) {
    filterAndSortingData = new ItemFilterAndSortingData()
  }

  _globalSidebarService.display({
    displayedComponentType: 'ItemSelectionSidebar',
    displayedComponentParameters: {
      filterAndSortingData,
      getSelectableItemsFunction: props.getAcceptedItemsFunction,
      selectedItems: item.value != null ? [item.value] : []
    },
    onCloseAction: (updatedParameters) => {
      const up = updatedParameters as ItemSelectionSidebarParameters
      lastSelectionFilterAndSortingData.value = up.filterAndSortingData
      const selectedItem: IItem | undefined = up.selectedItems[0]

      if (item.value?.id !== selectedItem?.id) {
        item.value = selectedItem
        onItemChangedAsync()
      }
    }
  })
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
    <div :class="{ 'item-main': item != null && isMainInventorySlotItem, 'item-padding': item == null || !isMainInventorySlotItem }">
      <div class="item-header">
        <ItemIcon
          v-if="item != null && (!isEditing || isBaseItem)"
          :item="item"
          :quantity="quantity"
        />
        <div
          v-if="item != null && (!isEditing || isBaseItem)"
          class="item-header-title"
        >
          <span>{{ item.name }}</span>
        </div>
        <Dropdown
          v-else-if="isEditing && !isBaseItem"
          v-model="item"
          class="item-header-dropdown"
          @click="onSelectionInputClick"
        >
          <template #empty>
            <!-- Display nothing when the dropdown is opened because we open the sidebar instead -->
            <div />
          </template>
          <template #clearicon>
            <Tooltip :tooltip="$t('caption.clear')">
              <div
                class="item-header-clear-button"
                @click="removeItemAsync"
              >
                <font-awesome-icon icon="times" />
              </div>
            </Tooltip>
          </template>
          <template #value>
            <Tooltip
              :apply-hover-style="false"
              :tooltip="item?.name"
            >
              <div class="item-header-dropdown-value">
                <ItemIcon
                  v-if="item != null"
                  :item="item"
                  :quantity="quantity"
                />
                <div
                  v-if="item != null"
                  class="item-header-title"
                >
                  {{ item?.name }}
                </div>
                <font-awesome-icon
                  v-if="item == null"
                  icon="plus"
                  class="item-header-dropdown-value-placeholder-icon"
                />
                <span
                  v-if="item == null"
                  class="item-header-dropdown-value-placeholder-text"
                >
                  {{ $t('caption.selectItem') }}
                </span>
              </div>
            </Tooltip>
          </template>
        </Dropdown>
        <div
          v-if="isEditing"
          class="item-header-button"
        >
          <Tooltip
            v-if="isEditing && item != null && !isBaseItem"
            :apply-hover-style="false"
            :tooltip="$t('caption.clear')"
          >
            <Button
              class="p-button-sm"
              outlined
              severity="danger"
              @click="removeItemAsync"
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
            v-if="item != null"
            :apply-hover-style="false"
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
      <div
        v-if="item != null && maxSelectableQuantity > 1 && !forceQuantityToMaxSelectableAmount"
        class="item-header item-quantity"
      >
        <InputNumberField
          v-show="isEditing"
          v-model:value="quantity"
          :caption="$t('caption.quantity')"
          :max="maxSelectableQuantity"
          :min="1"
          :required="true"
          caption-mode="placeholder"
          required-message-position="right"
          @update:value="onQuantityChanged($event)"
        />
        <!-- Fake button divs to have the same alignment as the selection input -->
        <div
          v-if="isEditing"
          class="item-header-button"
        />
        <div
          v-if="item != null || isEditing"
          class="item-header-button"
        />
      </div>
      <SelectedItemItemCardSelector
        v-if="modelInventoryItem != null && item != null"
        :can-be-looted="canBeLooted"
        :can-ignore-price="canIgnorePrice"
        :ignore-price="modelInventoryItem.ignorePrice"
        :include-mods-and-content="includeModsAndContentInSummary"
        :inventory-item-in-same-slot-in-preset="presetModSlotContainingItem?.item"
        :inventory-item="modelInventoryItem"
        :is-base-item="isBaseItem"
        :selected-item="item"
        :show-price="showPrice"
        :show-weight="showWeight"
        @update:ignore-price="onIgnorePriceChanged($event)"
      />
    </div>
    <div v-if="modelInventoryItem != null">
      <SelectedItemFunctionalities
        v-if="item != null"
        v-model:selected-tab="selectedTab"
        :can-be-looted="canBeLooted"
        :can-have-content="itemIsContainer"
        :can-have-mods="itemIsModdable && !isBaseItem && (!hasOnlyBaseItem || (isEditing ?? false))"
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
            && baseItem != null
            && (!hasOnlyBaseItem || isEditing)"
          v-show="selectedTab === SelectableTab.mods"
          class="item-content-and-mods-base-item"
        >
          <ItemHierarchyIndicator
            :inventory-items="[baseItem]"
            :index="0"
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
              :get-accepted-items-function="getAcceptedItemsForBaseItem"
              :can-be-looted="showBaseItemPrice"
              :inventory-item="baseItem"
              :is-base-item="true"
              :path="path"
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
  align-items: center;
  display: grid;
  gap: 0.25rem;
  grid-template-columns: v-bind(itemHeaderGridTemplateColumns);
  height: 3.9rem;
}

.item-header-button {
  display: flex;
  min-width: 1.75rem;
}

.item-header-dropdown {
  height: 100%;
  width: 100%;
}

.item-header-dropdown-name {
  margin-left: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 100%;
  text-align: center;
}

.item-header-dropdown-value {
  align-items: center;
  display: flex;
  gap: 0.25rem;
  height: 100%;
}

.item-header-dropdown-value-placeholder-icon {
  color: var(--success-color);
}

.item-header-dropdown-value-placeholder-text {
  overflow: auto;
  white-space: preserve;
  word-break: break-word;
}

.item-header-title {
  font-size: 1rem;
  font-weight: normal;
  max-height: 3.25rem;
  overflow: auto;
  white-space: preserve;
  width: 100%;
  word-break: break-word;
}

.item-main {
  background-color: var(--primary-color6);
  border-radius: 6px;
  padding: 0.5rem
}

.item-padding {
  padding-right: 0.5rem;
}

.item-quantity {
  height: unset;
  margin-top: 0.5rem;
}
</style>









<style>
.item-header > .item-header-dropdown.p-dropdown .p-dropdown-trigger {
  width: unset;
  margin-right: 0.21rem;
}
</style>