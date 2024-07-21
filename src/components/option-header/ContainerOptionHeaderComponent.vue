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










<script setup lang="ts">
import { computed } from 'vue'
import ItemSortingData from '../../models/utils/ItemSortingData'
import { ContainerSortingFunctions } from '../../services/sorting/functions/ContainerSortingFunctions'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<ItemSortingData>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    sortingFunctionsOverride?: ISortingFunctionList
  }>(),
  {
    sortingFunctionsOverride: undefined
  })

const sortingFunctions = computed(() => props.sortingFunctionsOverride ?? ContainerSortingFunctions)
</script>










<style scoped>
@import '../../css/option.css';
</style>