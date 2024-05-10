<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.fleshDamage"
        icon="heart-broken"
        property="fleshDamage"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.fragmentsAmount"
        icon="viruses"
        property="fragmentsAmount"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.explosionRadius"
        icon="dot-circle"
        property="maximumExplosionRange"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model:sorting-data="sortingDataInternal"
        caption-resource="caption.explosionDelay"
        icon="stopwatch"
        property="explosionDelay"
        :sorting-functions="GrenadeSortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./GrenadeOptionHeaderComponent.ts" />
<style scoped lang="css" src="./GrenadeOptionHeaderComponent.css" />