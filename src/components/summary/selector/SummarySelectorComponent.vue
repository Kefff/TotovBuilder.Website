<template>
  <ItemSummary
    v-if="item != null"
    :item="item"
  >
    <component
      :is="specializedComponent"
      v-if="specializedComponent != null"
      :item="item"
    />
  </ItemSummary>
</template>

<script lang="ts" src="./SummarySelectorComponent.ts" />
<style scoped lang="css" src="./SummarySelectorComponent.css" />