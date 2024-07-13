<template>
  <div class="price-detail-item">
    <div class="price-detail-item-icon">
      <ItemIcon
        :item="item"
        :quantity="quantity"
      />
    </div>
    <div>
      {{ item.name }}
    </div>
    <div>
      <Price
        :ignore-price-status="ignorePriceStatus"
        :missing="missing"
        :price="price"
      />
      <div
        v-if="quantity > 1"
        class="price-detail-item-price-per-unit"
      >
        <Price
          :ignore-price-status="ignorePriceStatus"
          :missing="missing"
          :price="unitPrice"
          :show-merchant-icon="false"
          :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import ItemIcon from './ItemIconComponent.vue'
import Price from './PriceComponent.vue'

withDefaults(
  defineProps<{
    ignorePriceStatus?: IgnoredUnitPrice
    item: IItem,
    missing?: boolean,
    price: IPrice,
    quantity: number,
    unitPrice: IPrice
  }>(),
  {
    ignorePriceStatus: IgnoredUnitPrice.notIgnored,
    missing: false
  })
</script>










<style scoped>
.price-detail-item {
  align-items: center;
  display: grid;
  gap: 0.25rem;
  grid-template-columns: 4.85rem 1fr 9rem;
}

.price-detail-item-icon {
  display: flex;
  justify-content: center;
}

.price-detail-item-price-per-unit {
  font-size: 0.75rem;
  margin-right: 3rem;
}
</style>