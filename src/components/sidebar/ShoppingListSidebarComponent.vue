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
      <div
        v-for="(shoppingListItem, index) of parameters"
        :key="index"
        class="shopping-list-item"
        :class="shoppingListItem.inventorySlotId != null ? 'shopping-list-item-of-inventory-slot' : ''"
      >
        <PriceDetailItem
          :ignore-price-status="shoppingListItem.ignorePrice ? IgnoredUnitPrice.manuallyIgnored : IgnoredUnitPrice.notIgnored"
          :item="shoppingListItem.item"
          :missing="shoppingListItem.missingPrice"
          :price="shoppingListItem.price"
          :quantity="shoppingListItem.quantity"
          :unit-price="shoppingListItem.unitPrice"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IBuildSummaryShoppingMerchant } from '../../models/utils/IBuildSummaryMerchant'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import StringUtils from '../../utils/StringUtils'
import MerchantIcon from '../MerchantIconComponent.vue'
import PriceDetailItem from '../PriceDetailItemComponent.vue'
import Tooltip from '../TooltipComponent.vue'

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
@import '../../css/sidebar.css';

.shopping-list-button {
  align-items: center;
  display: flex;
  justify-content: center;
}

.shopping-list-item {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
}

.shopping-list-item:last-child {
  margin-bottom: 0;
}

.shopping-list-item-of-inventory-slot {
  background-color: var(--primary-color6);
  border-radius: 6px;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}

.shopping-list-merchants {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: end;
  gap: 1rem;
  margin-bottom: 1rem;
  /* Margin-right needed to avoid having merchant levels trucated */
  margin-right: 0.5rem;
}

.shopping-list-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem 2rem;
}
</style>