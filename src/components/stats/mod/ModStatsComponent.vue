<template>
  <div
    v-if="item.ergonomicsModifier !== 0"
    class="stats-line"
  >
    <div
      v-if="item.ergonomicsModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.ergonomicsModifier)">
        {{ StatsUtils.getDisplayValue(item.ergonomicsModifier, true, true) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ModStatsComponent.ts" />
<style scoped lang="css" src="./ModStatsComponent.css" />