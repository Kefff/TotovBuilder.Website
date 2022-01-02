<template>
  <ArmorSummary
    v-if="hasArmor"
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
  <div
    v-else-if="showEmptyEntries"
    class="armor-placeholder"
  />
</template>

<script lang="ts" src="./ArmorModSummaryComponent.ts" />
<style scoped lang="css" src="./ArmorModSummaryComponent.css" />