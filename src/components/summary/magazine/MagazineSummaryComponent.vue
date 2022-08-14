<template>
  <ContainerSummary
    :item="item"
  />
  <div
    v-if="hasLoadSpeedPercentageModifier || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="hasLoadSpeedPercentageModifier"
        v-tooltip.top="$t('caption.loadSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(item.loadSpeedPercentageModifier, true)">
          {{ StatsUtils.getDisplayValue(item.loadSpeedPercentageModifier, true, true) }}
        </span>
        <font-awesome-icon
          icon="sync-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="hasCheckSpeedPercentageModifier || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="hasCheckSpeedPercentageModifier"
        v-tooltip.top="$t('caption.checkSpeed')"
      >
        <span :class="StatsUtils.getValueColorClass(item.checkSpeedPercentageModifier, true)">
          {{ StatsUtils.getDisplayValue(item.checkSpeedPercentageModifier, true, true) }}
        </span>
        <font-awesome-icon
          icon="eye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="hasErgonomicsModifier || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="hasErgonomicsModifier"
        v-tooltip.top="$t('caption.ergonomics')"
      >
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
</template>

<script lang="ts" src="./MagazineSummaryComponent.ts" />
<style scoped lang="css" src="./MagazineSummaryComponent.css" />