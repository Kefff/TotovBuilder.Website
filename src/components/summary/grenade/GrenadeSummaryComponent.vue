<template>
  <div
    v-if="item.fragmentsAmount > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.fragmentsAmount')"
      class="option-value"
    >
      <div v-if="item.fragmentsAmount > 0">
        <span>{{ item.fragmentsAmount }}</span>
        <font-awesome-icon
          icon="viruses"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.maximumExplosionRange > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.explosionRadius')"
      class="option-value"
    >
      <div v-if="item.maximumExplosionRange > 0">
        <span v-if="item.minimumExplosionRange !== item.maximumExplosionRange">{{ $t('caption.explosionRadiusValue', { min: item.minimumExplosionRange, max: item.maximumExplosionRange }) }}</span>
        <span v-else>{{ $t('caption.explosionRadiusSingleValue', { radius: item.maximumExplosionRange }) }}</span>
        <font-awesome-icon
          icon="dot-circle"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.explosionDelay')"
      class="option-value"
    >
      <span>{{ item.explosionDelay }}s</span>
      <font-awesome-icon
        icon="stopwatch"
        class="icon-after-text"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./GrenadeSummaryComponent.ts" />
<style scoped lang="css" src="./GrenadeSummaryComponent.css" />