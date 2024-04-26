<template>
  <ItemOptionHeader
    v-model:sortingData="updatableSortingData"
    v-model:filter="updatableFilter"
    :use-longest-header-width="useLongestHeaderWidth"
  >
    <component
      :is="specializedComponent"
      v-if="specializedComponent != null"
      v-model="updatableSortingData"
    />
  </ItemOptionHeader>
</template>

<script lang="ts" src="./OptionHeaderSelectorComponent.ts" />
<style scoped lang="css" src="./OptionHeaderSelectorComponent.css" />