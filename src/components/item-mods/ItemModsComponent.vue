<template>
  <div v-if="!isInitializing">
    <ModSlot
      v-for="(modSlot, index) of inventoryModSlots"
      :key="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
      v-model="inventoryModSlots[index]"
      :path="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
      :mod-slot="containerItem.modSlots[index]"
    />
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />