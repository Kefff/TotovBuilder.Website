<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img src="/assets/chop.webp">
        <span>{{ $t('caption.chopDamage') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.chopDamage }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img src="/assets/stab.webp">
        <span>{{ $t('caption.stabDamage') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.stabDamage }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.hitRadius') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.hitRadius }}m
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./MeleeWeaponStatsComponent.ts" />
<style scoped lang="css" src="./MeleeWeaponStatsComponent.css" />