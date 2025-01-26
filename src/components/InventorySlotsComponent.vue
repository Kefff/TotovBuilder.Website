<script setup lang="ts">
import { computed, inject, Ref } from 'vue'
import Images from '../images'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { PathUtils } from '../utils/PathUtils'
import InventorySlot from './InventorySlotComponent.vue'

const modelInventorySlots = defineModel<IInventorySlot[]>('inventorySlots', { required: true })

defineProps<{
  path: string
}>()

const TODO_REMOVE_WHEN_INVENTORY_SLOT_SELECTION_US_IMPLEMENTED = true

const inventorySlotGroups = computed(() => {
  const groups = []
  const singleItemGroup = []
  const visibleInventorySlots = isEditing?.value
    ? modelInventorySlots.value
    : modelInventorySlots.value.filter(is => is.items.some((i) => i != null))

  for (const inventorySlot of visibleInventorySlots) {
    if (inventorySlot.typeId === InventorySlotTypeId.armband
      || inventorySlot.typeId === InventorySlotTypeId.earpiece
      || inventorySlot.typeId === InventorySlotTypeId.eyewear
      || inventorySlot.typeId === InventorySlotTypeId.faceCover
      || inventorySlot.typeId === InventorySlotTypeId.scabbard) {
      singleItemGroup.push(inventorySlot)
    } else {
      groups.push([inventorySlot])
    }
  }

  groups.push(singleItemGroup)

  return groups
})

const isEditing = inject<Ref<boolean>>('isEditing')

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the build one of its inventory slots has changed.
 */
function onInventorySlotChanged(updatedInventorySlot: IInventorySlot): void {
  const updatedInventorySlots = [...modelInventorySlots.value]
  const index = updatedInventorySlots.findIndex(is => is.typeId === updatedInventorySlot.typeId)
  updatedInventorySlots[index] = updatedInventorySlot
  modelInventorySlots.value = updatedInventorySlots
}
</script>










<template>
  <div class="inventory-slots">
    <div class="inventory-slots-selection">
      <img :src="Images.inventorySlotsSelection">
    </div>
    <div class="inventory-slots-carousel">
      <Carousel
        :num-scroll="1"
        :num-visible="1"
        :show-indicators="TODO_REMOVE_WHEN_INVENTORY_SLOT_SELECTION_US_IMPLEMENTED"
        :show-navigators="false"
        :value="inventorySlotGroups"
      >
        <template #item="slotProps">
          <div class="inventory-slots-group">
            <InventorySlot
              v-for="(inventorySlot, index) of slotProps.data"
              :key="inventorySlot.typeId"
              v-model:inventory-slot="slotProps.data[index]"
              :path="`${path}/${PathUtils.inventorySlotPrefix}${inventorySlot.typeId}`"
              @update:inventory-slot="onInventorySlotChanged($event)"
            />
          </div>
        </template>
      </Carousel>
    </div>
  </div>
</template>










<style scoped>
.inventory-slots {
  display: grid;
  gap: 1rem;
  grid-template-columns: auto 1fr 1fr;
}

.inventory-slots-carousel {
  grid-column: span 2;
}

.inventory-slots-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.inventory-slots-selection {
  position: relative;
}

.inventory-slots-selection > img {
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  max-height: 90vh;
  max-width: 28.5rem;
  min-height: 53rem;
  position: sticky;
  top: 5rem;
}
</style>