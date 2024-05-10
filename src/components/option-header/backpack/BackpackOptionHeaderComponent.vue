<template>
  <ContainerOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="BackpackSortingFunctions"
  />
  <WearableOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="BackpackSortingFunctions"
  />
</template>

<script lang="ts" src="./BackpackOptionHeaderComponent.ts" />
<style scoped lang="css" src="./BackpackOptionHeaderComponent.css" />