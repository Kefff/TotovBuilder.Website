<template>
  <ArmorStats
    v-if="item.armorClass > 0"
    :item="item"
    :forced-ergonomics-percentage-modifier="item.presetErgonomicsPercentageModifier"
  />
</template>

<script lang="ts" src="./HeadwearStatsComponent.ts" />
<style scoped lang="css" src="./HeadwearStatsComponent.css" />