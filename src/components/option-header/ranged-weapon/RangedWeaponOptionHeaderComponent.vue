<template>
  <div class="option-entry">
    <div class="option-value-long">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.caliber"
        custom-icon="caliber"
        property="caliber"
        :sorting-functions="sortingFunctions"
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
        :sorting-functions="sortingFunctions"
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
        :sorting-functions="sortingFunctions"
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
        :sorting-functions="sortingFunctions"
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
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponOptionHeaderComponent.ts" />
<style scoped lang="css" src="./RangedWeaponOptionHeaderComponent.css" />