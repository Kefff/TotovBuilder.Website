<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="shopping-cart" />
    </div>
    <span>{{ $t('caption.shoppingList') }}</span>
  </div>
  <span class="shopping-list-sidebar-build-name">{{ parameters.buildName }}</span>
  <div class="sidebar-option">
    <div>
      <div class="shopping-list-sidebar-merchants">
        <ShoppingListMerchantsList :shopping-list="parameters.shoppingList" />
      </div>
      <div
        v-for="(shoppingListItem, index) of parameters.shoppingList"
        :key="index"
        class="shopping-list-sidebar-item"
        :class="shoppingListItem.inventorySlotId != null ? 'shopping-list-sidebar-item-of-inventory-slot' : ''"
      >
        <PriceDetailItem
          :can-show-item-stats="true"
          :ignore-price-status="shoppingListItem.ignorePrice ? IgnoredUnitPrice.manuallyIgnored : IgnoredUnitPrice.notIgnored"
          :item="shoppingListItem.item"
          :missing="shoppingListItem.missingPrice && shoppingListItem.unitPrice.merchant === ''"
          :price="shoppingListItem.price"
          :quantity="shoppingListItem.quantity"
          :unit-price="shoppingListItem.unitPrice"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { ShoppingListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import PriceDetailItem from '../PriceDetailItemComponent.vue'
import ShoppingListMerchantsList from '../ShoppingListMerchantsListComponent.vue'

defineProps<{ parameters: ShoppingListSidebarParameters }>()
</script>










<style scoped>
@import '../../css/sidebar.css';

.shopping-list-sidebar-build-name {
  margin-left: 2.5rem;
}

.shopping-list-sidebar-button {
  align-items: center;
  display: flex;
  justify-content: center;
}

.shopping-list-sidebar-item {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.shopping-list-sidebar-item:last-child {
  margin-bottom: 0;
}

.shopping-list-sidebar-item-of-inventory-slot {
  background-color: var(--primary-color6);
  border-radius: 6px;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
}

.shopping-list-sidebar-merchants {
  margin-bottom: 1rem;
}
</style>