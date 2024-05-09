<template>
  <div v-if="!isInitializing">
    <div
      v-for="(modSlot, index) of inventoryModSlotsInternal"
      :key="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
    >
      <ModSlot
        v-if="containerItem.modSlots[index] != null"
        v-model:inventory-mod-slot="inventoryModSlotsInternal[index]"
        :mod-slot="containerItem.modSlots[index]"
        :path="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />