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
        <ShoppingListMerchantsList :shopping-list="parameters" />
      </div>
      <div
        v-for="(shoppingListItem, index) of parameters"
        :key="index"
        class="shopping-list-item"
        :class="shoppingListItem.inventorySlotId != null ? 'shopping-list-item-of-inventory-slot' : ''"
      >
        <PriceDetailItem
          :can-show-item-stats="true"
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
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import PriceDetailItem from '../PriceDetailItemComponent.vue'
import ShoppingListMerchantsList from '../ShoppingListMerchantsListComponent.vue'

defineProps<{ parameters: IShoppingListItem[] }>()
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
  margin-bottom: 1.5rem;
}

.shopping-list-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem 2rem;
}
</style>