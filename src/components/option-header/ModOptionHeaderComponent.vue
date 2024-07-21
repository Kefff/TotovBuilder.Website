<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-functions="ModSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import ItemSortingData from '../../models/utils/ItemSortingData'
import { ModSortingFunctions } from '../../services/sorting/functions/ModSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<ItemSortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>