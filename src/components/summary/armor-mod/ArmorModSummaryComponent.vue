<template>
  <ArmorSummary
    :item="item"
    :show-empty-entries="showEmptyEntries"
    :custom-ergonomics-percentage-modifier="item.presetErgonomicsPercentageModifier"
  />
</template>

<script lang="ts" src="./ArmorModSummaryComponent.ts" />
<style scoped lang="css" src="./ArmorModSummaryComponent.css" />