<template>
  <div v-if="modSlots !== undefined">
    <ModSlot
      v-for="(modSlot, index) of modSlots"
      :key="path + '/' + modSlotPathPrefix + modSlot.name"
      v-model="inventoryModSlots[index]"
      :path="path + modSlot.name"
      :mod-slot="modSlot"
      @update:modelValue="onUpdateModSlot()"
    />
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />