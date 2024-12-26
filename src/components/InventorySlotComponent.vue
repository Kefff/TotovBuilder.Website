<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, Ref, ref } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IItem, ItemCategoryId } from '../models/item/IItem'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventorySlotPropertiesService } from '../services/InventorySlotPropertiesService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'
import InventorySlotItem from './InventorySlotItemComponent.vue'

const modelCollapsed = defineModel<boolean>('collapsed')
const modelInventorySlot = defineModel<IInventorySlot>('inventorySlot', { required: true })

defineProps<{ path: string }>()

const _globalFilterService = Services.get(GlobalFilterService)
const _inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)

const acceptedItemsCategoryId = ref<ItemCategoryId>()
const acceptedItems = ref<IItem[]>([])
const isEditing = inject<Ref<boolean>>('isEditing')

const inventorySlotType = computed(() => _inventorySlotPropertiesService.getType(modelInventorySlot.value.typeId))
const isDisplayed = computed(() => isEditing?.value || modelInventorySlot.value.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setAcceptedItemsAsync()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates accepted items to reflect changes in merchant filters.
 */
function onMerchantFilterChanged(): void {
  setAcceptedItemsAsync()
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
 * Sets the accepted items selectable by the user.
 */
async function setAcceptedItemsAsync(): Promise<void> {
  acceptedItemsCategoryId.value = inventorySlotType.value.acceptedItemCategories.length === 1
    ? inventorySlotType.value.acceptedItemCategories[0]
    : undefined
  acceptedItems.value = await Services.get(ItemService).getItemsOfCategoriesAsync(inventorySlotType.value.acceptedItemCategories, true)
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
      <InventorySlotItem
        v-for="(inventoryItem, index) of modelInventorySlot.items"
        :key="`${path}_${index}`"
        :accepted-items-category-id="acceptedItemsCategoryId"
        :accepted-items="acceptedItems"
        :can-be-looted="inventorySlotType.canBeLooted"
        :inventory-item="modelInventorySlot.items[index]"
        :inventory-slot-type-id="modelInventorySlot.typeId"
        :path="`${path}_${index}`"
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
  padding-left: 0.25rem;
  padding-right: 0.25rem;
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