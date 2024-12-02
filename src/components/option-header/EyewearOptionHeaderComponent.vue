<script setup lang="ts">
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { EyewearSortingFunctions } from '../../services/sorting/functions/EyewearSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })
</script>










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