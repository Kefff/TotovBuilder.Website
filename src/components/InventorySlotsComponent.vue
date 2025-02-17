<script setup lang="ts">
import { computed, inject, onMounted, ref, Ref, watch } from 'vue'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import InventorySlot from './InventorySlotComponent.vue'
import InventorySlotSelector from './InventorySlotSelectorComponent.vue'

const modelInventorySlots = defineModel<IInventorySlot[]>('inventorySlots', { required: true })
const modelCurrentInventorySlot = defineModel<InventorySlotTypeId>('currentInventorySlot', { required: true })

defineProps<{
  inventorySlotsShoppingListItems: IShoppingListItem[],
  path: string
}>()

let _isInitialized = false

const currentPageIndex = computed(() => {
  const index = inventorySlotGroups.value.findIndex(isg => isg.some(is => is.typeId === modelCurrentInventorySlot.value))

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
const previousPageIndex = computed(() => {
  const index = inventorySlotGroups.value.findIndex(isg => isg.some(is => is.typeId === lastInventorySlot.value))

  return index
})
const transitionEnterFromTranslate = computed(() => previousPageIndex.value < currentPageIndex.value ? 'translateX(100vw)' : 'translateX(-100vw)')
const transitionLeaveToTranslate = computed(() => previousPageIndex.value < currentPageIndex.value ? 'translateX(-100vw)' : 'translateX(100vw)')

const isEditing = inject<Ref<boolean>>('isEditing')
const isNewBuild = inject<Ref<boolean>>('isNewBuild')
const { isSmartphoneLandscapeOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()
const lastInventorySlot = ref<InventorySlotTypeId>()

onMounted(() => initialize())

watch(() => modelInventorySlots.value, () => initialize())

watch(() => modelCurrentInventorySlot.value, (newValue, oldValue) => {
  lastInventorySlot.value = oldValue
  scrollToTop()
})

/**
 * Initializes the current inventory slot.
 */
function initialize(): void {
  if (_isInitialized) {
    return
  }

  if (isNewBuild?.value) {
    modelCurrentInventorySlot.value = InventorySlotTypeId.onSling
    _isInitialized = true
  } else {
    const firstInventorySlotWithItem = modelInventorySlots.value.find(is => is.items.some(i => i != null))

    if (firstInventorySlotWithItem != null) {
      modelCurrentInventorySlot.value = firstInventorySlotWithItem.typeId
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
  modelCurrentInventorySlot.value = inventorySlotGroups.value[currentPageIndex.value + 1][0].typeId
}


/**
 * Reacts to the go to previous inventory slot button being clicked.
 *
 * Sets the previous inventory slot group as the current page.
 */
function onGoToPreviousInventorySlot(): void {
  modelCurrentInventorySlot.value = inventorySlotGroups.value[currentPageIndex.value - 1][0].typeId
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

/**
 * Scrolls to the top of the screen.
 */
function scrollToTop(): void {
  setTimeout(() => {
    document.getElementById('app')!.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, 500) // Wait for the swipe animation to have ended before scrolling
}
</script>










<template>
  <div class="inventory-slots">
    <InventorySlotSelector
      v-if="!isCompactMode"
      v-model:current-inventory-slot-type="modelCurrentInventorySlot"
      :inventory-slots-shopping-list-items="inventorySlotsShoppingListItems"
      :is-editing="isEditing!"
    />
    <slot name="empty" />
    <div
      v-if="$slots.empty == null"
      class="inventory-slots-group"
    >
      <TransitionGroup name="inventory-slots-group-transition">
        <InventorySlot
          v-for="(inventorySlot, index) of inventorySlotGroups[currentPageIndex]"
          :key="inventorySlot.typeId"
          v-model:inventory-slot="inventorySlotGroups[currentPageIndex][index]"
          :can-go-to-next="currentPageIndex < inventorySlotGroups.length - 1"
          :can-go-to-previous="currentPageIndex > 0"
          :next-inventory-slot-type="inventorySlotGroups[currentPageIndex + 1]?.[0].typeId"
          :path="`${path}/${PathUtils.inventorySlotPrefix}${inventorySlot.typeId}`"
          :previous-inventory-slot-type="inventorySlotGroups[currentPageIndex - 1]?.[0].typeId"
          @go-to-next="onGoToNextInventorySlot"
          @go-to-previous="onGoToPreviousInventorySlot"
          @update:inventory-slot="onInventorySlotChanged"
        />
      </TransitionGroup>
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
  overflow-x: hidden;
  width: 100%;
}

.inventory-slots-group-transition-enter-active {
  transition: all 0.25s 0.25s ease;
}

.inventory-slots-group-transition-leave-active {
  transition: all 0.25s ease;
}

.inventory-slots-group-transition-enter-from {
  opacity: 0;
  transform: v-bind(transitionEnterFromTranslate);
}

.inventory-slots-group-transition-leave-to {
  opacity: 0;
  transform: v-bind(transitionLeaveToTranslate);
}
</style>