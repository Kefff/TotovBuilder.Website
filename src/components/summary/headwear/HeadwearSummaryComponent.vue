<template>
  <ArmorSummary
    :item="item"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="item.presetWearableModifiers"
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
        <img :src="Images.ricochet">
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./HeadwearSummaryComponent.ts" />
<style scoped lang="css" src="./HeadwearSummaryComponent.css" />