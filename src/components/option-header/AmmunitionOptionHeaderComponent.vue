<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.fleshDamage"
        icon="heart-broken"
        property="fleshDamage"
        :sorting-functions="AmmunitionSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.penetrationPower"
        icon="bolt"
        property="penetrationPower"
        :sorting-functions="AmmunitionSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="ammunition-option-header-armor-penetration-placeholder" />
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.fragmentationChance"
        icon="viruses"
        property="fragmentationChance"
        :sorting-functions="AmmunitionSortingFunctions"
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
        :sorting-functions="AmmunitionSortingFunctions"
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
        :sorting-functions="AmmunitionSortingFunctions"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import SortingData from '../../models/utils/SortingData'
import { AmmunitionSortingFunctions } from '../../services/sorting/functions/AmmunitionSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';

.ammunition-option-header-armor-penetration-placeholder {
  width: 10.25rem;
  /* 6 penetrated armor of 1rem + 5 margins of 0.25rem + 6 armor classes of 0.5rem */
}
</style>