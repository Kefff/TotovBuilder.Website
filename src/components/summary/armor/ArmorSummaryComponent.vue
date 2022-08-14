<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.armorClass')"
      class="option-value"
    >
      <span>{{ item.armorClass }}</span>
      <font-awesome-icon
        icon="award"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.durability')"
      class="option-value"
    >
      <span>{{ item.durability }}</span>
      <font-awesome-icon
        icon="heart"
        class="icon-after-text durability"
      />
    </div>
  </div>
  <div
    v-if="hasErgonomicsPercentageModifier || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="hasErgonomicsPercentageModifier"
        v-tooltip.top="$t('caption.ergonomics')"
      >
        <span :class="StatsUtils.getValueColorClass(item.ergonomicsPercentageModifier)">
          {{ StatsUtils.getDisplayValue(item.ergonomicsPercentageModifier, true, true) }}
        </span>
        <font-awesome-icon
          icon="hand-paper"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ArmorSummaryComponent.ts" />
<style scoped lang="css" src="./ArmorSummaryComponent.css" />