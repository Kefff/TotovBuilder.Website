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
      <font-awesome-icon
        :icon="displayedCurrency.iconName"
        :class="'currency-' + displayedCurrency.name"
      />
      <span>{{ displayedPrice }}</span>
    </div>
    <div
      :class="canShowDetails ? 'price-value-with-details' : ''"
      @click="(e: MouseEvent) => togglePriceDetails(e)"
    >
      <div
        v-if="canShowMerchantIcon"
        class="price-merchant-icon"
      >
        <MerchantIcon
          :is-barter="isBarter"
          :merchant="price.merchant"
          :merchant-level="price.merchantLevel"
          :requires-quest="price.quest != null"
          :show-tooltip="showTooltip"
        />
      </div>
    </div>
  </div>

  <!-- Price details -->
  <OverlayPanel
    ref="priceDetailPanel"
    :dismissable="true"
  >
    <div class="price-details">
      <div
        v-if="showPriceInMainCurrency"
        class="price-details-main-currency"
      >
        <div>{{ $t('caption.equalsTo') }}</div>
        <div class="price-details-main-currency-value">
          <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.price, price.valueInMainCurrency) }}</span>
          <font-awesome-icon
            :icon="mainCurrency.iconName"
            :class="'currency-' + mainCurrency.name"
          />
        </div>
      </div>
      <div
        v-if="price.quest != null"
        class="price-details-quest"
      >
        <font-awesome-icon
          icon="lock"
          class="icon-before-text price-quest-icon"
        />
        <span class="price-details-quest-name">{{ $t('caption.quest') }} : </span>
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
            :icon="currency.iconName"
            class="icon-before-text"
          />
          <span>{{ $t('caption.barter') }}</span>
        </div>
        <div
          v-for="(barterItem, index) of price.barterItems"
          :key="barterItem.itemId"
          class="price-details-barter-item"
        >
          <div class="price-details-barter-item-quantity">
            <span v-if="barterItem.quantity > 1">{{ barterItem.quantity }} x</span>
          </div>
          <div class="price-details-barter-item-icon">
            <div>
              <ItemIcon :item="barterItems[index]" />
            </div>
          </div>
          <div class="price-details-barter-item-name">
            {{ barterItems[index].name }}
          </div>
          <div class="price-details-barter-item-price">
            <div>
              <Price :price="barterItemPrices[index].price" />
              <div>
                <div
                  v-if="barterItem.quantity > 1"
                  class="price-details-barter-item-price-per-unit"
                >
                  <Price
                    :price="barterItemPrices[index].unitPrice"
                    :show-merchant-icon="false"
                    :show-details="false"
                    :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
                  />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>

<script lang="ts" src="./PriceComponent.ts" />
<style scoped lang="css" src="./PriceComponent.css" />