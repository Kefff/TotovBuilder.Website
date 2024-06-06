<template>
  <div class="selected-item-summary">
    <div class="option-line">
      <slot />
      <div class="selected-item-summary-right">
        <div class="selected-item-summary-right-price">
          <div
            v-if="hasMissingPrice"
            v-tooltip.top="$t('message.itemWithMissingPrice')"
            class="selected-item-summary-price-missing-price-icon"
          >
            <font-awesome-icon icon="exclamation-triangle" />
          </div>
          <div
            v-if="selectedItemPrice.unitPriceIgnoreStatus === IgnoredUnitPrice.manuallyIgnored"
            v-tooltip.top="$t('caption.ignoredPrice_' + selectedItemPrice.unitPriceIgnoreStatus)"
            class="selected-item-summary-price-ignored-price-icon"
          >
            <font-awesome-icon icon="ban" />
          </div>
          <Price
            v-if="showPrice"
            :price="selectedItemPrice.price"
          />
          <div
            v-tooltip.top="$t('caption.weight')"
            class="selected-item-summary-weight"
          >
            <div v-if="selectedItemWeight.weight > 0">
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.weight) }}</span>
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-after-text"
              />
            </div>
          </div>
        </div>
        <div class="selected-item-summary-right-unit-price">
          <div class="selected-item-summary-price-per-unit">
            <Price
              v-if="showUnitPrice"
              :price="selectedItemPrice.unitPrice"
              :show-merchant-icon="false"
              :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            />
          </div>
          <div
            v-tooltip.top="$t('caption.weight') + ' (' + $t('caption.perUnit') + ')'"
            class="selected-item-summary-weight selected-item-summary-weight-per-unit"
          >
            <div v-if="selectedItemWeight.unitWeight !== selectedItemWeight.weight">
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.unitWeight) }}</span>
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-after-text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryItemPrice } from '../../models/utils/IInventoryItemPrice'
import { IWeight } from '../../models/utils/IWeight'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Price from '../PriceComponent.vue'

const props = withDefaults(
  defineProps<{
    canBeLooted?: boolean
    inventoryItem: IInventoryItem,
    inventoryItemInSameSlotInPreset?: IInventoryItem
  }>(),
  {
    canBeLooted: true,
    inventoryItemInSameSlotInPreset: undefined
  })

const globalFilterService = Services.get(GlobalFilterService)
const inventoryItemService = Services.get(InventoryItemService)

const hasMissingPrice = computed(() => selectedItemPrice.value.missingPrice
  && !props.inventoryItem.ignorePrice
  && selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored
  && selectedItemPrice.value.unitPrice.valueInMainCurrency === 0) // We don't show the missing price icon on items that contain an item with a missing price
const showPrice = computed(() => selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored)
const showUnitPrice = computed(() => showPrice.value && selectedItemPrice.value.price.valueInMainCurrency !== selectedItemPrice.value.unitPrice.valueInMainCurrency)

const selectedItemPrice = ref<IInventoryItemPrice>({
  missingPrice: false,
  price: {
    barterItems: [],
    currencyName: 'RUB',
    itemId: '',
    merchant: '',
    merchantLevel: 0,
    quest: undefined,
    value: 0,
    valueInMainCurrency: 0
  },
  pricesWithContent: [],
  priceWithContentInMainCurrency: 0,
  unitPrice: {
    barterItems: [],
    currencyName: 'RUB',
    itemId: '',
    merchant: '',
    merchantLevel: 0,
    quest: undefined,
    value: 0,
    valueInMainCurrency: 0
  },
  unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
})
const selectedItemWeight = ref<IWeight>({
  weight: 0,
  weightWithContent: 0,
  unitWeight: 0
})

onMounted(() => {
  globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setPrice()
  setWeight()
})

onUnmounted(() => {
  globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => [
  props.inventoryItem.ignorePrice,
  props.inventoryItem.itemId,
  props.inventoryItem.quantity,
  props.inventoryItemInSameSlotInPreset?.itemId
], () => {
  setPrice()
})

watch(() => [props.inventoryItem.itemId, props.inventoryItem.quantity], () => {
  setWeight()
})

/**
 * Updates the selected item price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged() {
  setPrice()
}

/**
 * Sets the price of the inventory item.
 */
async function setPrice() {
  selectedItemPrice.value = await inventoryItemService.getPrice(props.inventoryItem, props.inventoryItemInSameSlotInPreset, props.canBeLooted)
}

/**
 * Sets the weight of the inventory items.
 */
async function setWeight() {
  selectedItemWeight.value = await inventoryItemService.getWeight(props.inventoryItem)
}
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';

.selected-item-summary {
  align-items: center;
  display: flex;
  flex-grow: 1;
}

.selected-item-summary-price-ignored-price-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  justify-content: center;
  width: 2rem;
}

.selected-item-summary-price-missing-price-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  justify-content: center;
  margin-left: 0.5rem;
  margin-right: 0.075rem;
  width: 2rem;
}

.selected-item-summary-price-per-unit {
  font-size: 0.75rem;
  margin-right: 2.5rem;
  /* Alignment with the item total price */
}

.selected-item-summary-right {
  align-items: end;
  display: flex;
  flex-direction: column;
  margin-left: auto;
}

.selected-item-summary-right-price {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 2rem;
}

.selected-item-summary-right-unit-price {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.selected-item-summary-weight {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: end;
  margin-left: 1.5rem;
  /* Alignment with the inventory slot price */
  margin-right: 0.2rem;
  /* Alignment with the inventory slot weight */
  width: 7rem;
}

.selected-item-summary-weight .icon-after-text {
  margin-left: 0.85rem;
  /* Alignment with the inventory slot weight */
}

.selected-item-summary-weight-per-unit {
  font-size: 0.85rem;
  margin-right: 0.3rem;
  /* Alignment with the item total weight */
}

.selected-item-summary-weight-per-unit .icon-after-text {
  margin-left: 1.05rem;
  /* Alignment with the item total weight */
  min-height: auto;
  min-width: auto;
}
</style>