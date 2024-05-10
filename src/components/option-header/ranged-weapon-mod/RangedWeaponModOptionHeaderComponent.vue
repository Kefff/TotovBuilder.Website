<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
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
        v-model:sorting-data="sortingDataInternal"
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
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.accuracy"
        icon="bullseye"
        property="accuracyModifierPercentage"
        :sorting-functions="RangedWeaponModSortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponModOptionHeaderComponent.ts" />
<style scoped lang="css" src="./RangedWeaponModOptionHeaderComponent.css" />