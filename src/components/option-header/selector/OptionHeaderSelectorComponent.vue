<template>
  <ItemOptionHeader
    v-model:sortingData="sortingDataInternal"
    v-model:filter="updatableFilter"
    :use-longest-header-width="useLongestHeaderWidth"
  >
    <component
      :is="specializedComponent"
      v-if="specializedComponent != null"
      v-model="sortingDataInternal"
    />
  </ItemOptionHeader>
</template>

<script lang="ts" src="./OptionHeaderSelectorComponent.ts" />
<style scoped lang="css" src="./OptionHeaderSelectorComponent.css" />