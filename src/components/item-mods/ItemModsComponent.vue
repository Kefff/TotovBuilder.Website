<template>
  <div v-if="!isInitializing">
    <div
      v-for="(modSlot, index) of inventoryModSlotsInternal"
      :key="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
    >
      <ModSlot
        v-if="containerItem.modSlots[index] != null"
        v-model="inventoryModSlotsInternal[index]"
        :path="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
        :mod-slot="containerItem.modSlots[index]"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />