<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.chopDamage')"
      class="option-value custom-icon-after-text"
    >
      <span>{{ item.chopDamage }}</span>
      <img :src="Images.chop">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.stabDamage')"
      class="option-value custom-icon-after-text"
    >
      <span>{{ item.stabDamage }}</span>
      <img :src="Images.stab">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.hitRadius')"
      class="option-value"
    >
      <span>{{ item.hitRadius }}m</span>
      <font-awesome-icon
        icon="dot-circle"
        class="icon-after-text"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./MeleeWeaponSummaryComponent.ts" />
<style scoped lang="css" src="./MeleeWeaponSummaryComponent.css" />