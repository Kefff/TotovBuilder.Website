<template>
  <ArmorStats
    v-if="item.armorClass > 0"
    :item="item"
  />
  <ContainerStats :item="item" />
</template>

<script lang="ts" src="./VestStatsComponent.ts" />
<style scoped lang="css" src="./VestStatsComponent.css" />