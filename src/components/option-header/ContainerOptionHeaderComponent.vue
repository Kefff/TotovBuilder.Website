<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { ContainerSortingFunctions } from '../../services/sorting/functions/ContainerSortingFunctions'
import ISortingFunctionList from '../../services/sorting/functions/ISortingFunctionList'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    sortingFunctionsOverride?: ISortingFunctionList<IItem>
  }>(),
  {
    sortingFunctionsOverride: undefined
  })

const sortingFunctions = computed(() => props.sortingFunctionsOverride ?? ContainerSortingFunctions)
</script>










<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.capacity"
        icon="box-open"
        property="capacity"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>










<style scoped>
@import '../../css/option.css';
</style>