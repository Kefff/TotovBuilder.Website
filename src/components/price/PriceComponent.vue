<template>
  <div
    v-tooltip.top="tooltip"
    :class="'price' + (canShowDetails ? ' price-with-details' : '')"
    @click="(e) => togglePriceDetails(e)"
  >
    <div class="price-value">
      <span>{{ displayedPrice }}</span>
      <font-awesome-icon
        v-if="currency != null"
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
    <div
      v-show="showDetails"
      class="price-details"
    >
      <div
        v-if="showPriceInMainCurrency"
        class="price-details-main-currency"
      >
        <div>{{ $t('caption.equalsTo') }}</div>
        <div class="price-details-main-currency-value">
          <span>{{ price.valueInMainCurrency.toLocaleString() }}</span>
          <font-awesome-icon
            :icon="mainCurrency?.iconName"
            :class="'currency-' + mainCurrency?.name"
          />
        </div>
      </div>
      <div v-if="price.merchant !== ''">
        <div>
          {{ $t('caption.merchant_' + price.merchant) }}
        </div>
        <div
          v-if="price.merchantLevel !== 0"
          class="price-details-merchant-level"
        >
          {{ $t('caption.level').toLocaleLowerCase() }} {{ price.merchantLevel }}
        </div>
      </div>
      <div v-if="price.quest != null">
        <font-awesome-icon
          icon="lock"
          class="icon-before-text price-details-quest-icon"
        />
        <span>{{ $t('caption.quest') }} : </span>
        <a
          :href="price.quest.wikiLink"
          target="_blank"
          class="link price-details-quest-link"
          @click="(e) => e.stopPropagation()"
        >
          {{ price.quest.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./PriceComponent.ts" />
<style scoped lang="css" src="./PriceComponent.css" />