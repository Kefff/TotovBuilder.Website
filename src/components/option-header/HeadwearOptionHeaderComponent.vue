<template>
  <ArmorOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="HeadwearSortingFunctions"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.ricochetChance"
        custom-icon="ricochet"
        property="ricochetChance"
        :sorting-functions="HeadwearSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import SortingData from '../../models/utils/SortingData'
import { HeadwearSortingFunctions } from '../../services/sorting/functions/HeadwearSortingFunctions'
import ArmorOptionHeader from './ArmorOptionHeaderComponent.vue'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>