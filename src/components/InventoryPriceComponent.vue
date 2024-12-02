<script setup lang="ts">
import { computed, inject, Ref, useTemplateRef } from 'vue'
import { ICurrency } from '../models/configuration/ICurrency'
import { IInventoryPrice } from '../models/utils/IInventoryPrice'
import vueI18n from '../plugins/vueI18n'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import Price from './PriceComponent.vue'
import Tooltip from './TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    customTooltip?: string,
    inventoryPrice: IInventoryPrice,
    isBuild: boolean,
    showEmptyMissingPriceSpot?: boolean
  }>(),
  {
    customTooltip: undefined,
    showMissingPriceSpot: false
  })

let _mainCurrency: ICurrency | undefined

const inventoryPriceDetailPanel = useTemplateRef('inventoryPriceDetailPanel')
const isTouchScreen = inject<Ref<boolean>>('isTouchScreen')

const canShowDetails = computed(() => props.inventoryPrice.priceByCurrency.some(ip => ip.currencyName !== mainCurrency.value?.name))
const mainCurrency = computed(() => {
  if (_mainCurrency == null) {
    _mainCurrency = Services.get(ItemService).getMainCurrency()
  }

  return _mainCurrency
})
const priceInMainCurrency = computed(() => props.inventoryPrice.priceByCurrency.reduce((total, priceInCurrency) => total + priceInCurrency.valueInMainCurrency, 0))
const tooltip = computed(() => {
  let value: string = props.customTooltip ?? vueI18n.t('caption.price')

  if (canShowDetails.value && !isTouchScreen?.value) {
    value += ` ${vueI18n.t('caption.clickForDetails')}`
  }

  return value
})

/**
 * Toggles the details of the inventory price.
 */
function toggleInventoryPriceDetails(event: Event): void {
  if (!canShowDetails.value) {
    return
  }

  inventoryPriceDetailPanel.value?.toggle(event)
  event.stopPropagation()
}
</script>










<template>
  <div class="inventory-price">
    <Tooltip :tooltip="tooltip">
      <div
        class="inventory-price-list"
        :class="canShowDetails ? ' inventory-price-with-details' : ''"
        @click="(e) => toggleInventoryPriceDetails(e)"
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
    <div
      v-if="inventoryPrice.missingPrice || showEmptyMissingPriceSpot"
      class="inventory-price-icon"
    >
      <div
        v-if="inventoryPrice.missingPrice"
        class="inventory-price-missing-price-icon"
      >
        <Tooltip
          :tooltip="isBuild ? $t('message.buildWithMissingPrice') : $t('message.itemWithModsAndContentAndMissingPrice')"
          position="right"
        >
          <font-awesome-icon icon="exclamation-triangle" />
        </Tooltip>
      </div>
    </div>
  </div>

  <!-- Price details -->
  <OverlayPanel
    ref="inventoryPriceDetailPanel"
    :dismissable="true"
  >
    <div class="inventory-price-details-header">
      <Button
        class="inventory-price-details-header-close-button p-button-text p-button-sm button-discreet"
        @click="toggleInventoryPriceDetails($event)"
      >
        <font-awesome-icon icon="times" />
      </Button>
    </div>
    <div class="inventory-price-details">
      <font-awesome-icon
        icon="coins"
        class="icon-before-text"
      />
      <div>{{ $t('caption.priceEqualsTo') }}</div>
      <div class="inventory-price-details-main-currency-value">
        <font-awesome-icon
          :icon="mainCurrency?.iconName"
          :class="'currency-' + mainCurrency?.name"
        />
      </div>
      <div>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.price, priceInMainCurrency) }}</div>
    </div>
  </OverlayPanel>
</template>










<style scoped>
.inventory-price {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: end;
}

.inventory-price-details {
  display: flex;
  font-size: 0.85rem;
}

.inventory-price-details-header {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  height: 1rem;
  margin-bottom: 0.5rem;
}

.inventory-price-details-header-close-button {
  font-size: 1rem !important;
  padding: 0 !important;
}

.inventory-price-details-main-currency-value {
  margin-left: 0.25rem;
}

.inventory-price-icon {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  width: 2rem;
}

.inventory-price-list {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.inventory-price-list-price {
  margin-left: 0.5rem;
}

.inventory-price-list-price:first-child {
  margin-left: 0;
}

.inventory-price-missing-price-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
}

.inventory-price-with-details {
  cursor: pointer;
}
</style>