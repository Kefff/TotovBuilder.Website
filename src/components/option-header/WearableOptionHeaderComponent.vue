<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { IItemSortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import { WearableSortingFunctions } from '../../services/sorting/functions/WearableSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    sortingFunctionsOverride?: IItemSortingFunctionList
  }>(),
  {
    sortingFunctionsOverride: undefined
  })

const sortingFunctions = computed(() => props.sortingFunctionsOverride ?? WearableSortingFunctions)
</script>










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