<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.caliber')"
      class="option-value-long custom-icon-after-text"
    >
      <div>{{ $t('caption.' + StringUtils.toLowerFirst(item.caliber)) }}</div>
      <img :src="Images.caliber">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.fireRate')"
      class="option-value fire-rate custom-icon-after-text"
    >
      <div>{{ $t('caption.fireRateValueShort', { fireRate: item.fireRate }) }}</div>
      <img :src="Images.fireRate">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.ergonomics')"
      class="option-value"
    >
      <span>{{ StatsUtils.getDisplayValue(item.presetErgonomics ?? item.ergonomics, false, 0) }}</span>
      <font-awesome-icon
        icon="hand-paper"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.verticalRecoil')"
      class="option-value"
    >
      <span>{{ StatsUtils.getDisplayValue(item.presetVerticalRecoil ?? item.verticalRecoil, false, 0) }}</span>
      <font-awesome-icon
        icon="arrows-alt-v"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.horizontalRecoil')"
      class="option-value"
    >
      <span>{{ StatsUtils.getDisplayValue(item.presetHorizontalRecoil ?? item.horizontalRecoil, false, 0) }}</span>
      <font-awesome-icon
        icon="arrows-alt-h"
        class="icon-after-text"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponSummaryComponent.ts" />
<style scoped lang="css" src="./RangedWeaponSummaryComponent.css" />