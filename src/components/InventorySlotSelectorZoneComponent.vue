<script setup lang="ts">
import { computed } from 'vue'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IItem } from '../models/item/IItem'
import StringUtils from '../utils/StringUtils'
import ItemIcon from './ItemIconComponent.vue'

const modelCurrentInventorySlotType = defineModel<InventorySlotTypeId>('currentInventorySlotType')

const props = withDefaults(
  defineProps<{
    isEditing: boolean,
    itemZoneHeight: string,
    itemZoneLeft: string,
    itemZoneTop: string,
    itemZoneWidth: string,
    slotContent?: {
      item: IItem
      quantity: number
    },
    slotType: InventorySlotTypeId,
    showText?: boolean,
    textZoneHeight?: string,
    textZoneLeft?: string,
    textZonePadding?: string,
    textZoneTop?: string,
    textZoneWidth?: string,
  }>(),
  {
    showText: true,
    slotContent: undefined,
    textZoneHeight: undefined,
    textZoneLeft: undefined,
    textZonePadding: undefined,
    textZoneTop: undefined,
    textZoneWidth: undefined
  })

const canBeClicked = computed(() => props.slotContent != null || props.isEditing)

/**
 * Reacts to the click in a zone.
 *
 * Updates the current inventory slot type.
 */
function onZoneClick(type: InventorySlotTypeId): void {
  modelCurrentInventorySlotType.value = type
}
</script>










<template>
  <div
    class="inventory-slots-selector-zone inventory-slots-selector-zone-item"
    :class="{ 'inventory-slots-selector-zone-current': modelCurrentInventorySlotType === slotType }"
  >
    <ItemIcon
      v-if="slotContent != null"
      :item="slotContent.item"
      :quantity="slotContent.quantity"
    />
    <div
      v-if="canBeClicked"
      class="inventory-slots-selector-zone-item-overlay"
      @click="onZoneClick(slotType)"
    />
  </div>
  <div
    v-if="showText"
    class="inventory-slots-selector-zone inventory-slots-selector-zone-text"
  >
    <span>{{ $t('caption.slotType' + StringUtils.toUpperFirst(slotType)).toLocaleUpperCase() }}</span>
    <div
      v-if="canBeClicked"
      class="inventory-slots-selector-zone-text-overlay"
      @click="onZoneClick(slotType)"
    />
  </div>
</template>










<style scoped>
.inventory-slots-selector-zone {
  background-color:
    transparent;
  /*rgba(0, 255, 0, 0.15);*/
  display: flex;
  left: v-bind(itemZoneLeft);
  position: absolute;
  top: v-bind(itemZoneTop);
  width: v-bind(itemZoneWidth);
}

.inventory-slots-selector-zone-current {
  border-color: var(--primary-color);
  border-style: solid;
}

.inventory-slots-selector-zone-item {
  align-items: center;
  height: v-bind(itemZoneHeight);
  justify-content: center;
}

.inventory-slots-selector-zone-item-overlay {
  height: 100%;
  position: absolute;
  width: 100%;
}

.inventory-slots-selector-zone-item-overlay:hover {
  background-color: var(--primary-color6);
  cursor: pointer;
}

.inventory-slots-selector-zone-text {
  font-size: 0.75rem;
  height: v-bind(textZoneHeight);
  left: v-bind(textZoneLeft);
  padding-left: v-bind(textZonePadding);
  padding-right: v-bind(textZonePadding);
  top: v-bind(textZoneTop);
  width: v-bind(textZoneWidth);
}

.inventory-slots-selector-zone-text-overlay {
  height: 100%;
  position: absolute;
  width: 100%;
}

.inventory-slots-selector-zone-text-overlay:hover {
  background-color: var(--primary-color6);
  cursor: pointer;
}
</style>










<style>
.inventory-slots-selector-zone-item > .item-icon {
  border-color: var(--primary-color6);
  border-radius: 0;
  border-style: solid;
  border-width: 1px;
  height: 100%;
  width: 100%;
}

.inventory-slots-selector-zone-item > .item-icon > img {
  flex-grow: 1;
  max-height: unset;
  max-width: unset;
}
</style>