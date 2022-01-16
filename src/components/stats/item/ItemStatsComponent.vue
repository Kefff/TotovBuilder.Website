<template>
  <slot />
  <div
    v-if="prices.length > 1"
    class="stats-line"
  >
    <div
      v-for="(price, index) of prices"
      :key="index"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="ruble-sign"
          class="icon-before-text"
        />
        <span>{{ $t('caption.merchant_' + price.merchant) + (price.merchantLevel ?? 0 > 0 ? ' ' + $t('caption.level').toLocaleLowerCase() + ' ' + price.merchantLevel : '') }} :</span>
      </div>
      <div class="stats-value">
        <Price
          :price="price"
          :show-tooltip="true"
        />
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div
      v-if="prices.length === 1"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="ruble-sign"
          class="icon-before-text"
        />
        <span>{{ $t('caption.price') }} :</span>
      </div>
      <div class="stats-value">
        <Price
          :price="prices[0]"
          :show-tooltip="true"
        />
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="weight-hanging"
          class="icon-before-text"
        />
        <span>{{ $t('caption.weight') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.weight }}kg
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span
          class="link"
          @click="openMarket()"
        >
          Tarkov Tools
        </span>
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span
          class="link"
          @click="openWiki()"
        >
          Wiki
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ItemStatsComponent.ts" />
<style scoped lang="css" src="./ItemStatsComponent.css" />