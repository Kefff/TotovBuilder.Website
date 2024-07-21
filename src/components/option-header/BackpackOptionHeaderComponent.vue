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
import ItemSortingData from '../../models/utils/ItemSortingData'
import { BackpackSortingFunctions } from '../../services/sorting/functions/BackpackSortingFunctions'
import ContainerOptionHeader from './ContainerOptionHeaderComponent.vue'
import WearableOptionHeader from './WearableOptionHeaderComponent.vue'

const modelSortingData = defineModel<ItemSortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>