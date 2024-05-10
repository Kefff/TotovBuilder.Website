<template>
  <ArmorOptionHeader
    v-model:sorting-data="sortingDataInternal"
    :sorting-functions-override="ArmorModSortingFunctions"
  />
</template>

<script lang="ts" src="./ArmorModOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ArmorModOptionHeaderComponent.css" />