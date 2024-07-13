<template>
  <div
    v-if="showPrice"
    class="price"
  >
    <Tooltip
      :apply-hover-style="applyHoverStyle"
      :tooltip="priceTooltip"
      @click="(e: MouseEvent) => togglePriceDetails(e)"
    >
      <div
        class="price-value-and-icon"
        :class="canShowDetails ? 'price-value-and-icon-with-details' : ''"
      >
        <div
          v-if="price.valueInMainCurrency > 0"
          class="price-value"
        >
          <font-awesome-icon
            :icon="displayedCurrency.iconName"
            :class="'currency-' + displayedCurrency.name"
          />
          <span>{{ displayedPrice }}</span>
        </div>
        <div
          v-if="canShowIcon"
          class="price-icon"
        >
          <div
            v-if="ignorePriceStatus === IgnoredUnitPrice.manuallyIgnored"
            class="price-ignored-icon"
          >
            <font-awesome-icon icon="ban" />
          </div>
          <div
            v-else-if="missing"
            class="price-missing-icon"
          >
            <font-awesome-icon icon="exclamation-triangle" />
          </div>
          <MerchantIcon
            v-else-if="ignorePriceStatus === IgnoredUnitPrice.notIgnored"
            :is-barter="isBarter"
            :merchant="price.merchant"
            :merchant-level="price.merchantLevel"
            :requires-quest="price.quest != null"
            :show-tooltip="showTooltip"
          />
        </div>
      </div>
    </Tooltip>
  </div>

  <!-- Price details -->
  <OverlayPanel
    ref="priceDetailPanel"
    :dismissable="true"
    @click="onClick($event)"
  >
    <div class="price-details-header">
      <Button
        class="price-details-header-close-button p-button-text p-button-sm button-discreet"
        @click="togglePriceDetails($event)"
      >
        <font-awesome-icon icon="times" />
      </Button>
    </div>
    <div class="price-details">
      <div
        v-if="ignorePriceStatus === IgnoredUnitPrice.manuallyIgnored"
        class="price-details-line"
      >
        <font-awesome-icon
          icon="ban"
          class="icon-before-text price-details-ignored-icon"
        />
        <span>{{ $t('caption.ignoredPrice_manuallyIgnored') }}</span>
      </div>
      <div
        v-else-if="missing"
        class="price-details-line"
      >
        <font-awesome-icon
          icon="exclamation-triangle"
          class="icon-before-text price-details-missing-icon"
        />
        <span>{{ $t('message.itemWithMissingPrice') }}</span>
      </div>
      <div
        v-if="showPriceInMainCurrency"
        class="price-details-line price-details-main-currency"
      >
        <font-awesome-icon
          icon="coins"
          class="icon-before-text"
        />
        <div>{{ $t('caption.priceEqualsTo') }}</div>
        <div class="price-details-main-currency-value">
          <font-awesome-icon
            :icon="mainCurrency.iconName"
            :class="'currency-' + mainCurrency.name"
          />
          <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.price, price.valueInMainCurrency) }}</span>
        </div>
      </div>
      <div
        v-if="price.merchant !== ''"
        class="price-details-line"
      >
        <font-awesome-icon
          icon="user-tag"
          class="icon-before-text"
        />
        <span>{{ $t('caption.merchant') + ' : ' + $t('caption.merchant_' + price.merchant) + (price.merchantLevel !== 0 ? ` ${$t('caption.level').toLowerCase()} ${price.merchantLevel}` : '') }}</span>
      </div>
      <div
        v-if="price.quest != null"
        class="price-details-line price-details-quest"
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
        <div class="price-details-line price-details-barter-title">
          <font-awesome-icon
            :icon="currency.iconName"
            class="icon-before-text"
          />
          <span>{{ $t('caption.barter') }} :</span>
        </div>
        <PriceDetailItem
          v-for="(barterItem, index) of price.barterItems"
          :key="barterItem.itemId"
          :item="barterItems[index]"
          :price="barterItemPrices[index].price"
          :quantity="barterItem.quantity"
          :unit-price="barterItemPrices[index].unitPrice"
          class="price-details-barter-item"
        />
      </div>
    </div>
  </OverlayPanel>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IItem } from '../models/item/IItem'
import { IPrice } from '../models/item/IPrice'
import { IgnoredUnitPrice } from '../models/utils/IgnoredUnitPrice'
import { IInventoryItemPrice } from '../models/utils/IInventoryItemPrice'
import vueI18n from '../plugins/vueI18n'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { InventoryItemService } from '../services/InventoryItemService'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../utils/StatsUtils'
import MerchantIcon from './MerchantIconComponent.vue'
import PriceDetailItem from './PriceDetailItemComponent.vue'

const itemService = Services.get(ItemService)
const globalFilterService = Services.get(GlobalFilterService)

const props = withDefaults(
  defineProps<{
    applyHoverStyle?: boolean,
    ignorePriceStatus?: IgnoredUnitPrice
    missing?: boolean,
    price: IPrice,
    showDetails?: boolean,
    showMerchantIcon?: boolean,
    showTooltip?: boolean,
    tooltipSuffix?: string,
    useMerchantFilter?: boolean
  }>(),
  {
    applyHoverStyle: true,
    ignorePriceStatus: IgnoredUnitPrice.notIgnored,
    missing: false,
    showDetails: true,
    showMerchantIcon: true,
    showTooltip: true,
    tooltipSuffix: undefined,
    useMerchantFilter: true
  })

// cf. https://stackoverflow.com/a/63666289
const isTouchScreen = matchMedia('(hover: none)').matches
const mainCurrency = Services.get(ItemService).getMainCurrency()

const barterItemPrices = ref<IInventoryItemPrice[]>([])
const barterItems = ref<IItem[]>([])
const initialized = ref(false)
const priceDetailPanel = ref()

const canShowDetails = computed(() => props.showDetails
  && (props.price.merchant !== ''
    || showPriceInMainCurrency.value
    || props.price.quest != null
    || isBarter.value
    || props.ignorePriceStatus === IgnoredUnitPrice.manuallyIgnored
    || props.missing))
const canShowIcon = computed(() => props.showMerchantIcon
  && (props.price.merchant !== ''
    || props.ignorePriceStatus === IgnoredUnitPrice.manuallyIgnored
    || props.missing))
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

  if (canShowDetails.value && !isTouchScreen) {
    tooltip += ` ${vueI18n.t('caption.priceDetails')}`
  }

  return tooltip
})
const showPrice = computed(() => initialized.value && (props.ignorePriceStatus === IgnoredUnitPrice.manuallyIgnored || props.ignorePriceStatus === IgnoredUnitPrice.notIgnored))
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
 * Reacts to the click inside the price detail overlay.
 *
 * Prevents the item selection dropdown to close when clicking inside of the price detail popup of one of the dropdown items.
 */
function onClick(event: MouseEvent) {
  event.stopPropagation()
}

/**
 * Reacts to the merchant filter being changed.
 *
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
@import '../css/button.css';
@import '../css/currency.css';
@import '../css/icon.css';
@import '../css/link.css';

.price {
  align-items: center;
  display: flex;
  justify-content: end;
}

.price-ignored-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.price-missing-icon {
  align-items: center;
  color: var(--error-color);
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 2rem;
}

.price-value-and-icon {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.price-value-and-icon-with-details:hover {
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
  margin-top: 0.25rem;
  margin-left: 0.5rem;
}

.price-details-barter-title {
  flex-wrap: nowrap;
}

.price-details-header {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  height: 1rem;
  margin-bottom: 0.5rem;
}

.price-details-header-close-button {
  color: var(--util-color7) !important;
  font-size: 1rem !important;
  padding: 0 !important;
}

.price-details-ignored-icon {
  color: var(--error-color);
}

.price-details-line {
  align-items: center;
  display: flex;
  flex-direction: row;
  white-space: preserve;
}

.price-details-main-currency {
  flex-wrap: nowrap;
}

.price-details-main-currency-value {
  align-items: center;
  display: flex;
  margin-left: 0.25rem;
}

.price-details-missing-icon {
  color: var(--error-color);
}

.price-details-quest {
  flex-wrap: wrap;
}

.price-details-quest-name {
  margin-right: 0.25rem;
}

.price-icon {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
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