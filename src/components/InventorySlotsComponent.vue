<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref, watch } from 'vue'
import Images from '../images'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InventorySlot from './InventorySlotComponent.vue'

const modelInventorySlots = defineModel<IInventorySlot[]>('inventorySlots', { required: true })

defineProps<{
  path: string
}>()

let _isInitialized = false

const currentPageIndex = computed(() => {
  const index = inventorySlotGroups.value.findIndex(isg => isg.some(is => is.typeId === currentInventorySlot.value))

  return index
})
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

const currentInventorySlot = ref<InventorySlotTypeId>()
const { isSmartphoneLandscapeOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()
const isEditing = inject<Ref<boolean>>('isEditing')

onMounted(() => initialize())

watch(() => modelInventorySlots.value, () => initialize())

/**
 * Initializes the current inventory slot.
 */
function initialize(): void {
  if (_isInitialized) {
    return
  }

  const firstInventorySlotWithItem = modelInventorySlots.value.find(is => is.items.some(i => i != null))

  if (firstInventorySlotWithItem != null) {
    currentInventorySlot.value = firstInventorySlotWithItem.typeId
    _isInitialized = true
  }
}

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
    <div
      v-if="!isCompactMode"
      class="inventory-slots-selector"
    >
      <img :src="Images.inventorySlotsSelection">
    </div>
    <div class="inventory-slots-group">
      <InventorySlot
        v-for="(inventorySlot, index) of inventorySlotGroups[currentPageIndex]"
        :key="inventorySlot.typeId"
        v-model:inventory-slot="inventorySlotGroups[currentPageIndex][index]"
        :path="`${path}/${PathUtils.inventorySlotPrefix}${inventorySlot.typeId}`"
        @update:inventory-slot="onInventorySlotChanged($event)"
      />
    </div>
  </div>
</template>










<style scoped>
.inventory-slots {
  display: flex;
  gap: 1rem;
}

.inventory-slots-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100%;
  width: 100%
}

.inventory-slots-group > div {
  height: 100%;
}

.inventory-slots-selector {
  position: relative;
}

.inventory-slots-selector > img {
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  position: sticky;
  top: 5rem;
  width: 28.5rem;
}
</style>