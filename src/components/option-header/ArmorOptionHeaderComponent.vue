<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { ArmorSortingFunctions } from '../../services/sorting/functions/ArmorSortingFunctions'
import { IItemSortingFunctionList } from '../../services/sorting/functions/ISortingFunctionList'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'
import WearableOptionHeader from './WearableOptionHeaderComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })

const props = withDefaults(
  defineProps<{
    sortingFunctionsOverride?: IItemSortingFunctionList
  }>(),
  {
    sortingFunctionsOverride: undefined
  })

const sortingFunctions = computed(() => props.sortingFunctionsOverride ?? ArmorSortingFunctions)
</script>










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