<script setup lang="ts">
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import ItemIcon from './ItemIconComponent.vue'
import Price from './PriceComponent.vue'

const props = withDefaults(
  defineProps<{
    canShowItemStats?: boolean,
    ignorePriceStatus?: IgnoredUnitPrice
    item: IItem,
    missing?: boolean,
    price?: IPrice,
    quantity: number,
    unitPrice?: IPrice
  }>(),
  {
    canShowItemStats: false,
    ignorePriceStatus: IgnoredUnitPrice.notIgnored,
    missing: false,
    price: undefined,
    unitPrice: undefined
  })

/**
 * Displays the stats of an item.
 * @param item - Item.
 */
function displayItemStats(item: IItem): void {
  if (!props.canShowItemStats) {
    return
  }

  const globalSidebarService = Services.get(GlobalSidebarService)
  globalSidebarService.display({
    displayedComponentType: 'StatsSidebar',
    displayedComponentParameters: item
  })
}
</script>










<template>
  <div class="price-detail-item">
    <div
      class="price-detail-item-icon"
      :class="canShowItemStats ? 'price-detail-item-clickable' : ''"
      @click="displayItemStats(item)"
    >
      <ItemIcon
        :item="item"
        :quantity="quantity"
      />
    </div>
    <div class="price-detail-item-name">
      <span
        :class="canShowItemStats ? 'price-detail-item-clickable' : ''"
        @click="displayItemStats(item)"
      >
        {{ item.name }}
      </span>
    </div>
    <div v-if="price != null && unitPrice != null">
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










<style scoped>
.price-detail-item {
  align-items: center;
  display: grid;
  gap: 0.25rem;
  grid-template-columns: 4.85rem 1fr 9rem;
}

.price-detail-item-clickable {
  cursor: pointer;
}

.price-detail-item-icon {
  display: flex;
  justify-content: center;
}

.price-detail-item-name {
  /* To allow breaking long words, cf https://developer.mozilla.org/fr/docs/Web/CSS/word-break#break-word */
  overflow-wrap: anywhere;
}

.price-detail-item-price-per-unit {
  font-style: italic;
  margin-right: 3rem;
}
</style>