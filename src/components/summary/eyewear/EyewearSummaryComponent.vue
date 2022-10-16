<template>
  <div
    v-if="hasBlindnessProtectionPercentage || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.blindnessProtection')"
      class="option-value"
    >
      <div v-if="hasBlindnessProtectionPercentage">
        <span :class="StatsUtils.getValueColorClass(item.blindnessProtectionPercentage)">
          {{ StatsUtils.getDisplayValue(item.blindnessProtectionPercentage, true, true) }}
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