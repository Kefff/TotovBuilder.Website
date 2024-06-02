<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifierPercentage"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.movementSpeed"
        icon="walking"
        property="movementSpeedModifierPercentage"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.turningSpeed"
        icon="undo"
        property="turningSpeedModifierPercentage"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import SortingData from '../../models/utils/SortingData'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import { WearableSortingFunctions } from '../../services/sorting/functions/WearableSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    sortingFunctionsOverride?: ISortingFunctionList
  }>(),
  {
    sortingFunctionsOverride: undefined
  })

const sortingFunctions = computed(() => props.sortingFunctionsOverride ?? WearableSortingFunctions)
</script>










<style scoped>
@import '../../css/option.css';
</style>