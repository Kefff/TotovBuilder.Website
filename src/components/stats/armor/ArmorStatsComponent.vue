<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ $t('caption.armorClass') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.armorClass }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="heart"
          class="icon-before-text durability"
        />
        <span>{{ $t('caption.durability') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.durability }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.material') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.material' + item.material) }}
      </div>
    </div>
    <div
      v-if="hasRicochetChance"
      class="stats-entry"
    >
      <div class="stats-caption custom-icon-before-text">
        <img src="/assets/ricochet.webp">
        <span>{{ $t('caption.ricochetChance') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.ricochetChance' + item.ricochetChance) }}
      </div>
    </div>
  </div>
  <div
    v-if="ergonomicsPercentageModifier !== 0 || item.movementSpeedPercentageModifier !== 0 || item.turningSpeedPercentageModifier !== 0"
    class="stats-line"
  >
    <div
      v-if="ergonomicsPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsPercentageModifier)">
        {{ StatsUtils.getDisplayValue(ergonomicsPercentageModifier, true, true) }}
      </div>
    </div>
    <div
      v-if="item.movementSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.movementSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.movementSpeedPercentageModifier)">
        {{ StatsUtils.getDisplayValue(item.movementSpeedPercentageModifier, true, true) }}
      </div>
    </div>
    <div
      v-if="item.turningSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.turningSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.turningSpeedPercentageModifier)">
        {{ StatsUtils.getDisplayValue(item.turningSpeedPercentageModifier, true, true) }}
      </div>
    </div>
  </div>
  <div>
    <div stats-entry>
      <div class="stats-caption">
        <font-awesome-icon
          icon="shield-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.protects') }} :</span>
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div
      v-for="armoredArea of item.armoredAreas"
      :key="armoredArea"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.armoredArea' + armoredArea) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ArmorStatsComponent.ts" />
<style scoped lang="css" src="./ArmorStatsComponent.css" />