<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.blindnessProtection"
        icon="low-vision"
        property="blindnessProtectionPercentage"
        :sorting-functions="EyewearSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import ItemSortingData from '../../models/utils/ItemSortingData'
import { EyewearSortingFunctions } from '../../services/sorting/functions/EyewearSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<ItemSortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>