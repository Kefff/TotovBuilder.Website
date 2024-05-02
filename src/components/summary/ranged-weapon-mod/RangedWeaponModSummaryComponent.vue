<template>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.ergonomics')"
      class="option-value"
    >
      <div v-if="ergonomicsModifier !== 0">
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifier)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.recoilModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.recoil')"
      class="option-value"
    >
      <div v-if="item.recoilModifierPercentage !== 0">
        <span :class="StatsUtils.getValueColorClass(item.recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, item.recoilModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.accuracyModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.accuracy')"
      class="option-value"
    >
      <div v-if="item.accuracyModifierPercentage !== 0">
        <span :class="StatsUtils.getValueColorClass(item.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, item.accuracyModifierPercentage) }}
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