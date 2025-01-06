<script setup lang="ts">
import { Ref, computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IContainer } from '../models/item/IContainer'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { ItemPropertiesService } from '../services/ItemPropertiesService'
import { ItemContentComponentService } from '../services/components/ItemContentComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import Item from './ItemComponent.vue'
import ItemHierarchyIndicator from './ItemHierarchyIndicatorComponent.vue'

const modelInventoryItems = defineModel<IInventoryItem[]>('inventoryItems', { required: true })

const props = defineProps<{
  containerItem: IContainer,
  path: string
}>()

const _globalFilterService = Services.get(GlobalFilterService)
const _itemContentComponentService = Services.get(ItemContentComponentService)
const _itemPropertiesService = Services.get(ItemPropertiesService)

let _acceptedItemsNeedsUpdated = true

const acceptedItems = ref<IItem[]>([])
const categoryId = ref<ItemCategoryId | undefined>(undefined)
const isEditing = inject<Ref<boolean>>('isEditing')
const itemPathPrefix = PathUtils.itemPrefix
const itemToAdd = ref<IInventoryItem>()

const canAddItem = computed(() => !isMagazine.value || modelInventoryItems.value.length === 0)
const isMagazine = computed(() => _itemPropertiesService.isMagazine(props.containerItem))
const maximumQuantity = computed(() => isMagazine.value ? props.containerItem.capacity : undefined)

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  initialize()
})

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))


watch(() => props.containerItem.id, () => initialize())

/**
 * Initializes the component.
 */
function initialize(): void {
  // Gets the category IDs used to determine the available filters for the item selection sidebar.
  categoryId.value = _itemContentComponentService.getAcceptedItemsCategoryId(props.containerItem.categoryId)
}

/**
 * Reacts to an inventory item being added.
 *
 * Adds the item to the content of the inventory item and signals the parent item that its content has changed.
 */
function onItemAdded(newInventoryItem: IInventoryItem): void {
  modelInventoryItems.value = [
    ...modelInventoryItems.value,
    newInventoryItem
  ]

  nextTick(() => { // nextTick required for the reset of itemToAdd to take effect in the Item component
    itemToAdd.value = undefined
  })
}

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the parent item that its content has changed.
 * @param index - Index of the changed contained item in the inventory item content list.
 * @param newInventoryItem - Updated contained item.
 */
function onItemChanged(index: number, newInventoryItem: IInventoryItem | undefined): void {
  const newInventoryItems = [...modelInventoryItems.value]

  if (newInventoryItem == null) {
    newInventoryItems.splice(index, 1)
  } else {
    newInventoryItems[index] = newInventoryItem
  }

  modelInventoryItems.value = newInventoryItems
}

/**
 * Gets the items the user can select as content of the item.
 */
async function getAcceptedItemsAsync(): Promise<IItem[]> {
  if (_acceptedItemsNeedsUpdated) {
    acceptedItems.value = await _itemContentComponentService.getAcceptedItemsAsync(props.containerItem.id)
  }

  return acceptedItems.value
}

/**
 * Reacts to the merchant filter changing.
 *
 * Indicates the accepted items list needs to be updated.
 */
function onMerchantFilterChanged(): void {
  _acceptedItemsNeedsUpdated = true
}
</script>










<template>
  <div v-if="modelInventoryItems.length > 0 || isEditing">
    <div
      v-for="(containedItem, index) of modelInventoryItems"
      :key="`${path}/${index}_${modelInventoryItems.length}`"
      class="item-content-content-item"
    >
      <ItemHierarchyIndicator
        :inventory-items="inventoryItems"
        :index="index"
        :mode="props.containerItem.categoryId === ItemCategoryId.magazine ? 'magazineContent' : 'content'"
      />
      <Item
        :force-accepted-items-category-id-from-accepted-items-list="categoryId != null"
        :force-quantity-to-max-selectable-amount="isMagazine"
        :get-accepted-items-function="getAcceptedItemsAsync"
        :inventory-item="modelInventoryItems[index]"
        :max-stackable-amount="maximumQuantity"
        :path="`${path}/${PathUtils.contentPrefix}${index}_${modelInventoryItems.length}/${itemPathPrefix}${containedItem.itemId}`"
        @update:inventory-item="onItemChanged(index, $event)"
      />
    </div>
    <div
      v-if="isEditing && canAddItem"
      class="item-content-content-item"
    >
      <ItemHierarchyIndicator
        :inventory-items="[itemToAdd]"
        :index="0"
        mode="addContent"
      />
      <Item
        v-model:inventory-item="itemToAdd"
        :force-accepted-items-category-id-from-accepted-items-list="categoryId != null"
        :get-accepted-items-function="getAcceptedItemsAsync"
        :max-stackable-amount="maximumQuantity"
        :path="`${path}/new`"
        @update:inventory-item="onItemAdded($event)"
      />
    </div>
  </div>
</template>









<style scoped>
.item-content-content-item {
  display: flex;
  width: 100%;
}
</style>










<style>
.item-content-content-item > .item {
  margin-top: 1.5rem;
}

.item-content-content-item:first-child > .item {
  margin-top: 0.5rem;
}
</style>