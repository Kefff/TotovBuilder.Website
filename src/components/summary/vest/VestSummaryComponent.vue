<template>
  <ContainerSummary
    :item="item"
  />
  <ArmorSummary
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
</template>

<script lang="ts" src="./VestSummaryComponent.ts" />
<style scoped lang="css" src="./VestSummaryComponent.css" />