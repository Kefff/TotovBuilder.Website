<template>
  <ArmorSummary
    v-if="hasArmor"
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
  <div
    v-else
    class="armor-placeholder"
  />
  <div
    v-if="hasRicochetChance || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="hasRicochetChance"
        v-tooltip.top="$t('caption.ricochetChance')"
        class="custom-icon-after-text"
      >
        <span>{{ $t('caption.ricochetChance' + item.ricochetChance) }}</span>
        <img src="/assets/ricochet.webp">
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./HeadwearSummaryComponent.ts" />
<style scoped lang="css" src="./HeadwearSummaryComponent.css" />