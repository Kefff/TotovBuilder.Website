<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryItemPrice } from '../../models/utils/IInventoryItemPrice'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IWeight } from '../../models/utils/IWeight'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import InventoryPrice from '../InventoryPriceComponent.vue'
import Price from '../PriceComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const modelIgnorePrice = defineModel<boolean>('ignorePrice')

const props = defineProps<{
  canBeLooted: boolean
  canIgnorePrice: boolean,
  includeModsAndContent: boolean
  inventoryItem: IInventoryItem,
  inventoryItemInSameSlotInPreset: IInventoryItem | undefined,
  isBaseItem: boolean,
  showPrice: boolean,
  showWeight: boolean
}>()

const _globalFilterService = Services.get(GlobalFilterService)
const _inventoryItemService = Services.get(InventoryItemService)

const hasMissingPrice = computed(() =>
  selectedItemPrice.value.missingPrice
  && !props.inventoryItem.ignorePrice
  && selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored)
const selectedItemInventoryPrice = computed<IInventoryPrice>(() => ({
  missingPrice: hasMissingPrice.value,
  priceByCurrency: selectedItemPrice.value.pricesWithContent,
  priceInMainCurrency: selectedItemPrice.value.priceWithContentInMainCurrency
}))
const showSelectedItemMissingPrice = computed(() =>
  hasMissingPrice.value
  && !props.includeModsAndContent
  && selectedItemPrice.value.unitPrice.valueInMainCurrency === 0) // We do not show the missing price icon on items that contain an item with a missing price
const showUnitPrice = computed(() => selectedItemPrice.value.price.valueInMainCurrency !== selectedItemPrice.value.unitPrice.valueInMainCurrency)
const showUnitWeight = computed(() => selectedItemWeight.value.unitWeight !== selectedItemWeight.value.weight)

const isEditing = inject<Ref<boolean>>('isEditing')
const { isTabletPortraitOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()
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
  <div
    class="card-lines selected-item-item-card"
    :class="{ 'selected-item-item-card-compact': isCompactMode }"
  >
    <!-- Weights and prices -->
    <div class="card-line card-line3 selected-item-item-card-prices-and-weight">
      <!-- Weight -->
      <div
        v-if="(includeModsAndContent && selectedItemWeight.weightWithContent > 0)
          || (showWeight && selectedItemWeight.weight > 0)"
        class="selected-item-item-card-weights"
      >
        <div
          v-if="includeModsAndContent && selectedItemWeight.weightWithContent !== selectedItemWeight.unitWeight"
          class="selected-item-item-card-with-mods"
        >
          <Tooltip
            v-if="selectedItemWeight.weightWithContent > 0"
            :tooltip="$t('caption.weight') + $t('caption.withModsAndContent')"
          >
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.weightWithContent) }}</span>
          </Tooltip>
        </div>
        <div
          v-if="(!includeModsAndContent || showWeight) && selectedItemWeight.weight > 0"
          class="selected-item-item-card-weight"
        >
          <Tooltip :tooltip="$t('caption.weight')">
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.weight) }}</span>
          </Tooltip>
        </div>
        <div
          v-if="showUnitWeight"
          class="selected-item-item-card-per-unit card-line"
        >
          <Tooltip :tooltip="$t('caption.weight') + ' (' + $t('caption.perUnit') + ')'">
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-before-text"
              style="margin-left: 0.1rem"
            />
            <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, selectedItemWeight.unitWeight) }}</span>
          </Tooltip>
        </div>
      </div>
      <!-- Price -->
      <div
        v-if="((includeModsAndContent && selectedItemPrice.priceWithContentInMainCurrency !== selectedItemPrice.unitPrice.valueInMainCurrency))
          || showPrice"
        class="selected-item-item-card-prices"
      >
        <div
          v-if="includeModsAndContent && selectedItemPrice.priceWithContentInMainCurrency !== selectedItemPrice.unitPrice.valueInMainCurrency"
          class="selected-item-item-card-with-mods"
        >
          <InventoryPrice
            :custom-tooltip="$t('caption.price') + $t('caption.withModsAndContent')"
            :inventory-price="selectedItemInventoryPrice"
            :is-build="false"
          />
        </div>
        <div
          v-if="showPrice"
          class="selected-item-item-card-price"
        >
          <Price
            :ignore-price-status="selectedItemPrice.unitPriceIgnoreStatus"
            :missing="showSelectedItemMissingPrice"
            :price="selectedItemPrice.price"
          />
          <Tooltip
            v-if="isEditing && canBeLooted && canIgnorePrice"
            :tooltip="$t(!ignorePrice ? 'caption.ignorePrice' : 'caption.includePrice')"
            :apply-hover-style="false"
          >
            <Button
              class="p-button-sm"
              outlined
              @click="modelIgnorePrice = !modelIgnorePrice"
            >
              <font-awesome-icon :icon="!modelIgnorePrice ? 'ban' : 'ruble-sign'" />
            </Button>
          </Tooltip>
        </div>
        <div
          v-if="inventoryItem.quantity > 1"
          class="selected-item-item-card-per-unit"
        >
          <Price
            v-if="showUnitPrice"
            :ignore-price-status="selectedItemPrice.unitPriceIgnoreStatus"
            :price="selectedItemPrice.unitPrice"
            :show-merchant-icon="false"
            :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
          />
        </div>
      </div>
    </div>
    <!-- Specialized stats -->
    <div>
      <slot />
    </div>
  </div>
</template>










<style scoped>
.selected-item-item-card {
  align-items: center;
  flex-direction: row;
  gap: 1.5rem;
}

.selected-item-item-card > .selected-item-item-card-prices-and-weight {
  height: 100%;
}

.selected-item-item-card-compact {
  align-items: unset;
  flex-direction: column;
  gap: unset;
}

.selected-item-item-card-compact .selected-item-item-card-per-unit {
  align-items: center;
  display: flex;
  flex-direction: row;
}

.selected-item-item-card-per-unit {
  align-items: center;
  display: flex;
  font-size: 0.85rem;
  font-style: italic;
  height: 2rem;
}

.selected-item-item-card-price {
  align-items: center;
  display: flex;
  gap: 0.75rem;
}

.selected-item-item-card-prices {
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  justify-content: center;
}

.selected-item-item-card-weight {
  align-items: center;
  display: flex;
  height: 2rem;
  text-wrap: nowrap;
}

.selected-item-item-card-weights {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
}

.selected-item-item-card-weights span {
  align-items: center;
  display: flex;
  white-space: nowrap;
}

.selected-item-item-card-with-mods {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  font-style: italic;
  font-weight: bolder;
  height: 2rem;
}
</style>










<style>
.selected-item-item-card .card-line {
  gap: 1.5rem;
  height: 2rem;
}

.selected-item-item-card.selected-item-item-card-compact .card-line {
  height: 1.5rem;
}

.selected-item-item-card.selected-item-item-card-compact .card-line.selected-item-item-card-prices-and-weight {
  height: unset;
}



.selected-item-item-card-compact .selected-item-item-card-prices > .selected-item-item-card-with-mods,
.selected-item-item-card-compact .selected-item-item-card-prices > .selected-item-item-card-price {
  justify-content: unset;
}
</style>