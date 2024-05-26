<template>
  <div class="shopping-list-title">
    <div class="sidebar-title">
      <div class="sidebar-title-icon">
        <font-awesome-icon icon="shopping-cart" />
      </div>
      <span>{{ $t('caption.shoppingList') }}</span>
    </div>
  </div>
  <div class="sidebar-option">
    <div>
      <div class="shopping-list-merchants">
        <div
          v-for="merchant of requiredMerchants"
          :key="merchant.name"
        >
          <MerchantIcon
            :merchant="merchant.name"
            :merchant-level="merchant.level"
            :show-tooltip="true"
          />
        </div>
      </div>
      <div
        v-for="(shoppingListItem, index) of parameters"
        :key="index"
        class="shopping-list-item"
      >
        <div class="shopping-list-item-icon">
          <ItemIcon
            :item="shoppingListItem.item"
            :quantity="shoppingListItem.quantity"
          />
        </div>
        <div>
          {{ shoppingListItem.item.name }}
        </div>
        <div class="shopping-list-item-price">
          <Price :price="shoppingListItem.price" />
          <div
            v-if="shoppingListItem.quantity > 1"
            class="shopping-list-item-price-per-unit"
          >
            <Price
              :price="shoppingListItem.unitPrice"
              :show-merchant-icon="false"
              :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            />
          </div>
        </div>
      </div>
      <div />
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IBuildSummaryShoppingMerchant } from '../models/utils/IBuildSummaryMerchant'
import StringUtils from '../utils/StringUtils'
import ItemIcon from './ItemIconComponent.vue'
import MerchantIcon from './MerchantIconComponent.vue'
import Price from './PriceComponent.vue'

const props = defineProps<{ parameters: IShoppingListItem[] }>()

const requiredMerchants = computed(() => getRequiredMerchants())

/**
 * Gets the required merchants.
 */
function getRequiredMerchants(): IBuildSummaryShoppingMerchant[] {
  const merchants: IBuildSummaryShoppingMerchant[] = []

  for (const item of props.parameters) {
    if (item.price.merchant === '') {
      // When no merchant is found, a price without merchant and a 0 value is returned
      continue
    }

    const merchant = merchants.find(m => m.name === item.price.merchant)

    if (merchant == null) {
      merchants.push({
        name: item.price.merchant,
        level: item.price.merchantLevel
      })
    } else {
      if (merchant.level < item.price.merchantLevel) {
        merchant.level = item.price.merchantLevel
      }
    }
  }

  merchants.sort((m1, m2) => StringUtils.compare(m1.name, m2.name))

  return merchants
}
</script>










<style scoped>
@import '../css/sidebar.css';

.shopping-list-button {
  align-items: center;
  display: flex;
  justify-content: center;
}

.shopping-list-item {
  align-items: center;
  display: grid;
  gap: 0.25rem;
  grid-template-columns: 4.5rem 1fr 10rem;
  margin-bottom: 0.5rem;
}

.shopping-list-item:last-child {
  margin-bottom: 0;
}

.shopping-list-item-icon {
  display: flex;
  justify-content: center;
}

.shopping-list-item-price {
  margin-right: 0.5rem;
  /* For the merchant level to be fully displayed */
}

.shopping-list-item-price-per-unit {
  font-size: 0.75rem;
  margin-right: 2.35rem;
}

.shopping-list-merchants {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1rem;
}

.shopping-list-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem 2rem;
}
</style>