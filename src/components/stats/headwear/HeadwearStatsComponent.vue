<template>
  <ArmorStats
    :item="item"
    :wearable-modifiers-override="item.presetWearableModifiers"
  />
</template>

<script lang="ts" src="./HeadwearStatsComponent.ts" />
<style scoped lang="css" src="./HeadwearStatsComponent.css" />