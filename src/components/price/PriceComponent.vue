<template>
  <div>
    <div
      v-tooltip.top="tooltip"
      class="price"
      @mouseover="togglePriceInMainCurrencyPanel($event)"
      @mouseout="togglePriceInMainCurrencyPanel($event)"
    >
      <span>{{ price.value.toLocaleString() }}</span>
      <font-awesome-icon
        v-if="currency !== undefined"
        :icon="currency?.iconName"
        :class="'currency-' + currency?.name"
      />
      <div
        v-if="showMerchantIcon"
        class="price-merchant-icon"
      >
        <img :src="'/assets/' + price.merchant + '.webp'">
      </div>
    </div>

    <OverlayPanel
      ref="priceInMainCurrencyPanel"
      :dismissable="true"
    >
      <div>
        <div>
          <div v-if="price.merchant != undefined">
            <span class="price-merchant-name">{{ $t('caption.merchant_' + price.merchant) }}</span>
            <span
              v-if="price.merchantLevel != undefined"
              class="price-merchant-level"
            >
              {{ $t('caption.level').toLocaleLowerCase() }} {{ price.merchantLevel }}
            </span>
          </div>
        </div>
        <div v-if="price.questId != undefined">
          <font-awesome-icon
            icon="lock"
            class="icon-before-text price-quest-required"
          />
          <span>{{ $t('caption.questRequired') }}</span>
        </div>
        <div v-if="showPriceInMainCurrency">
          {{ $t('caption.equalsTo') }} {{ price.valueInMainCurrency.toLocaleString() }}
          <font-awesome-icon
            :icon="mainCurrency?.iconName"
            :class="'currency-' + mainCurrency?.name"
          />
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts" src="./PriceComponent.ts" />
<style scoped lang="css" src="./PriceComponent.css" />