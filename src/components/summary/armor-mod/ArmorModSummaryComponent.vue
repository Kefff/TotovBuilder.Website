<template>
  <ArmorSummary
    :item="item"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="item.presetWearableModifiers"
  />
</template>

<script lang="ts" src="./ArmorModSummaryComponent.ts" />
<style scoped lang="css" src="./ArmorModSummaryComponent.css" />