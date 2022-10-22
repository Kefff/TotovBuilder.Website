<template>
  <div
    v-if="inventoryPrice.priceWithContentInMainCurrency.valueInMainCurrency > 0"
    v-tooltip.top="$t('caption.price')"
    :class="'inventory-price' + (canShowDetails ? ' inventory-price-with-details' : '')"
    @click="(e) => togglePriceDetails(e)"
  >
    <div class="inventory-price-value">
      <div class="inventory-price-value-list">
        <div
          v-for="(price, index) of inventoryPrice.pricesWithContent"
          :key="index"
          class="inventory-price-value-list-price"
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
    </div>
    <div
      v-show="showDetails"
      class="inventory-price-details"
    >
      <div>
        <span>{{ $t('caption.equalsTo') }} {{ priceInMainCurrency.toLocaleString() }}</span>
        <font-awesome-icon
          :icon="mainCurrency?.iconName"
          :class="'currency-' + mainCurrency?.name"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./InventoryPriceComponent.ts" />
<style scoped lang="css" src="./InventoryPriceComponent.css" />