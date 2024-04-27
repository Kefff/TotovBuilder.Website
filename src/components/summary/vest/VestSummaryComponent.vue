<template>
  <ContainerSummary :item="item" />
  <ArmorSummary
    :armor-modifiers-override="armorModifiersOverride"
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
</template>

<script lang="ts" src="./VestSummaryComponent.ts" />
<style scoped lang="css" src="./VestSummaryComponent.css" />