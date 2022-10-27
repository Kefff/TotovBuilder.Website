<template>
  <div
    v-if="editing || modelValue.item != null "
    class="mod-slot"
  >
    <div class="slot-name">
      {{ $t('caption.modSlot_' + (modSlot.name.startsWith('chamber') ? 'chamber' : modSlot.name)) }}
      <span
        v-if="modSlot.required"
        v-tooltip.top="$t('caption.requiredMod')"
        :class="modelValue.item != null ? 'required-ok' : 'required-nok'"
      > *</span>
    </div>
    <Item
      v-model="modelValue.item"
      :accepted-items="acceptedItems"
      :category-ids="categoryIds"
      :path="path + '/' + itemPathPrefix + (modelValue.item?.itemId ?? 'empty')"
      :max-stackable-amount="modSlot.maxStackableAmount"
    />
  </div>
</template>

<script lang="ts" src="./ModSlotComponent.ts" />
<style scoped lang="css" src="./ModSlotComponent.css" />