<script setup lang="ts">
import { useElementBounding, useSwipe, UseSwipeDirection } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { IInventoryItem } from '../models/build/IInventoryItem'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IItem } from '../models/item/IItem'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventorySlotPropertiesService } from '../services/InventorySlotPropertiesService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import StringUtils from '../utils/StringUtils'
import Item from './ItemComponent.vue'
import Tooltip from './TooltipComponent.vue'

const modelInventorySlot = defineModel<IInventorySlot>('inventorySlot', { required: true })

const props = defineProps<{
  canGoToNext: boolean,
  canGoToPrevious: boolean,
  nextInventorySlotType: InventorySlotTypeId | undefined,
  path: string,
  previousInventorySlotType: InventorySlotTypeId | undefined,
}>()

const emits = defineEmits<{
  goToNext: [value: void]
  goToPrevious: [value: void]
}>()

const _globalFilterService = Services.get(GlobalFilterService)
const _inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
const _itemService = Services.get(ItemService)

let _acceptedItemsNeedsUpdated = true
const _swipeDeadzone = 50

const containerHeight = computed(() => `${inventorySlotHeight.value}px`)
const inventorySlotType = computed(() => _inventorySlotPropertiesService.getType(modelInventorySlot.value.typeId))
const swipeBlock = computed(() => _swipeDeadzone * 0.5)
const swipeChangeTrigger = computed(() => _swipeDeadzone * 2.5)
const swipeMaxLeft = computed(() => !props.canGoToPrevious ? swipeBlock.value : undefined)
const swipeMinLeft = computed(() => !props.canGoToNext ? -swipeBlock.value : undefined)

const acceptedItems = ref<IItem[]>([])
const inventorySlot = useTemplateRef('inventorySlot')
const leftPosition = ref('0')
const { height: inventorySlotHeight } = useElementBounding(inventorySlot)
const { direction: swipeDirection, isSwiping, lengthX: swipeLength } = useSwipe(
  inventorySlot,
  {
    onSwipe,
    onSwipeEnd,
    threshold: _swipeDeadzone
  })

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

/**
 * React to the inventory slot being swipped.
 *
 * Positions the inventory slot according to the swipe movement.
 */
function onSwipe(): void {
  let left = Math.max(Math.abs(swipeLength.value) - _swipeDeadzone, 0)

  if (swipeDirection.value === 'left') {
    left = -left

    if (swipeMinLeft.value != null && left < swipeMinLeft.value) {
      left = swipeMinLeft.value
    }
  } else if (swipeMaxLeft.value != null && left > swipeMaxLeft.value) {
    left = swipeMaxLeft.value
  }

  leftPosition.value = `${left}px`
}

/**
 * React to the swip action on the inventory slot stopping.
 *
 * Repositions the inventory slot at its original place or trigger the inventory slot change.
 */
function onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection): void {
  if (direction === 'right'
    && props.canGoToPrevious
    && swipeLength.value < -swipeChangeTrigger.value) {
    emits('goToPrevious')
  } else if (direction === 'left'
    && props.canGoToNext
    && swipeLength.value > swipeChangeTrigger.value) {
    emits('goToNext')
  } else {
    leftPosition.value = '0'
  }
}
</script>










<template>
  <div
    class="inventory-slot-container"
    :class="{ 'inventory-slot-container-animated': !isSwiping }"
  >
    <div ref="inventorySlot">
      <Panel class="inventory-slot">
        <template #header>
          <div class="inventory-slot-header">
            <Tooltip
              :apply-hover-style="canGoToPrevious"
              :disabled-on-mobile="true"
              :tooltip="previousInventorySlotType != null ? $t(`caption.slotType${StringUtils.toUpperFirst(previousInventorySlotType)}`) : undefined"
            >
              <Button
                class="p-button-text button-discreet"
                :disabled="!canGoToPrevious"
                @click="emits('goToPrevious')"
              >
                <font-awesome-icon icon="chevron-left" />
              </Button>
            </Tooltip>
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
            <Tooltip
              :apply-hover-style="canGoToNext"
              :disabled-on-mobile="true"
              :tooltip="nextInventorySlotType != null ? $t(`caption.slotType${StringUtils.toUpperFirst(nextInventorySlotType)}`) : undefined"
            >
              <Button
                class="p-button-text button-discreet"
                :disabled="!canGoToNext"
                @click="emits('goToNext')"
              >
                <font-awesome-icon icon="chevron-right" />
              </Button>
            </Tooltip>
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
    </div>
  </div>
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

.inventory-slot-container {
  height: v-bind(containerHeight);
  overflow-x: hidden;
  position: relative;
  width: 100%;
}

.inventory-slot-container > div {
  left: v-bind(leftPosition);
  position: absolute;
  width: 100%;
}

.inventory-slot-container-animated > div {
  transition: all 0.2s ease-in-out;
}

.inventory-slot-custom-icon {
  width: 1.75rem;
}

.inventory-slot-header {
  align-items: center;
  display: flex;
  font-size: 1.35rem;
  font-weight: bolder;
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
  justify-content: center;
  width: 100%;
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