<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.fleshDamage"
        icon="heart-broken"
        property="fleshDamage"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.penetrationPower"
        icon="bolt"
        property="penetrationPower"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="armor-penetration-placeholder" />
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.fragmentationChance"
        icon="viruses"
        property="fragmentationChancePercentage"
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

<script lang="ts" src="./AmmunitionOptionHeaderComponent.ts" />
<style scoped lang="css" src="./AmmunitionOptionHeaderComponent.css" />