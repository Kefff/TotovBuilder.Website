<template>
  <ContainerSummary :item="item" />
  <div
    v-if="item.loadSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.loadSpeedModifierPercentage !== 0"
        v-tooltip.top="$t('caption.loadSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(item.loadSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, item.loadSpeedModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="sync-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.checkSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.checkSpeedModifierPercentage !== 0"
        v-tooltip.top="$t('caption.checkSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(item.checkSpeedModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, item.checkSpeedModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="eye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="ergonomicsModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ergonomicsModifier !== 0"
        v-tooltip.top="$t('caption.ergonomics')"
      >
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
</template>

<script lang="ts" src="./MagazineSummaryComponent.ts" />
<style scoped lang="css" src="./MagazineSummaryComponent.css" />