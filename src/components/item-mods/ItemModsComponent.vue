<template>
  <div v-if="!isInitializing">
    <div
      v-for="(inventoryModSlot, index) of inventoryModSlotsInternal"
      :key="path + '/' + modSlotPathPrefix + inventoryModSlot.modSlotName"
    >
      <ModSlot
        v-model:inventory-mod-slot="inventoryModSlotsInternal[index]"
        :mod-slot="moddableItemInternal.modSlots[index]"
        :path="path + '/' + modSlotPathPrefix + inventoryModSlot.modSlotName"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />