<template>
  <div
    v-if="hasFragmentsAmount || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <span
        v-if="hasFragmentsAmount"
        v-tooltip.top="$t('caption.fleshDamage')"
      >{{ fragmentAmmunition?.fleshDamage }}</span>
      <div
        v-if="hasFragmentsAmount"
        class="flesh-damage"
      >
        <div v-tooltip.top="$t('caption.fleshDamage')">
          <font-awesome-icon
            icon="heart-broken"
            class="icon-after-text flesh-damage-color"
          />
        </div>
        <div
          v-if="canOneshot"
          v-tooltip.top="$t('caption.canOneshot')"
          class="flesh-damage-oneshot"
        >
          <font-awesome-icon
            icon="skull"
            class="flesh-damage-oneshot-icon"
          />
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="hasFragmentsAmount || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.fragmentsAmount')"
      class="option-value"
    >
      <div v-if="hasFragmentsAmount">
        <span>{{ item.fragmentsAmount }}</span>
        <font-awesome-icon
          icon="viruses"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="hasMaximumExplosionRange || showEmptyEntries"
    class="option-entry"
  >
    <div
      v-tooltip.top="$t('caption.explosionRadius')"
      class="option-value"
    >
      <div v-if="hasMaximumExplosionRange">
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