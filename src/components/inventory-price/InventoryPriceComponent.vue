<template>
  <div class="inventory-price">
    <div
      v-if="inventoryPrice.missingPrice"
      class="inventory-price-missing-price-icon"
    >
      <Tooltip
        :tooltip="isBuild ? $t('message.buildWithMissingPrice') : $t('message.inventorySlotWithMissingPrice')"
        position="right"
      >
        <font-awesome-icon icon="exclamation-triangle" />
      </Tooltip>
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
        <span>{{ $t('caption.equalsTo') }} {{ StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceInMainCurrency) }}</span>
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