<script setup lang="ts">
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { VestSortingFunctions } from '../../services/sorting/functions/VestSortingFunctions'
import ArmorOptionHeader from './ArmorOptionHeaderComponent.vue'
import ContainerOptionHeader from './ContainerOptionHeaderComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })
</script>










<template>
  <ContainerOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="VestSortingFunctions"
  />
  <ArmorOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="VestSortingFunctions"
  />
</template>