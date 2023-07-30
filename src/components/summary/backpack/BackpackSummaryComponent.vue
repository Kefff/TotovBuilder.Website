<template>
  <ContainerSummary :item="item" />
  <WearableSummary
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
</template>

<script lang="ts" src="./BackpackSummaryComponent.ts" />
<style scoped lang="css" src="./BackpackSummaryComponent.css" />