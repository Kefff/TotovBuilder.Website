<template>
  <div
    v-if="ergonomicsModifier !== 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsModifier)">
        {{ StatsUtils.getDisplayValue(ergonomicsModifier, true, 1) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ModStatsComponent.ts" />
<style scoped lang="css" src="./ModStatsComponent.css" />