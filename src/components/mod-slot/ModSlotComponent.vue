<template>
  <div
    v-if="editing || inventoryModSlot.item != null"
    class="mod-slot"
  >
    <div class="mod-slot-slot-name">
      {{ $t('caption.modSlot_' + (modSlot.name.startsWith('chamber') ? 'chamber' : modSlot.name)) }}
      <span
        v-if="modSlot.required"
        v-tooltip.top="$t('caption.requiredMod')"
        :class="inventoryModSlot.item != null ? 'mod-slot-required-ok' : 'mod-slot-required-nok'"
      > *</span>
    </div>
    <Item
      v-model:inventory-item="inventoryModSlot.item"
      :accepted-items="acceptedItems"
      :accepted-items-category-id="acceptedItemsCategoryId"
      :path="`${path}/${itemPathPrefix}${inventoryModSlot.item?.itemId ?? 'empty'}`"
      :max-stackable-amount="modSlot.maxStackableAmount"
    />
  </div>
</template>

<script lang="ts" src="./ModSlotComponent.ts" />
<style scoped lang="css" src="./ModSlotComponent.css" />