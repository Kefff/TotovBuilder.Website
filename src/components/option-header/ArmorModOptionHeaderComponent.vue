<script setup lang="ts">
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { ArmorModSortingFunctions } from '../../services/sorting/functions/ArmorModSortingFunctions'
import ArmorOptionHeader from './ArmorOptionHeaderComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })
</script>










<template>
  <ArmorOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="ArmorModSortingFunctions"
  />
</template>