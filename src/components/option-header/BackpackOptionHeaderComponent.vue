<template>
  <ContainerOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="BackpackSortingFunctions"
  />
  <WearableOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="BackpackSortingFunctions"
  />
</template>










<script setup lang="ts">
import SortingData from '../../models/utils/SortingData'
import { BackpackSortingFunctions } from '../../services/sorting/functions/BackpackSortingFunctions'
import ContainerOptionHeader from './ContainerOptionHeaderComponent.vue'
import WearableOptionHeader from './wearable/WearableOptionHeaderComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>