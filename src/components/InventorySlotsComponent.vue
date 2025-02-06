<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref, watch } from 'vue'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InventorySlot from './InventorySlotComponent.vue'
import InventorySlotSelector from './InventorySlotSelectorComponent.vue'

const modelInventorySlots = defineModel<IInventorySlot[]>('inventorySlots', { required: true })

defineProps<{ path: string }>()

let _isInitialized = false

const currentPageIndex = computed(() => {
  const index = inventorySlotGroups.value.findIndex(isg => isg.some(is => is.typeId === currentInventorySlotType.value))

  return index
})
const inventorySlotGroups = computed(() => {
  const groups: IInventorySlot[][] = []
  const singleItemGroup: IInventorySlot[] = []
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

  const pouchIndex = groups.findIndex(g => g[0].typeId === InventorySlotTypeId.pouch)
  groups.splice(pouchIndex, 0, singleItemGroup) // Inserting the single items group before the pouch group

  return groups
})

const currentInventorySlotType = ref<InventorySlotTypeId>()
const isEditing = inject<Ref<boolean>>('isEditing')
const isNewBuild = inject<Ref<boolean>>('isNewBuild')
const { isSmartphoneLandscapeOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()

onMounted(() => initialize())

watch(() => modelInventorySlots.value, () => initialize())

/**
 * Initializes the current inventory slot.
 */
function initialize(): void {
  if (_isInitialized) {
    return
  }

  if (isNewBuild?.value) {
    currentInventorySlotType.value = InventorySlotTypeId.onSling
    _isInitialized = true
  } else {
    const firstInventorySlotWithItem = modelInventorySlots.value.find(is => is.items.some(i => i != null))

    if (firstInventorySlotWithItem != null) {
      currentInventorySlotType.value = firstInventorySlotWithItem.typeId
      _isInitialized = true
    }
  }
}

/**
 * Reacts to the go to next inventory slot button being clicked.
 *
 * Sets the next inventory slot group as the current page.
 */
function onGoToNextInventorySlot(): void {
  currentInventorySlotType.value = inventorySlotGroups.value[currentPageIndex.value + 1][0].typeId
}


/**
 * Reacts to the go to previous inventory slot button being clicked.
 *
 * Sets the previous inventory slot group as the current page.
 */
function onGoToPreviousInventorySlot(): void {
  currentInventorySlotType.value = inventorySlotGroups.value[currentPageIndex.value - 1][0].typeId
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

function scrollToTop(): void {
  // For some reason, the smooth scrolling does not always work without setTimeout (event with nextTick)
  setTimeout(() => {
    document.getElementById('app')!.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, 1)
}
</script>










<template>
  <div class="inventory-slots">
    <InventorySlotSelector
      v-if="!isCompactMode"
      v-model:current-inventory-slot-type="currentInventorySlotType"
      @update:current-inventory-slot-type="scrollToTop"
    />
    <div class="inventory-slots-group">
      <InventorySlot
        v-for="(inventorySlot, index) of inventorySlotGroups[currentPageIndex]"
        :key="inventorySlot.typeId"
        v-model:inventory-slot="inventorySlotGroups[currentPageIndex][index]"
        :can-go-to-next="currentPageIndex < inventorySlotGroups.length - 1"
        :can-go-to-previous="currentPageIndex > 0"
        :path="`${path}/${PathUtils.inventorySlotPrefix}${inventorySlot.typeId}`"
        @go-to-next="onGoToNextInventorySlot"
        @go-to-previous="onGoToPreviousInventorySlot"
        @update:inventory-slot="onInventorySlotChanged"
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
</style>