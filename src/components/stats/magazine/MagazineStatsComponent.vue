<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="box-open"
          class="icon-before-text"
        />
        <span>{{ $t('caption.capacity') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.capacity }}
      </div>
    </div>
    <div
      v-if="item.loadSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="sync-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.loadSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.loadSpeedPercentageModifier, true)">
        {{ StatsUtils.getValueCaption(item.loadSpeedPercentageModifier) }}%
      </div>
    </div>
    <div
      v-if="item.checkSpeedPercentageModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="eye"
          class="icon-before-text"
        />
        <span>{{ $t('caption.checkSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.checkSpeedPercentageModifier, true)">
        {{ StatsUtils.getValueCaption(item.checkSpeedPercentageModifier) }}%
      </div>
    </div>
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
  </div>
  <div v-if="acceptedCartridgesCaptions.length > 0">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img src="/assets/caliber.webp">
        <span>{{ $t('caption.acceptedCartridges') }} :</span>
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div
      v-for="(acceptedCartridgesCaption, index) of acceptedCartridgesCaptions"
      :key="index"
      class="stats-entry"
    >
      <div class="stats-caption">
        <span>{{ acceptedCartridgesCaption }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./MagazineStatsComponent.ts" />
<style scoped lang="css" src="./MagazineStatsComponent.css" />