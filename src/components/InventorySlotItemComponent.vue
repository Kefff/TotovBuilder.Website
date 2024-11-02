<script setup lang="ts">
import { onMounted } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { InventorySlotComponentService } from '../services/components/InventorySlotComponentService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import Item from './ItemComponent.vue'

const modelInventoryItem = defineModel<IInventoryItem>('inventoryItem')

const props = withDefaults(
  defineProps<{
    acceptedItems: IItem[],
    acceptedItemsCategoryId?: ItemCategoryId,
    canBeLooted: boolean,
    inventorySlotTypeId: string,
    path: string
  }>(),
  {
    acceptedItemsCategoryId: undefined
  })

const _inventorySlotComponentService = Services.get(InventorySlotComponentService)

let _oldInventoryItem: IInventoryItem | undefined = undefined

onMounted(() => {
  setOldInventoryItem()
})

/**
 * Reacts to an inventory item being changed.
 *
 * Checks if the item can be selected.
 * Signals to the parent inventory slot the inventory item has changed if the new item can be selected;
 * otherwise puts back the old item.
 */
async function onItemChangedAsync(newInventoryItem?: IInventoryItem): Promise<void> {
  const canSelect = await _inventorySlotComponentService.checkCompatibilityAsync(props.inventorySlotTypeId, newInventoryItem, props.path)

  if (canSelect) {
    modelInventoryItem.value = newInventoryItem
    setOldInventoryItem()
  } else {
    modelInventoryItem.value = _oldInventoryItem
  }
}

/**
 * Saves the current value of the inventory item to be able to restore it when selecting an incompatible item.
 */
function setOldInventoryItem(): void {
  _oldInventoryItem = modelInventoryItem.value
}
</script>










<template>
  <Item
    :accepted-items-category-id="acceptedItemsCategoryId"
    :accepted-items="acceptedItems"
    :can-be-looted="canBeLooted"
    :inventory-item="modelInventoryItem"
    :is-main-inventory-slot-item="true"
    :path="`${path}/${PathUtils.itemPrefix}${modelInventoryItem?.itemId ?? 'empty'}`"
    @update:inventory-item="onItemChangedAsync($event)"
  />
</template>