<template>
  <div
    v-if="item.ergonomicsModifier !== 0 || item.recoilPercentageModifier !== 0 || item.accuracyPercentageModifier !== 0"
    class="stats-line"
  >
    <div
      v-if="item.ergonomicsModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.ergonomicsModifier)">
        {{ StatsUtils.getValueCaption(item.ergonomicsModifier) }}
      </div>
    </div>
    <div
      v-if="item.recoilPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.recoil') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.recoilPercentageModifier, true)">
        {{ StatsUtils.getValueCaption(item.recoilPercentageModifier) }}%
      </div>
    </div>
    <div
      v-if="item.accuracyPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="bullseye"
          class="icon-before-text"
        />
        <span>{{ $t('caption.accuracy') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.accuracyPercentageModifier)">
        {{ StatsUtils.getValueCaption(item.accuracyPercentageModifier) }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./RangedWeaponModStatsComponent.ts" />
<style scoped lang="css" src="./RangedWeaponModStatsComponent.css" />