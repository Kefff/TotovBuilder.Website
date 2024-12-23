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
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    canBeLooted?: boolean
    includeModsAndContent?: boolean
    inventoryItem: IInventoryItem,
    inventoryItemInSameSlotInPreset?: IInventoryItem,
    isBaseItem?: boolean,
    showPrice?: boolean,
    showWeight?: boolean
  }>(),
  {
    canBeLooted: true,
    includeModsAndContent: false,
    inventoryItemInSameSlotInPreset: undefined,
    isBaseItem: false,
    showPrice: true,
    showWeight: true
  })

const _globalFilterService = Services.get(GlobalFilterService)
const _inventoryItemService = Services.get(InventoryItemService)

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

const hasMissingPrice = computed(() =>
  selectedItemPrice.value.missingPrice
  && !props.inventoryItem.ignorePrice
  && selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored)
const showSelectedItemMissingPrice = computed(() =>
  hasMissingPrice.value
  && !props.includeModsAndContent
  && selectedItemPrice.value.unitPrice.valueInMainCurrency === 0) // We do not show the missing price icon on items that contain an item with a missing price
const showUnitPrice = computed(() => selectedItemPrice.value.price.valueInMainCurrency !== selectedItemPrice.value.unitPrice.valueInMainCurrency)
const showUnitWeight = computed(() => selectedItemWeight.value.unitWeight !== selectedItemWeight.value.weight)

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  setPriceAsync()
  setWeightAsync()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => [
  props.inventoryItem.ignorePrice,
  props.inventoryItem.itemId,
  props.inventoryItem.quantity,
  props.inventoryItemInSameSlotInPreset?.itemId
], () => {
  setPriceAsync()
})

watch(() => [props.inventoryItem.itemId, props.inventoryItem.quantity], () => {
  setWeightAsync()
})

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the selected item price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  setPriceAsync()
}

/**
 * Sets the price of the inventory item.
 */
async function setPriceAsync(): Promise<void> {
  selectedItemPrice.value = await _inventoryItemService.getPriceAsync(props.inventoryItem, props.inventoryItemInSameSlotInPreset, props.canBeLooted)
}

/**
 * Sets the weight of the inventory items.
 */
async function setWeightAsync(): Promise<void> {
  selectedItemWeight.value = await _inventoryItemService.getWeightAsync(props.inventoryItem)
}
</script>










<template>
  <div class="selected-item-item-card">
    <slot />
    <div class="selected-item-item-card-right">
      <div class="selected-item-item-card-right-base">
        <div class="selected-item-item-card-right-price">
          <div
            v-if="includeModsAndContent"
            class="selected-item-item-card-right-with-mods"
          >
            <InventoryPrice
              :custom-tooltip="$t('caption.price') + $t('caption.withModsAndContent')"
              :inventory-price="selectedItemInventoryPrice"
              :is-build="false"
              :show-empty-missing-price-spot="true"
            />
          </div>
          <div style="height: 2rem;">
            <Price
              v-if="showPrice"
              :ignore-price-status="selectedItemPrice.unitPriceIgnoreStatus"
              :missing="showSelectedItemMissingPrice"
              :price="selectedItemPrice.price"
            />
          </div>
          <div
            v-if="showUnitPrice"
            class="selected-item-item-card-right-per-unit-price selected-item-item-card-right-per-unit"
          >
            <Price
              :ignore-price-status="selectedItemPrice.unitPriceIgnoreStatus"
              :price="selectedItemPrice.unitPrice"
              :show-merchant-icon="false"
              :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            />
          </div>
        </div>
        <div class="selected-item-item-card-right-weight">
          <div
            v-if="includeModsAndContent && selectedItemWeight.weight > 0"
            class="selected-item-item-card-right-with-mods"
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
          <div style="height: 2rem;">
            <div
              v-if="(!includeModsAndContent || showWeight) && selectedItemWeight.weight > 0"
              class="selected-item-item-card-right-weight-base"
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
          <div
            v-if="showUnitWeight"
            class="selected-item-item-card-right-weight selected-item-item-card-right-per-unit"
          >
            <div>
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










<style scoped>
.selected-item-item-card {
  align-items: center;
  display: flex;
  flex-grow: 1;
}

.selected-item-item-card-right {
  align-items: end;
  display: flex;
  flex-direction: column;
  margin-left: auto;
}

.selected-item-item-card-right-base {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.selected-item-item-card-right-per-unit {
  display: flex;
  flex-direction: row;
  font-size: 0.85rem;
  font-style: italic;
  margin-right: 0.15rem;
}

.selected-item-item-card-right-per-unit-price {
  margin-right: 3.15rem;
}

.selected-item-item-card-right-price {
  align-items: end;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: center;
}

.selected-item-item-card-right-weight {
  align-items: end;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  justify-content: center;
  margin-left: 1.7rem;
  width: 7rem;
}

.selected-item-item-card-right-weight-base {
  align-items: center;
  display: flex;
  height: 2rem;
}

.selected-item-item-card-right-with-mods {
  font-style: italic;
  font-weight: bold;
}
</style>