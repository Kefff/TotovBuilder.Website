<template>
  <div
    v-if="item.accuracyModifierPercentage !== 0 || ergonomicsModifier !== 0 || item.recoilModifierPercentage !== 0"
    class="stats-line"
  >
    <div
      v-if="ergonomicsModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
      </div>
    </div>
    <div
      v-if="item.recoilModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.recoil') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.recoilModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, item.recoilModifierPercentage) }}
      </div>
    </div>
    <div
      v-if="item.accuracyModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="bullseye"
          class="icon-before-text"
        />
        <span>{{ $t('caption.accuracy') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.accuracyModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, item.accuracyModifierPercentage) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponModStatsComponent.ts" />
<style scoped lang="css" src="./RangedWeaponModStatsComponent.css" />