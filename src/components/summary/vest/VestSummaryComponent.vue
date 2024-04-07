<template>
  <ContainerSummary :item="item" />
  <ArmorSummary
    :armor-plate-modifiers-override="armorPlateModifiersOverride"
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
</template>

<script lang="ts" src="./VestSummaryComponent.ts" />
<style scoped lang="css" src="./VestSummaryComponent.css" />