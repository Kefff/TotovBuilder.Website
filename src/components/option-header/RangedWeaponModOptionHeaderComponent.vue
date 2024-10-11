<script setup lang="ts">
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { RangedWeaponModSortingFunctions } from '../../services/sorting/functions/RangedWeaponModSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })
</script>










<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-functions="RangedWeaponModSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.recoil"
        icon="arrows-alt"
        property="recoilModifierPercentage"
        :sorting-functions="RangedWeaponModSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.accuracy"
        icon="bullseye"
        property="accuracyModifierPercentage"
        :sorting-functions="RangedWeaponModSortingFunctions"
      />
    </div>
  </div>
</template>










<style scoped>
@import '../../css/option.css';
</style>