<template>
  <div
    v-if="ergonomicsPercentageModifier !== 0 || movementSpeedPercentageModifier !== 0 || turningSpeedPercentageModifier !== 0"
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
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, ergonomicsPercentageModifier) }}
      </div>
    </div>
    <div
      v-if="movementSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="walking"
          class="icon-before-text"
        />
        <span>{{ $t('caption.movementSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(movementSpeedPercentageModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, movementSpeedPercentageModifier) }}
      </div>
    </div>
    <div
      v-if="turningSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="undo"
          class="icon-before-text"
        />
        <span>{{ $t('caption.turningSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(turningSpeedPercentageModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, turningSpeedPercentageModifier) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./WearableStatsComponent.ts" />
<style scoped lang="css" src="./WearableStatsComponent.css" />