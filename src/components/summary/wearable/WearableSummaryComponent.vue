<template>
  <div
    v-if="ergonomicsModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ergonomicsModifierPercentage !== 0"
        v-tooltip.top="$t('caption.ergonomics')"
      >
        <span :class="StatsUtils.getValueColorClass(ergonomicsModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, ergonomicsModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="movementSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="movementSpeedModifierPercentage !== 0"
        v-tooltip.top="$t('caption.movementSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(movementSpeedModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, movementSpeedModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="walking"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="turningSpeedModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="turningSpeedModifierPercentage !== 0"
        v-tooltip.top="$t('caption.turningSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(turningSpeedModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, turningSpeedModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="undo"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./WearableSummaryComponent.ts" />
<style scoped lang="css" src="./WearableSummaryComponent.css" />