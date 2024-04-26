<template>
  <ContainerSummary :item="item" />
  <div
    v-if="item.loadSpeedPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.loadSpeedPercentageModifier !== 0"
        v-tooltip.top="$t('caption.loadSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(item.loadSpeedPercentageModifier, true)">
          {{ StatsUtils.getPercentageDisplayValue(item.loadSpeedPercentageModifier, true) }}
        </span>
        <font-awesome-icon
          icon="sync-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.checkSpeedPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.checkSpeedPercentageModifier !== 0"
        v-tooltip.top="$t('caption.checkSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(item.checkSpeedPercentageModifier, true)">
          {{ StatsUtils.getPercentageDisplayValue(item.checkSpeedPercentageModifier, true) }}
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
          {{ StatsUtils.getDisplayValue(ergonomicsModifier, true) }}
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