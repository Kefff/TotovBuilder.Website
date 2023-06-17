<template>
  <ContainerOptionHeader
    v-model="sortingData"
    :sorting-functions-override="sortingFunctions"
  />
  <WearableOptionHeader
    v-model="sortingData"
    :sorting-functions-override="sortingFunctions"
  />
</template>

<script lang="ts" src="./BackpackOptionHeaderComponent.ts" />
<style scoped lang="css" src="./BackpackOptionHeaderComponent.css" />