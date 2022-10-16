<template>
  <div v-if="!isInitializing">
    <div
      v-for="(modSlot, index) of inventoryModSlots"
      :key="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
    >
      <ModSlot
        v-if="containerItem.modSlots[index] != undefined"
        v-model="inventoryModSlots[index]"
        :path="path + '/' + modSlotPathPrefix + modSlot.modSlotName"
        :mod-slot="containerItem.modSlots[index]"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />