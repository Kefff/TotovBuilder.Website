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
        caption-resource="caption.fragmentsAmount"
        icon="viruses"
        property="fragmentsAmount"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.explosionRadius"
        icon="dot-circle"
        property="maximumExplosionRange"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.explosionDelay"
        icon="stopwatch"
        property="explosionDelay"
        :sorting-service="sortingService"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./GrenadeOptionHeaderComponent.ts" />
<style scoped lang="css" src="./GrenadeOptionHeaderComponent.css" />