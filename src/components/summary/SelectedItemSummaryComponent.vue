<template>
  <div class="selected-item-summary">
    <div class="option-line">
      <slot />
      <div class="selected-item-summary-right">
        <div class="selected-item-summary-right-base">
          <div>
            <div
              v-if="includeModsAndContent"
              class="selected-item-summary-right-with-mods"
            >
              <InventoryPrice
                :custom-tooltip="$t('caption.price') + $t('caption.withModsAndContent')"
                :inventory-price="selectedItemInventoryPrice"
                :is-build="false"
              />
            </div>
            <Price
              v-if="showPrice"
              :ignore-price-status="selectedItemPrice.unitPriceIgnoreStatus"
              :missing="hasMissingPrice"
              :price="selectedItemPrice.price"
            />
          </div>
          <div class="selected-item-summary-right-weight">
            <div
              v-if="includeModsAndContent && selectedItemWeight.weight > 0"
              class="selected-item-summary-right-with-mods"
            >
              <Tooltip
                :tooltip="$t('caption.weight') + $t('caption.withModsAndContent')"
                position="left"
              >
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-before-text"
                />
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.weightWithContent) }}</span>
              </Tooltip>
            </div>
            <div
              v-if="!includeModsAndContent && selectedItemWeight.weight > 0"
              class="selected-item-summary-right-weight-base"
            >
              <Tooltip :tooltip="$t('caption.weight')">
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-before-text"
                />
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.weight) }}</span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div class="selected-item-summary-right-per-unit">
          <div class="selected-item-summary-right-per-unit-price">
            <Price
              v-if="showUnitPrice"
              :ignore-price-status="selectedItemPrice.unitPriceIgnoreStatus"
              :price="selectedItemPrice.unitPrice"
              :show-merchant-icon="false"
              :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            />
          </div>
          <div class="selected-item-summary-right-weight">
            <div v-if="selectedItemWeight.unitWeight !== selectedItemWeight.weight">
              <Tooltip :tooltip="$t('caption.weight') + ' (' + $t('caption.perUnit') + ')'">
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-before-text"
                />
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.unitWeight) }}</span>
              </Tooltip>
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
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IWeight } from '../../models/utils/IWeight'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import InventoryPrice from '../InventoryPriceComponent.vue'
import Price from '../PriceComponent.vue'

const props = withDefaults(
  defineProps<{
    canBeLooted?: boolean
    includeModsAndContent?: boolean
    inventoryItem: IInventoryItem,
    inventoryItemInSameSlotInPreset?: IInventoryItem,
    isBaseItem?: boolean,
    showPrice?: boolean
  }>(),
  {
    canBeLooted: true,
    includeModsAndContent: false,
    inventoryItemInSameSlotInPreset: undefined,
    isBaseItem: false,
    showPrice: true
  })

const globalFilterService = Services.get(GlobalFilterService)
const inventoryItemService = Services.get(InventoryItemService)

const hasMissingPrice = computed(() => selectedItemPrice.value.missingPrice
  && !props.inventoryItem.ignorePrice
  && selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored
  && selectedItemPrice.value.unitPrice.valueInMainCurrency === 0) // We don't show the missing price icon on items that contain an item with a missing price
const showUnitPrice = computed(() => selectedItemPrice.value.price.valueInMainCurrency !== selectedItemPrice.value.unitPrice.valueInMainCurrency)

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
const selectedItemInventoryPrice = computed<IInventoryPrice>(() => ({
  missingPrice: hasMissingPrice.value,
  priceByCurrency: selectedItemPrice.value.pricesWithContent,
  priceInMainCurrency: selectedItemPrice.value.priceWithContentInMainCurrency
}))

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
 * Reacts to the merchant filter being changed.
 *
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

.selected-item-summary-right {
  align-items: end;
  display: flex;
  flex-direction: column;
  margin-left: auto;
}

.selected-item-summary-right-base {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.selected-item-summary-right-per-unit {
  display: flex;
  flex-direction: row;
  font-style: italic;
  margin-right: 0.15rem;
}

.selected-item-summary-right-per-unit-price {
  margin-right: 3rem;
  /* Alignment with the item total price */
}

.selected-item-summary-right-weight {
  align-items: end;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1.7rem;
  margin-right: 0.6rem;
  /* Alignment with the inventory slot price */
  width: 7rem;
}

.selected-item-summary-right-weight-base {
  align-items: center;
  display: flex;
  height: 2rem;
}

.selected-item-summary-right-with-mods {
  font-weight: bold;
}
</style>