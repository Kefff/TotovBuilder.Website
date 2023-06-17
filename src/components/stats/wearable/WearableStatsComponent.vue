<template>
  <div
    v-if="ergonomicsPercentageModifier !== 0 || item.movementSpeedPercentageModifier !== 0 || item.turningSpeedPercentageModifier !== 0"
    class="stats-line"
  >
    <div
      v-if="ergonomicsPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsPercentageModifier)">
        {{ StatsUtils.getDisplayValue(ergonomicsPercentageModifier, true, true) }}
      </div>
    </div>
    <div
      v-if="item.movementSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="walking"
          class="icon-before-text"
        />
        <span>{{ $t('caption.movementSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.movementSpeedPercentageModifier)">
        {{ StatsUtils.getDisplayValue(item.movementSpeedPercentageModifier, true, true) }}
      </div>
    </div>
    <div
      v-if="item.turningSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.turningSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.turningSpeedPercentageModifier)">
        {{ StatsUtils.getDisplayValue(item.turningSpeedPercentageModifier, true, true) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./WearableStatsComponent.ts" />
<style scoped lang="css" src="./WearableStatsComponent.css" />