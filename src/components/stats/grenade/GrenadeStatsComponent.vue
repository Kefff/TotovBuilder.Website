<template>
  <div class="stats-line">
    <div
      v-if="item.fragmentsAmount > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="viruses"
          class="icon-before-text"
        />
        <span>{{ $t('caption.fragmentsAmount') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.fragmentsAmount }}
      </div>
    </div>
    <div
      v-if="item.maximumExplosionRange > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.explosionRadius') }} :</span>
      </div>
      <div class="stats-value">
        <span v-if="item.minimumExplosionRange !== item.maximumExplosionRange">{{ $t('caption.explosionRadiusValue', { min: item.minimumExplosionRange, max: item.maximumExplosionRange }) }}</span>
        <span v-else>{{ $t('caption.explosionRadiusSingleValue', { radius: item.maximumExplosionRange }) }}</span>
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="stopwatch"
          class="icon-before-text"
        />
        <span>{{ $t('caption.explosionDelay') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.explosionDelay }}s
      </div>
    </div>
  </div>
  <AmmunitionStats
    v-if="item.fragmentsAmount > 0 && fragmentAmmunition !== undefined"
    :item="fragmentAmmunition"
    :of-grenade="true"
  />
</template>

<script lang="ts" src="./GrenadeStatsComponent.ts" />
<style scoped lang="css" src="./GrenadeStatsComponent.css" />