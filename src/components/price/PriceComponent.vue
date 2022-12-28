<template>
  <div
    v-if="initialized"
    class="price"
  >
    <div
      v-if="price.valueInMainCurrency > 0"
      v-tooltip.top="priceValueTooltip"
      :class="'price-value' + (canShowDetails ? ' price-value-with-details' : '')"
      @click="(e) => togglePriceDetails(e)"
    >
      <span>{{ displayedPrice }}</span>
      <font-awesome-icon
        v-if="displayedCurrency != null"
        :icon="displayedCurrency.iconName"
        :class="'currency-' + displayedCurrency.name"
      />
    </div>
    <div
      v-if="canShowMerchantIcon"
      v-tooltip.top="merchantTooltip"
      :class="'price-merchant-icon' + (canShowDetails ? ' price-value-with-details' : '')"
      @click="(e) => togglePriceDetails(e)"
    >
      <img :src="'/assets/' + price.merchant + '.webp'">
      <div
        v-if="price.merchantLevel !== 0"
        class="price-merchant-level"
      >
        <div>
          {{ price.merchantLevel }}
        </div>
      </div>
      <div
        v-if="isBarter"
        class="price-merchant-barter-icon"
      >
        <div>
          <font-awesome-icon :icon="currency?.iconName" />
        </div>
      </div>
    </div>
  </div>

  <!-- Price details -->
  <OverlayPanel
    ref="priceDetailPanel"
    :dismissable="true"
    :style="'max-width: ' + priceDetailPanelWidth + 'rem'"
  >
    <div class="price-details">
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
      <div
        v-if="price.quest != null"
        class="price-details-quest"
      >
        <font-awesome-icon
          icon="lock"
          class="icon-before-text price-details-quest-icon"
        />
        <span class="price-details-quest">{{ $t('caption.quest') }} : </span>
        <a
          :href="price.quest.wikiLink"
          target="_blank"
          class="link"
          @click="(e) => e.stopPropagation()"
        >
          {{ price.quest.name }}
        </a>
      </div>
      <div
        v-if="isBarter"
        class="price-details-barter"
      >
        <div class="price-details-barter-title">
          <font-awesome-icon
            :icon="currency?.iconName"
            class="icon-before-text"
          />
          <span>{{ $t('caption.barter') }} :</span>
        </div>
        <div
          v-for="(barterItem, index) of price.barterItems"
          :key="barterItem.itemId"
          class="price-details-barter-item"
        >
          <ItemIcon :item="barterItems[index]" />
          <div class="price-details-barter-item-caption">
            x {{ barterItem.quantity }} {{ barterItems[index].name }}
          </div>
          <Price :price="barterItemPrices[index].price" />
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>

<script lang="ts" src="./PriceComponent.ts" />
<style scoped lang="css" src="./PriceComponent.css" />