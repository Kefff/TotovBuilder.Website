<template>
  <ArmorOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="ArmorModSortingFunctions"
  />
</template>











<script setup lang="ts">
import ItemSortingData from '../../models/utils/ItemSortingData'
import { ArmorModSortingFunctions } from '../../services/sorting/functions/ArmorModSortingFunctions'
import ArmorOptionHeader from './ArmorOptionHeaderComponent.vue'

const modelSortingData = defineModel<ItemSortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>