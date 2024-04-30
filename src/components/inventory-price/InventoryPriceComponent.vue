<template>
  <div class="inventory-price">
    <div
      v-if="inventoryPrice.missingPrice"
      v-tooltip.top="isBuild ? $t('message.buildWithMissingPrice') : $t('message.inventorySlotWithMissingPrice')"
      class="inventory-price-missing-price-icon"
    >
      <font-awesome-icon icon="exclamation-triangle" />
    </div>
    <div
      v-tooltip.top="$t('caption.price')"
      :class="'inventory-price-list' + (canShowDetails ? ' inventory-price-with-details' : '')"
      @click="(e) => togglePriceDetails(e)"
    >
      <div
        v-for="(price, index) of inventoryPrice.priceByCurrency"
        :key="index"
        class="inventory-price-list-price"
      >
        <Price
          :price="price"
          :show-details="false"
          :show-merchant-icon="false"
          :show-tooltip="false"
        />
      </div>
    </div>
  </div>

  <!-- Price details -->
  <OverlayPanel
    ref="priceDetailPanel"
    :dismissable="true"
    :style="'max-width: 16rem'"
  >
    <div class="inventory-price-details">
      <div>
        <span>{{ $t('caption.equalsTo') }} {{ StatsUtils.getDisplayValue(priceInMainCurrency) }}</span>
        <font-awesome-icon
          :icon="mainCurrency?.iconName"
          :class="'currency-' + mainCurrency?.name"
        />
      </div>
    </div>
  </OverlayPanel>
</template>

<script lang="ts" src="./InventoryPriceComponent.ts" />
<style scoped lang="css" src="./InventoryPriceComponent.css" />