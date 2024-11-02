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

const modelInventoryItems = defineModel<IInventoryItem[]>('inventoryItems', { required: true })

const props = defineProps<{
  containerItem: IContainer,
  path: string
}>()

const _globalFilterService = Services.get(GlobalFilterService)
const _itemPropertiesService = Services.get(ItemPropertiesService)

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

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => props.containerItem.id, () => initialize())

/**
 * Initializes the component.
 */
function initialize(): void {
  setCategoryId()
  setAcceptedItems()
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

  nextTick(() => {
    // nextTick required for the reset of itemToAdd to take effect in the Item component
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
 * Reacts to the merchant filter being changed.
 *
 * Updates the accepted items to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  setAcceptedItems()
}

/**
 * Sets the accepted items for the item to add.
 */
async function setAcceptedItems(): Promise<void> {
  acceptedItems.value = await Services.get(ItemContentComponentService).getAcceptedItems(props.containerItem.id)
}

/**
 * Gets the category IDs used for determining the available sort buttons in the item selection dropdown.
 */
function setCategoryId(): void {
  categoryId.value = Services.get(ItemContentComponentService).getAcceptedItemsCategoryId(props.containerItem.categoryId)
}
</script>










<template>
  <div class="item-content-indent">
    <Item
      v-for="(containedItem, index) of modelInventoryItems"
      :key="`${path}/${index}_${modelInventoryItems.length}`"
      :accepted-items-category-id="categoryId"
      :accepted-items="acceptedItems"
      :force-quantity-to-max-selectable-amount="isMagazine"
      :inventory-item="modelInventoryItems[index]"
      :max-stackable-amount="maximumQuantity"
      :path="`${path}/${PathUtils.contentPrefix}${index}_${modelInventoryItems.length}/${itemPathPrefix}${containedItem.itemId}`"
      @update:inventory-item="onItemChanged(index, $event)"
    />
    <Item
      v-if="isEditing && canAddItem"
      v-model:inventory-item="itemToAdd"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="categoryId"
      :max-stackable-amount="maximumQuantity"
      :path="`${path}/new`"
      @update:inventory-item="onItemAdded($event)"
    />
  </div>
</template>










<style scoped>
.item-content-indent {
  margin-left: 3.25rem;
  margin-top: 0.5rem;
}
</style>