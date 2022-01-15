<template>
  <div class="inventory-price">
    <div
      v-if="inventoryPrice.priceWithContentInMainCurrency.valueInMainCurrency > 0"
      v-tooltip.top="$t('caption.price')"
      class="inventory-price-list"
      @mouseover="togglePriceInMainCurrencyPanel($event)"
      @mouseout="togglePriceInMainCurrencyPanel($event)"
    >
      <div
        v-for="(price, index) of inventoryPrice.pricesWithContent"
        :key="index"
        class="inventory-price-list-price"
      >
        <Price
          :price="price"
          :show-merchant-icon="false"
          :show-tooltip="false"
        />
      </div>
    </div>
    <div
      v-tooltip.top="$t('message.missingPrice')"
      :class="missingPriceIconClass"
    >
      <font-awesome-icon
        v-if="inventoryPrice.missingPrice"
        icon="exclamation-triangle"
      />
    </div>

    <OverlayPanel
      ref="priceInMainCurrencyPanel"
      :dismissable="true"
    >
      <div>
        {{ $t('caption.equalsTo') }} {{ priceInMainCurrency.toLocaleString() }}
        <font-awesome-icon
          :icon="mainCurrency?.iconName"
          :class="'currency-' + mainCurrency?.name"
        />
      </div>
    </OverlayPanel>
  </div>
</template>

<script lang="ts" src="./InventoryPriceComponent.ts" />
<style scoped lang="css" src="./InventoryPriceComponent.css" />