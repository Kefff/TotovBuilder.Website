<template>
  <div class="option-entry">
    <div class="option-value-long">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.caliber"
        custom-icon="caliber"
        property="caliber"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value fire-rate">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.fireRate"
        custom-icon="fire-rate"
        property="fireRate"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomics"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.verticalRecoil"
        icon="arrows-alt-v"
        property="verticalRecoil"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.horizontalRecoil"
        icon="arrows-alt-h"
        property="horizontalRecoil"
        :sorting-service="sortingService"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponOptionHeaderComponent.ts" />
<style scoped lang="css" src="./RangedWeaponOptionHeaderComponent.css" />