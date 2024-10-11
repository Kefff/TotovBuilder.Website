<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, Ref, ref } from 'vue'
import Images from '../images'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IItem } from '../models/item/IItem'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventorySlotService } from '../services/InventorySlotService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'
import InventorySlotItem from './InventorySlotItemComponent.vue'

const modelCollapsed = defineModel<boolean>('collapsed')
const modelInventorySlot = defineModel<IInventorySlot>('inventorySlot', { required: true })

defineProps<{ path: string }>()

const _globalFilterService = Services.get(GlobalFilterService)
const _inventorySlotService = Services.get(InventorySlotService)

const acceptedItemsCategoryId = ref<string>()
const acceptedItems = ref<IItem[]>([])
const isEditing = inject<Ref<boolean>>('isEditing')

const inventorySlotType = computed(() => _inventorySlotService.getType(modelInventorySlot.value.typeId))
const isDisplayed = computed(() => isEditing?.value || modelInventorySlot.value.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setAcceptedItems()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates accepted items to reflect changes in merchant filters.
 */
function onMerchantFilterChanged() {
  setAcceptedItems()
}

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the build one of its inventory slots has changed.
 */
function onItemChanged(index: number, newInventoryItem: IInventoryItem | undefined) {
  const newInventorySlot = { ...modelInventorySlot.value }
  newInventorySlot.items[index] = newInventoryItem
  modelInventorySlot.value = newInventorySlot
}

/**
 * Sets the accepted items selectable by the user.
 */
async function setAcceptedItems() {
  acceptedItemsCategoryId.value = inventorySlotType.value.acceptedItemCategories.length === 1
    ? inventorySlotType.value.acceptedItemCategories[0]
    : undefined
  acceptedItems.value = await Services.get(ItemService).getItemsOfCategories(inventorySlotType.value.acceptedItemCategories, true)
}
</script>










<template>
  <div
    v-if="isDisplayed"
    class="inventory-slot"
  >
    <Panel v-model:collapsed="modelCollapsed">
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
              :src="Images[StringUtils.toCamelCase(inventorySlotType.customIcon)]"
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
    </Panel>
  </div>
</template>










<style scoped>
@import '../css/collapsable.css';
@import '../css/icon.css';

.inventory-slot {
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  margin-bottom: 1rem;
}

.inventory-slot:last-child {
  margin-bottom: 0;
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
  margin-left: 1rem;
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
  margin-left: 1rem;
  margin-right: 0.5rem;
}

.inventory-slot-title {
  align-items: center;
  display: flex;
  white-space: nowrap;
}
</style>

<style>
.inventory-slot > .p-panel > .p-panel-header {
  background-color: var(--surface-transparent-0) !important;
}

.inventory-slot > .p-panel .p-panel-content {
  background-color: var(--surface-transparent-0);
}
</style>