<template>
  <div v-if="!isInitializing">
    <ModSlot
      v-for="(modSlot, index) of containerItem.modSlots"
      :key="path + '/' + modSlotPathPrefix + modSlot.name"
      v-model="inventoryModSlots[index]"
      :path="path + '/' + modSlotPathPrefix + modSlot.name"
      :mod-slot="modSlot"
    />
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />