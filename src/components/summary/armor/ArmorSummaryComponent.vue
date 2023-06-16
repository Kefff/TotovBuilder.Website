<template>
  <div
    v-if="item.armorClass > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.armorClass > 0"
        v-tooltip.top="$t('caption.armorClass')"
      >
        <span>{{ item.armorClass }}</span>
        <font-awesome-icon
          icon="award"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.durability > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.durability > 0"
        v-tooltip.top="$t('caption.durability')"
      >
        <span>{{ item.durability }}</span>
        <font-awesome-icon
          icon="heart"
          class="icon-after-text durability"
        />
      </div>
    </div>
  </div>
  <div
    v-if="ergonomicsPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ergonomicsPercentageModifier !== 0"
        v-tooltip.top="$t('caption.ergonomics')"
      >
        <span :class="StatsUtils.getValueColorClass(ergonomicsPercentageModifier)">
          {{ StatsUtils.getDisplayValue(ergonomicsPercentageModifier, true, true) }}
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