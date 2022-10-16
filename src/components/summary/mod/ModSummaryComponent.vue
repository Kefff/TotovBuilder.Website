<template>
  <div
    v-if="hasErgonomicsModifier || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.ergonomics')"
      class="option-value"
    >
      <div v-if="hasErgonomicsModifier">
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

<script lang="ts" src="./ModSummaryComponent.ts" />
<style scoped lang="css" src="./ModSummaryComponent.css" />