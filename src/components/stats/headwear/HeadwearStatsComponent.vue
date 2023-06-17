<template>
  <ArmorStats
    :item="item"
    :custom-ergonomics-percentage-modifier="item.presetErgonomicsPercentageModifier"
  />
</template>

<script lang="ts" src="./HeadwearStatsComponent.ts" />
<style scoped lang="css" src="./HeadwearStatsComponent.css" />