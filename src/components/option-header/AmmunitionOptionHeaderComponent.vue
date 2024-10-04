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
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="modelSortingData"
        caption-resource="caption.armorPenetration"
        icon="award"
        property="penetratedArmorLevel"
        :sorting-functions="AmmunitionSortingFunctions"
      />
    </div>
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
        property="recoilModifier"
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
import { IItem } from '../../models/item/IItem'
import SortingData from '../../models/utils/SortingData'
import { AmmunitionSortingFunctions } from '../../services/sorting/functions/AmmunitionSortingFunctions'
import OptionHeaderSortButton from './OptionHeaderSortButtonComponent.vue'

const modelSortingData = defineModel<SortingData<IItem>>('sortingData', { required: true })
</script>










<style scoped>
@import '../../css/option.css';
</style>