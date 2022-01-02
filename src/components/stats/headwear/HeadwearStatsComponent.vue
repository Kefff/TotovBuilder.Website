<template>
  <ArmorStats
    v-if="item.armorClass > 0"
    :item="item"
  />
</template>

<script lang="ts" src="./HeadwearStatsComponent.ts" />
<style scoped lang="css" src="./HeadwearStatsComponent.css" />