<template>
  <ContainerOptionHeader
    v-model="sortingData"
    :sorting-functions-override="sortingFunctions"
  />
  <ArmorOptionHeader
    v-model="sortingData"
    :sorting-functions-override="sortingFunctions"
  />
</template>

<script lang="ts" src="./VestOptionHeaderComponent.ts" />
<style scoped lang="css" src="./VestOptionHeaderComponent.css" />