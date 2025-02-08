<script setup lang="ts">
import { computed } from 'vue'
import Images from '../images'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IItem } from '../models/item/IItem'
import InventorySlotSelectorZone from './InventorySlotSelectorZoneComponent.vue'

const modelCurrentInventorySlotType = defineModel<InventorySlotTypeId>('currentInventorySlotType')

const props = defineProps<{
  inventorySlotsShoppingListItems: IShoppingListItem[],
  isEditing: boolean
}>()

const _zoneColumn1Left = '2.25rem'
const _zoneColumn2Left = '11.1rem'
const _zoneColumn3Left = '20rem'
const _zoneItemHeight = '6.1rem'
const _zoneItemLine1Top = '2.4rem'
const _zoneItemLine2Top = '10.4rem'
const _zoneItemLine3Top = '18.45rem'
const _zoneItemLine4Top = '26.65rem'
const _zoneItemLine5Top = '34.85rem'
const _zoneItemLine6Top = '42.8rem'
const _zoneItemLine7Top = '50rem'
const _zoneItemSmallColumn1Left = _zoneColumn1Left
const _zoneItemSmallColumn2Left = '8.49rem'
const _zoneItemSmallColumn3Left = '14.6rem'
const _zoneItemSmallColumn4Left = '20.70rem'
const _zoneItemSmallHeight = '5.35rem'
const _zoneItemSmallWidth = _zoneItemSmallHeight
const _zoneItemWidth = _zoneItemHeight
const _zoneItemWidthColspan2 = '15rem'
const _zoneTextHeight = '0.85rem'
const _zoneTextLine1Top = '1.35rem'
const _zoneTextLine2Top = '9.3rem'
const _zoneTextLine3Top = '17.4rem'
const _zoneTextLine4Top = '25.6rem'
const _zoneTextLine5Top = '33.75rem'
const _zoneTextLine6Top = '41.65rem'
const _zoneTextLine7Top = '48.95rem'
const _zoneTextPadding = '0.1rem'
const _zoneTextWidth = _zoneItemWidth
const _zoneTextWidthColspan2 = _zoneItemWidthColspan2

const inventorySlotItems = computed(() => {
  const items = props.inventorySlotsShoppingListItems.map(issli => ({
    slot: issli.inventorySlotId!,
    item: issli.item,
    quantity: issli.quantity
  }))
  const result: Record<string, { item: IItem, quantity: number }> = {}

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i]
    const count = items.filter(i => i.slot === item.slot).length

    if (count > 1) {
      item.slot = `${item.slot}${count}`
    }

    result[item.slot] = { item: item.item, quantity: item.quantity }

    if (result[item.slot].quantity > result[item.slot].item.maxStackableAmount) {
      result[item.slot].quantity = result[item.slot].item.maxStackableAmount
    }
  }

  return result
})
</script>










<template>
  <div class="inventory-slots-selector">
    <div class="inventory-slots-selector-image-container">
      <img
        class="inventory-slots-selector-image"
        :src="Images.inventorySlotsSelection"
      >

      <!-- Earpiece -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn1Left"
        :item-zone-top="_zoneItemLine1Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.earpiece]"
        :slot-type="InventorySlotTypeId.earpiece"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine1Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Headwear -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn2Left"
        :item-zone-top="_zoneItemLine1Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.headwear]"
        :slot-type="InventorySlotTypeId.headwear"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn2Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine1Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Face cover -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn3Left"
        :item-zone-top="_zoneItemLine1Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.faceCover]"
        :slot-type="InventorySlotTypeId.faceCover"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn3Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine1Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Armband -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn1Left"
        :item-zone-top="_zoneItemLine2Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.armband]"
        :slot-type="InventorySlotTypeId.armband"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine2Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Body armor -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn2Left"
        :item-zone-top="_zoneItemLine2Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.bodyArmor]"
        :slot-type="InventorySlotTypeId.bodyArmor"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn2Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine2Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Eyewear -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn3Left"
        :item-zone-top="_zoneItemLine2Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.eyewear]"
        :slot-type="InventorySlotTypeId.eyewear"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn3Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine2Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- On sling -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn1Left"
        :item-zone-top="_zoneItemLine3Top"
        :item-zone-width="_zoneItemWidthColspan2"
        :slot-content="inventorySlotItems[InventorySlotTypeId.onSling]"
        :slot-type="InventorySlotTypeId.onSling"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine3Top"
        :text-zone-width="_zoneTextWidthColspan2"
      />

      <!-- Holster -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn3Left"
        :item-zone-top="_zoneItemLine3Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.holster]"
        :slot-type="InventorySlotTypeId.holster"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn3Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine3Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- On back -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn1Left"
        :item-zone-top="_zoneItemLine4Top"
        :item-zone-width="_zoneItemWidthColspan2"
        :slot-content="inventorySlotItems[InventorySlotTypeId.onBack]"
        :slot-type="InventorySlotTypeId.onBack"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine4Top"
        :text-zone-width="_zoneTextWidthColspan2"
      />

      <!-- Scabbard -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn3Left"
        :item-zone-top="_zoneItemLine4Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.scabbard]"
        :slot-type="InventorySlotTypeId.scabbard"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn3Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine4Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Tactical rig -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn1Left"
        :item-zone-top="_zoneItemLine5Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.tacticalRig]"
        :slot-type="InventorySlotTypeId.tacticalRig"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine5Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Backpack -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn2Left"
        :item-zone-top="_zoneItemLine5Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.backpack]"
        :slot-type="InventorySlotTypeId.backpack"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn2Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine5Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Pouch -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemHeight"
        :item-zone-left="_zoneColumn3Left"
        :item-zone-top="_zoneItemLine5Top"
        :item-zone-width="_zoneItemWidth"
        :slot-content="inventorySlotItems[InventorySlotTypeId.pouch]"
        :slot-type="InventorySlotTypeId.pouch"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn3Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine5Top"
        :text-zone-width="_zoneTextWidth"
      />

      <!-- Pockets -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn1Left"
        :item-zone-top="_zoneItemLine6Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.pockets}`]"
        :slot-type="InventorySlotTypeId.pockets"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine6Top"
        :text-zone-width="_zoneTextWidth"
      />
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn2Left"
        :item-zone-top="_zoneItemLine6Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.pockets}2`]"
        :slot-type="InventorySlotTypeId.pockets"
        :show-text="false"
      />
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn3Left"
        :item-zone-top="_zoneItemLine6Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.pockets}3`]"
        :slot-type="InventorySlotTypeId.pockets"
        :show-text="false"
      />
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn4Left"
        :item-zone-top="_zoneItemLine6Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.pockets}4`]"
        :slot-type="InventorySlotTypeId.pockets"
        :show-text="false"
      />

      <!-- Special -->
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn1Left"
        :item-zone-top="_zoneItemLine7Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.special}`]"
        :slot-type="InventorySlotTypeId.special"
        :text-zone-height="_zoneTextHeight"
        :text-zone-left="_zoneColumn1Left"
        :text-zone-padding="_zoneTextPadding"
        :text-zone-top="_zoneTextLine7Top"
        :text-zone-width="_zoneTextWidth"
      />
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn2Left"
        :item-zone-top="_zoneItemLine7Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.special}2`]"
        :slot-type="InventorySlotTypeId.special"
        :show-text="false"
      />
      <InventorySlotSelectorZone
        v-model:current-inventory-slot-type="modelCurrentInventorySlotType"
        :is-editing="isEditing"
        :item-zone-height="_zoneItemSmallHeight"
        :item-zone-left="_zoneItemSmallColumn3Left"
        :item-zone-top="_zoneItemLine7Top"
        :item-zone-width="_zoneItemSmallWidth"
        :slot-content="inventorySlotItems[`${InventorySlotTypeId.special}3`]"
        :slot-type="InventorySlotTypeId.special"
        :show-text="false"
      />
    </div>
  </div>
</template>










<style scoped>
.inventory-slots-selector {
  position: relative;
}

.inventory-slots-selector-image-container {
  border-color: var(--primary-color6);
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  overflow: hidden;
  position: sticky;
  top: 5rem;
  width: 28.5rem;
}

.inventory-slots-selector-image {
  height: 100%;
  width: 100%;
}
</style>