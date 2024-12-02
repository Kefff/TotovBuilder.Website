<script setup lang="ts">
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { MagazineSortingFunctions } from '../../services/sorting/functions/MagazineSortingFunctions'
import ContainerOptionHeader from './ContainerOptionHeaderComponent.vue'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })
</script>










<template>
  <ContainerOptionHeader
    v-model:sorting-data="modelSortingData"
    :sorting-functions-override="MagazineSortingFunctions"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.loadSpeed"
        icon="sync-alt"
        property="loadSpeedModifierPercentage"
        :sorting-functions="MagazineSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.checkSpeed"
        icon="eye"
        property="checkSpeedModifierPercentage"
        :sorting-functions="MagazineSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-functions="MagazineSortingFunctions"
      />
    </div>
  </div>
</template>