<template>
  <div
    v-if="item.blindnessProtectionPercentage !== 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="low-vision"
          class="icon-before-text"
        />
        <span>{{ $t('caption.blindnessProtection') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.blindnessProtectionPercentage)">
        {{ StatsUtils.getDisplayValue(item.blindnessProtectionPercentage, true, true) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./EyewearStatsComponent.ts" />
<style scoped lang="css" src="./EyewearStatsComponent.css" />