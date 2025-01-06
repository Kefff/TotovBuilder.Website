<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, Ref, ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IItem } from '../models/item/IItem'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventorySlotPropertiesService } from '../services/InventorySlotPropertiesService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import StringUtils from '../utils/StringUtils'
import Item from './ItemComponent.vue'

const modelCollapsed = defineModel<boolean>('collapsed')
const modelInventorySlot = defineModel<IInventorySlot>('inventorySlot', { required: true })

defineProps<{ path: string }>()

const _globalFilterService = Services.get(GlobalFilterService)
const _inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
const _itemService = Services.get(ItemService)

let _acceptedItemsNeedsUpdated = true

const inventorySlotType = computed(() => _inventorySlotPropertiesService.getType(modelInventorySlot.value.typeId))
const isDisplayed = computed(() => isEditing?.value || modelInventorySlot.value.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item

const acceptedItems = ref<IItem[]>([])
const isEditing = inject<Ref<boolean>>('isEditing')

onMounted(() => _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged))

onUnmounted(() => _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

/**
 * Gets the items the user can select in the inventory slot.
 */
async function getAcceptedItemsAsync(): Promise<IItem[]> {
  if (_acceptedItemsNeedsUpdated) {
    acceptedItems.value = await _itemService.getItemsOfCategoriesAsync(inventorySlotType.value.acceptedItemCategories, true)
    _acceptedItemsNeedsUpdated = false
  }

  return acceptedItems.value
}

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the build one of its inventory slots has changed.
 */
function onItemChanged(index: number, newInventoryItem: IInventoryItem | undefined): void {
  const newInventorySlot = { ...modelInventorySlot.value }
  newInventorySlot.items[index] = newInventoryItem
  modelInventorySlot.value = newInventorySlot
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
  <Panel
    v-if="isDisplayed"
    v-model:collapsed="modelCollapsed"
    class="inventory-slot"
  >
    <template #header>
      <div
        class="inventory-slot-header"
        @click="modelCollapsed = !modelCollapsed"
      >
        <div class="inventory-slot-title">
          <font-awesome-icon
            v-if="inventorySlotType.icon != null"
            :icon="inventorySlotType.icon"
            class="inventory-slot-icon"
          />
          <img
            v-else-if="inventorySlotType.customIcon != null"
            :src="inventorySlotType.customIcon"
            class="inventory-slot-custom-icon"
          >
          <span class="inventory-slot-caption">{{ $t('caption.slotType' + StringUtils.toUpperFirst(modelInventorySlot.typeId)) }}</span>
        </div>
        <div class="inventory-slot-collapse-icon">
          <font-awesome-icon
            v-if="modelCollapsed"
            icon="angle-right"
            class="collapsable-icon-collapsed"
          />
          <font-awesome-icon
            v-else
            icon="angle-right"
            class="collapsable-icon-deployed"
          />
        </div>
      </div>
    </template>
    <div class="inventory-slot-items">
      <Item
        v-for="(inventoryItem, index) of modelInventorySlot.items"
        :key="`${path}_${index}`"
        :can-be-looted="inventorySlotType.canBeLooted"
        :get-accepted-items-function="getAcceptedItemsAsync"
        :inventory-item="modelInventorySlot.items[index]"
        :is-main-inventory-slot-item="true"
        :path="`${path}_${index}/${PathUtils.itemPrefix}${inventoryItem?.itemId ?? 'empty'}`"
        @update:inventory-item="onItemChanged(index, $event)"
      />
    </div>
  </Panel>
</template>










<style scoped>
.inventory-slot {
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
}

.inventory-slot-caption {
  margin-left: 0.5rem;
}

.inventory-slot-collapse-icon {
  align-items: center;
  display: flex;
  margin-left: auto
}

.inventory-slot-custom-icon {
  width: 1.75rem;
}

.inventory-slot-header {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 1.35rem;
  font-weight: bold;
  width: 100%;
}

.inventory-slot-icon {
  font-size: 1.75rem;
  margin-right: 0.5rem;
}

.inventory-slot-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 1rem;
}

.inventory-slot-title {
  align-items: center;
  display: flex;
  white-space: nowrap;
}
</style>

<style>
.inventory-slot.p-panel > .p-panel-header {
  background-color: var(--surface-transparent-0);
}

.inventory-slot.p-panel .p-panel-content {
  background-color: var(--surface-transparent-0);
  padding: 0;
}
</style>