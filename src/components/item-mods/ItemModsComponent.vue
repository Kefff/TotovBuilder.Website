<template>
  <div v-if="modSlots !== undefined">
    <div
      v-for="(modSlot, index) of modSlots"
      :key="modSlot.id"
    >
      <ModSlot
        v-model="inventoryModSlots[index]"
        :mod-slot-path="modSlotPath"
        :mod-slot="modSlot"
        @update:modelValue="onUpdateModSlot()"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ItemModsComponent.ts" />
<style scoped lang="css" src="./ItemModsComponent.css" />