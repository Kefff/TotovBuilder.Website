<template>
  <ContainerOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="VestSortingFunctions"
  />
  <ArmorOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="VestSortingFunctions"
  />
</template>

<script lang="ts" src="./VestOptionHeaderComponent.ts" />
<style scoped lang="css" src="./VestOptionHeaderComponent.css" />