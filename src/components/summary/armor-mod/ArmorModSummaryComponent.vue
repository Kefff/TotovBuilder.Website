<template>
  <ArmorSummary
    v-if="item.armorClass > 0"
    :item="item"
    :show-empty-entries="showEmptyEntries"
    :custom-ergonomics-percentage-modifier="item.presetErgonomicsPercentageModifier"
  />
  <div
    v-else-if="showEmptyEntries"
    class="armor-placeholder"
  />
</template>

<script lang="ts" src="./ArmorModSummaryComponent.ts" />
<style scoped lang="css" src="./ArmorModSummaryComponent.css" />