<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.fleshDamage"
        icon="heart-broken"
        property="fleshDamage"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.fragmentsAmount"
        icon="viruses"
        property="fragmentsAmount"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.explosionRadius"
        icon="dot-circle"
        property="maximumExplosionRange"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.explosionDelay"
        icon="stopwatch"
        property="explosionDelay"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import SortingData from '../../models/utils/SortingData'
import { GrenadeSortingFunctions } from '../../services/sorting/functions/GrenadeSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>