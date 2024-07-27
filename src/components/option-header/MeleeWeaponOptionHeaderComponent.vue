<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.chopDamage"
        custom-icon="chop"
        property="chopDamage"
        :sorting-functions="MeleeWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.stabDamage"
        custom-icon="stab"
        property="stabDamage"
        :sorting-functions="MeleeWeaponSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.hitRadius"
        icon="dot-circle"
        property="hitRadius"
        :sorting-functions="MeleeWeaponSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import SortingData from '../../models/utils/SortingData'
import { MeleeWeaponSortingFunctions } from '../../services/sorting/functions/MeleeWeaponSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>