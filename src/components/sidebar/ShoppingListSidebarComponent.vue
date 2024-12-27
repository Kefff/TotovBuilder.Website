<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import StringUtils from '../../utils/StringUtils'
import PriceDetailItem from '../PriceDetailItemComponent.vue'
import ShoppingListMerchantsList from '../ShoppingListMerchantsListComponent.vue'

const props = defineProps<{ parameters: ShoppingListSidebarParameters }>()

const shoppingListItems = computed(() => props.parameters.shoppingList.filter(shl => shl.ignorePrice === IgnoredUnitPrice.notIgnored || shl.ignorePrice === IgnoredUnitPrice.manuallyIgnored))
</script>










<template>
  <div class="shopping-list-sidebar">
    <div class="shopping-list-sidebar-merchants">
      <ShoppingListMerchantsList :shopping-list="shoppingListItems" />
    </div>
    <div
      v-for="(shoppingListItem, index) of shoppingListItems"
      :key="index"
      class="shopping-list-sidebar-item"
      :class="shoppingListItem.inventorySlotId != null ? 'shopping-list-sidebar-item-of-inventory-slot' : ''"
    >
      <div
        v-if="shoppingListItem.inventorySlotId != null"
        class="shopping-list-sidebar-inventory-slot-name"
      >
        {{ $t(`caption.slotType${StringUtils.toUpperFirst(shoppingListItem.inventorySlotId)}`) }}
      </div>
      <PriceDetailItem
        :can-show-item-stats="true"
        :ignore-price-status="shoppingListItem.ignorePrice"
        :item="shoppingListItem.item"
        :missing="shoppingListItem.missingPrice"
        :price="shoppingListItem.price"
        :quantity="shoppingListItem.quantity"
        :unit-price="shoppingListItem.unitPrice"
      />
    </div>
  </div>
</template>










<style scoped>
.shopping-list-sidebar {
  width: 100%;
}

.shopping-list-sidebar-build-name {
  margin-left: 2.5rem;
}

.shopping-list-sidebar-button {
  align-items: center;
  display: flex;
  justify-content: center;
}

.shopping-list-sidebar-inventory-slot-name {
  font-weight: bold;
  margin-bottom: 0.25rem;
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