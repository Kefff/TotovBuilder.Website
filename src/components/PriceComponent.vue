<template>
  <div
    v-if="initialized"
    class="price"
  >
    <Tooltip
      :apply-hover-style="applyHoverStyle"
      :tooltip="priceTooltip"
      @click="(e: MouseEvent) => togglePriceDetails(e)"
    >
      <div class="price-value-and-icon">
        <div
          v-if="price.valueInMainCurrency > 0"
          :class="canShowDetails ? ' price-value-with-details' : ''"
          class="price-value"
        >
          <font-awesome-icon
            :icon="displayedCurrency.iconName"
            :class="'currency-' + displayedCurrency.name"
          />
          <span>{{ displayedPrice }}</span>
        </div>
        <div>
          <div
            v-if="canShowMerchantIcon"
            class="price-merchant-icon"
          >
            <MerchantIcon
              :is-barter="isBarter"
              :merchant="price.merchant"
              :merchant-level="price.merchantLevel"
              :requires-quest="price.quest != null"
              :show-tooltip="showTooltip"
            />
          </div>
        </div>
      </div>
    </Tooltip>
  </div>

  <!-- Price details -->
  <OverlayPanel
    ref="priceDetailPanel"
    :dismissable="true"
  >
    <div class="price-details">
      <div
        v-if="showPriceInMainCurrency"
        class="price-details-main-currency"
      >
        <div>{{ $t('caption.equalsTo') }}</div>
        <div class="price-details-main-currency-value">
          <font-awesome-icon
            :icon="mainCurrency.iconName"
            :class="'currency-' + mainCurrency.name"
          />
          <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.price, price.valueInMainCurrency) }}</span>
        </div>
      </div>
      <div v-if="price.merchant !== ''">
        {{ $t('caption.merchant_' + price.merchant) + (price.merchantLevel !== 0 ? ` ${$t('caption.level').toLowerCase()} ${price.merchantLevel}` : '') }}
      </div>
      <div
        v-if="price.quest != null"
        class="price-details-quest"
      >
        <font-awesome-icon
          icon="lock"
          class="icon-before-text price-quest-icon"
        />
        <span class="price-details-quest-name">{{ $t('caption.quest') }} : </span>
        <a
          :href="price.quest.wikiLink"
          target="_blank"
          class="link"
          @click="(e) => e.stopPropagation()"
        >
          {{ price.quest.name }}
        </a>
      </div>
      <div
        v-if="isBarter"
        class="price-details-barter"
      >
        <div class="price-details-barter-title">
          <font-awesome-icon
            :icon="currency.iconName"
            class="icon-before-text"
          />
          <span>{{ $t('caption.barter') }}</span>
        </div>
        <div
          v-for="(barterItem, index) of price.barterItems"
          :key="barterItem.itemId"
          class="price-details-barter-item"
        >
          <div class="price-details-barter-item-quantity">
            <span v-if="barterItem.quantity > 1">{{ barterItem.quantity }} x</span>
          </div>
          <div class="price-details-barter-item-icon">
            <div>
              <ItemIcon :item="barterItems[index]" />
            </div>
          </div>
          <div class="price-details-barter-item-name">
            {{ barterItems[index].name }}
          </div>
          <div class="price-details-barter-item-price">
            <div>
              <Price :price="barterItemPrices[index].price" />
              <div>
                <div
                  v-if="barterItem.quantity > 1"
                  class="price-details-barter-item-price-per-unit"
                >
                  <Price
                    :price="barterItemPrices[index].unitPrice"
                    :show-merchant-icon="false"
                    :show-details="false"
                    :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
                  />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { IInventoryItemPrice } from '../models/utils/IInventoryItemPrice'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventoryItemService } from '../services/InventoryItemService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import ItemIcon from './ItemIconComponent.vue'
import MerchantIcon from './MerchantIconComponent.vue'
import Price from './PriceComponent.vue'
import Tooltip from './tooltip/TooltipComponent.vue'

const itemService = Services.get(ItemService)
const globalFilterService = Services.get(GlobalFilterService)

const props = withDefaults(
  defineProps<{
    applyHoverStyle?: boolean,
    price: IPrice,
    showDetails?: boolean,
    showMerchantIcon?: boolean,
    showTooltip?: boolean,
    tooltipSuffix?: string,
    useMerchantFilter?: boolean
  }>(),
  {
    applyHoverStyle: true,
    showDetails: true,
    showMerchantIcon: true,
    showTooltip: true,
    tooltipSuffix: undefined,
    useMerchantFilter: true
  })

const mainCurrency = Services.get(ItemService).getMainCurrency()

const barterItemPrices = ref<IInventoryItemPrice[]>([])
const barterItems = ref<IItem[]>([])
const initialized = ref(false)
const priceDetailPanel = ref()

const canShowDetails = computed(() => props.showDetails
  && (props.price.merchant !== ''
    || showPriceInMainCurrency.value
    || props.price.quest != null
    || isBarter.value))
const canShowMerchantIcon = computed(() => props.showMerchantIcon && props.price.merchant !== '')
const currency = computed(() => itemService.getCurrency(props.price.currencyName))
const displayedCurrency = computed(() => isBarter.value ? mainCurrency : currency.value)
const displayedPrice = computed(() => {
  const value = isBarter.value ? props.price.valueInMainCurrency : props.price.value
  const displayedValue = StatsUtils.getStandardDisplayValue(DisplayValueType.price, value)

  return displayedValue
})
const isBarter = computed(() => props.price.currencyName === 'barter')
const priceTooltip = computed(() => {
  if (!props.showTooltip) {
    return undefined
  }

  let tooltip = vueI18n.t('caption.price')

  if (props.tooltipSuffix != null) {
    tooltip += ` ${props.tooltipSuffix}`
  }

  if (canShowDetails.value) {
    tooltip += ` ${vueI18n.t('caption.priceDetails')}`
  }

  return tooltip
})
const showPriceInMainCurrency = computed(() => !isBarter.value && currency.value.name !== mainCurrency.name)

watch(() => props.price, () => initialize())

onMounted(() => {
  globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  initialize()
})

onUnmounted(() => {
  globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

/**
 * Gets barter items.
 */
async function getBarterItems() {
  barterItems.value = []

  if (!isBarter.value) {
    return
  }

  const itemService = Services.get(ItemService)

  for (const barterItem of props.price.barterItems) {
    const item = await itemService.getItem(barterItem.itemId)
    barterItems.value.push(item)
  }
}

/**
 * Gets barter item prices.
 */
async function getBarterItemPrices() {
  barterItemPrices.value = []

  if (!isBarter.value) {
    return
  }

  const inventoryItemService = Services.get(InventoryItemService)

  for (const barterItem of props.price.barterItems) {
    const barterItemPrice = await inventoryItemService.getPrice(
      {
        content: [],
        ignorePrice: false,
        itemId: barterItem.itemId,
        modSlots: [],
        quantity: barterItem.quantity
      },
      undefined,
      true,
      props.useMerchantFilter)
    barterItemPrices.value.push(barterItemPrice)
  }
}

/**
 * Initializes the price.
 */
async function initialize() {
  initialized.value = false

  barterItems.value = []
  barterItemPrices.value = []

  await getBarterItems()
  await getBarterItemPrices()

  initialized.value = true
}

/**
 * Updates the selected item price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged() {
  getBarterItemPrices()
}

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
@import '../css/icon.css';
@import '../css/link.css';

.price {
  align-items: center;
  display: flex;
  justify-content: end;
}

.price-value-and-icon {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.price-value-and-icon:hover {
  cursor: pointer;
}

.price-details {
  font-size: 0.85rem;
}

.price-details > div {
  margin-top: 0.25rem;
}

.price-details > div:first-child {
  margin-top: 0;
}

.price-details-barter {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.price-details-barter-item {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: 0.25rem;
}

.price-details-barter-item-icon {
  display: flex;
  justify-content: center;
  margin-left: 0.25rem;
  width: 4.5rem;
}

.price-details-barter-item-name {
  margin-left: 0.25rem;
  margin-right: auto;
  max-width: 16.5rem;
}

.price-details-barter-item-quantity {
  text-align: right;
  width: 4rem;
}

.price-details-barter-item-price {
  justify-content: flex-end;
  width: 10rem;
}

.price-details-barter-item-price-per-unit {
  font-size: 0.75rem;
  margin-right: 2.6rem;
}

.price-details-barter-title {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.price-details-main-currency {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.price-details-main-currency-value {
  margin-left: 0.25rem;
}

.price-details-quest {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.price-details-quest-name {
  margin-right: 0.25rem;
}

.price-merchant-icon {
  margin-left: 0.25rem;
}

.price-quest-icon {
  color: var(--warning-color);
}

.price-value {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: end;
  white-space: nowrap;
}
</style>