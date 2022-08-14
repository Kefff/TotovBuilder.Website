<template>
  <div
    v-if="hasErgonomicsModifier || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.ergonomics')"
      class="option-value"
    >
      <div v-if="hasErgonomicsModifier">
        <span :class="StatsUtils.getValueColorClass(item.ergonomicsModifier)">
          {{ StatsUtils.getDisplayValue(item.ergonomicsModifier, true, false) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="hasRecoilPercentageModifier || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.recoil')"
      class="option-value"
    >
      <div v-if="hasRecoilPercentageModifier">
        <span :class="StatsUtils.getValueColorClass(item.recoilPercentageModifier, true)">
          {{ StatsUtils.getDisplayValue(item.recoilPercentageModifier, true, true) }}
        </span>
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="hasAccuracyPercentageModifier || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.accuracy')"
      class="option-value"
    >
      <div v-if="hasAccuracyPercentageModifier">
        <span :class="StatsUtils.getValueColorClass(item.accuracyPercentageModifier)">
          {{ StatsUtils.getDisplayValue(item.accuracyPercentageModifier, true, true) }}
        </span>
        <font-awesome-icon
          icon="bullseye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponModSummaryComponent.ts" />
<style scoped lang="css" src="./RangedWeaponModSummaryComponent.css" />