<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsModifier"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.recoil"
        icon="arrows-alt"
        property="recoilPercentageModifier"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.accuracy"
        icon="bullseye"
        property="accuracyPercentageModifier"
        :sorting-service="sortingService"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponModOptionHeaderComponent.ts" />
<style scoped lang="css" src="./RangedWeaponModOptionHeaderComponent.css" />