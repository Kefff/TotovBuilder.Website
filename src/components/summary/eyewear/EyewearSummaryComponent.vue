<template>
  <div
    v-if="item.blindnessProtectionPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.blindnessProtection')"
      class="option-value"
    >
      <div v-if="item.blindnessProtectionPercentage !== 0">
        <span :class="StatsUtils.getValueColorClass(item.blindnessProtectionPercentage)">
          {{ StatsUtils.getPercentageDisplayValue(item.blindnessProtectionPercentage, true, 1) }}
        </span>
        <font-awesome-icon
          icon="low-vision"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./EyewearSummaryComponent.ts" />
<style scoped lang="css" src="./EyewearSummaryComponent.css" />