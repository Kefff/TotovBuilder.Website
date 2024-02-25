<template>
  <div
    v-if="ergonomicsPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ergonomicsPercentageModifier !== 0"
        v-tooltip.top="$t('caption.ergonomics')"
      >
        <span :class="StatsUtils.getValueColorClass(ergonomicsPercentageModifier)">
          {{ StatsUtils.getPercentageDisplayValue(ergonomicsPercentageModifier, true) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="movementSpeedPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="movementSpeedPercentageModifier !== 0"
        v-tooltip.top="$t('caption.movementSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(movementSpeedPercentageModifier)">
          {{ StatsUtils.getPercentageDisplayValue(movementSpeedPercentageModifier, true) }}
        </span>
        <font-awesome-icon
          icon="walking"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="turningSpeedPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="turningSpeedPercentageModifier !== 0"
        v-tooltip.top="$t('caption.turningSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(turningSpeedPercentageModifier)">
          {{ StatsUtils.getPercentageDisplayValue(turningSpeedPercentageModifier, true) }}
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