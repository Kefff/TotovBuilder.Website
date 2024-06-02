<template>
  <div class="option-entry">
    <div class="option-value-long">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.caliber"
        custom-icon="caliber"
        property="caliber"
        :sorting-functions="RangedWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value fire-rate">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.fireRate"
        custom-icon="fire-rate"
        property="fireRate"
        :sorting-functions="RangedWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.verticalRecoil"
        icon="arrows-alt-v"
        property="verticalRecoil"
        :sorting-functions="RangedWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.horizontalRecoil"
        icon="arrows-alt-h"
        property="horizontalRecoil"
        :sorting-functions="RangedWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomics"
        :sorting-functions="RangedWeaponSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import SortingData from '../../models/utils/SortingData'
import { RangedWeaponSortingFunctions } from '../../services/sorting/functions/RangedWeaponSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';

.fire-rate {
  width: 6rem;
}

.option-value-long {
  justify-content: flex-end;
}

.option-value-long > div {
  width: unset;
}
</style>