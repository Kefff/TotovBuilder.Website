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
          <Tooltip :tooltip="$t('caption.merchant_' + merchant.name) + (merchant.level !== 0 ? ` ${$t('caption.level').toLowerCase()} ${merchant.level}` : '')">
            <MerchantIcon
              :merchant="merchant.name"
              :merchant-level="merchant.level"
              :show-tooltip="true"
            />
          </Tooltip>
        </div>
      </div>
      <PriceDetailItem
        v-for="(shoppingListItem, index) of parameters"
        :key="index"
        :item="shoppingListItem.item"
        :price="shoppingListItem.price"
        :quantity="shoppingListItem.quantity"
        :unit-price="shoppingListItem.unitPrice"
        class="shopping-list-item"
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IShoppingListItem } from '../models/build/IShoppingListItem'
import { IBuildSummaryShoppingMerchant } from '../models/utils/IBuildSummaryMerchant'
import StringUtils from '../utils/StringUtils'
import MerchantIcon from './MerchantIconComponent.vue'
import PriceDetailItem from './PriceDetailItemComponent.vue'
import Tooltip from './TooltipComponent.vue'

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
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  /* For the merchant level to be fully displayed */
}

.shopping-list-item:last-child {
  margin-bottom: 0;
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