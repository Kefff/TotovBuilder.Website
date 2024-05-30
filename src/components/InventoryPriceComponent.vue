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
    <Tooltip :tooltip="tooltip">
      <div
        class="inventory-price-list"
        :class="canShowDetails ? ' inventory-price-with-details' : ''"
        @click="(e) => togglePriceDetails(e)"
      >
        <div
          v-for="(price, index) of inventoryPrice.priceByCurrency"
          :key="index"
          class="inventory-price-list-price"
        >
          <Price
            :apply-hover-style="false"
            :price="price"
            :show-details="false"
            :show-merchant-icon="false"
            :show-tooltip="false"
          />
        </div>
      </div>
    </Tooltip>
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










<script setup lang="ts">
import { computed, ref } from 'vue'
import { ICurrency } from '../models/configuration/ICurrency'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import vueI18n from '../plugins/vueI18n'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import Price from './PriceComponent.vue'
import Tooltip from './TooltipComponent.vue'

const props = defineProps<{
  inventoryPrice: IInventoryPrice,
  isBuild: boolean
}>()

let _mainCurrency: ICurrency | undefined

const priceDetailPanel = ref()

const canShowDetails = computed(() => props.inventoryPrice.priceByCurrency.some(ip => ip.currencyName !== mainCurrency.value?.name))
const mainCurrency = computed(() => {
  if (_mainCurrency == null) {
    _mainCurrency = Services.get(ItemService).getMainCurrency()
  }

  return _mainCurrency
})
const priceInMainCurrency = computed(() => props.inventoryPrice.priceByCurrency.reduce((total, priceInCurrency) => total + priceInCurrency.valueInMainCurrency, 0))
const tooltip = computed(() => {
  let value = vueI18n.t('caption.price')

  if (canShowDetails.value) {
    value += ` ${vueI18n.t('caption.priceDetails')}`
  }

  return value
})

/**
 * Toggles the details of the price.
 */
function togglePriceDetails(event: Event) {
  if (!canShowDetails.value) {
    return
  }

  priceDetailPanel.value.toggle(event)
  event.stopPropagation()
}
</script>










<style scoped>
@import '../css/currency.css';

.inventory-price {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.inventory-price-with-details {
  cursor: pointer;
}

.inventory-price-details {
  font-size: 0.85rem;
  padding-right: 0.25rem;
}

.inventory-price-list {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: end;
}

.inventory-price-list-price {
  margin-right: 0.5rem;
}

.inventory-price-list-price:last-child {
  margin-right: 0;
}

.inventory-price-missing-price-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
</style>