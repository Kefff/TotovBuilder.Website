<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img src="/assets/caliber.webp">
        <span>{{ $t('caption.caliber') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.' + StringUtils.toLowerFirst(item.caliber)) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img src="/assets/fire-rate.webp">
        <span>{{ $t('caption.fireRate') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.fireRateValue', { fireRate: item.fireRate }) }}
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.ergonomics }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt-v"
          class="icon-before-text"
        />
        <span>{{ $t('caption.verticalRecoil') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.verticalRecoil }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt-h"
          class="icon-before-text"
        />
        <span>{{ $t('caption.horizontalRecoil') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.horizontalRecoil }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponStatsComponent.ts" />
<style scoped lang="css" src="./RangedWeaponStatsComponent.css" />