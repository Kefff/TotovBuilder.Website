<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.armorClass"
        icon="award"
        property="armorClass"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.durability"
        icon="heart"
        property="durability"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
  <WearableOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="sortingFunctions"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import SortingData from '../../models/utils/SortingData'
import { ArmorSortingFunctions } from '../../services/sorting/functions/ArmorSortingFunctions'
import { ISortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'
import WearableOptionHeader from './WearableOptionHeaderComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    sortingFunctionsOverride?: ISortingFunctionList
  }>(),
  {
    sortingFunctionsOverride: undefined
  })

const sortingFunctions = computed(() => props.sortingFunctionsOverride ?? ArmorSortingFunctions)
</script>










<style scoped>
@import '../../css/option.css';
</style>