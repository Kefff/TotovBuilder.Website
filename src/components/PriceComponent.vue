<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
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
import WebBrowserUtils from '../utils/WebBrowserUtils'
import MerchantIcon from './MerchantIconComponent.vue'
import PriceDetailItem from './PriceDetailItemComponent.vue'
import Tooltip from './TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    applyHoverStyle?: boolean,
    customTooltip?: string,
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
    customTooltip: undefined,
    ignorePriceStatus: IgnoredUnitPrice.notIgnored,
    missing: false,
    showDetails: true,
    showMerchantIcon: true,
    showTooltip: true,
    tooltipSuffix: undefined,
    useMerchantFilter: true
  })

const _globalFilterService = Services.get(GlobalFilterService)
const _itemService = Services.get(ItemService)

const _mainCurrency = _itemService.getMainCurrency()

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
const currency = computed(() => _itemService.getCurrency(props.price.currencyName))
const displayedCurrency = computed(() => isBarter.value ? _mainCurrency : currency.value)
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

  let tooltip = props.customTooltip ?? vueI18n.t('caption.price')

  if (props.tooltipSuffix != null) {
    tooltip += ` ${props.tooltipSuffix}`
  }

  if (canShowDetails.value && !isTouchScreen.value) {
    tooltip += ` ${vueI18n.t('caption.clickForDetails')}`
  }

  return tooltip
})
const showPrice = computed(() => initialized.value && (props.ignorePriceStatus === IgnoredUnitPrice.manuallyIgnored || props.ignorePriceStatus === IgnoredUnitPrice.notIgnored))
const showPriceInMainCurrency = computed(() => !isBarter.value && currency.value.name !== _mainCurrency.name)

const barterItemPrices = ref<IInventoryItemPrice[]>([])
const barterItems = ref<IItem[]>([])
const initialized = ref(false)
const isTouchScreen = WebBrowserUtils.isTouchScreen()
const priceDetailPanel = useTemplateRef('priceDetailPanel')

onMounted(() => {
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  initializeAsync()
})

onUnmounted(() => {
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => props.price, () => initializeAsync())

/**
 * Gets barter items.
 */
async function getBarterItemsAsync(): Promise<void> {
  barterItems.value = []

  if (!isBarter.value) {
    return
  }

  const itemService = Services.get(ItemService)

  for (const barterItem of props.price.barterItems) {
    const item = await itemService.getItemAsync(barterItem.itemId)
    barterItems.value.push(item)
  }
}

/**
 * Gets barter item prices.
 */
async function getBarterItemPricesAsync(): Promise<void> {
  barterItemPrices.value = []

  if (!isBarter.value) {
    return
  }

  const inventoryItemService = Services.get(InventoryItemService)

  for (const barterItem of props.price.barterItems) {
    const barterItemPrice = await inventoryItemService.getPriceAsync(
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
async function initializeAsync(): Promise<void> {
  initialized.value = false

  barterItems.value = []
  barterItemPrices.value = []

  await getBarterItemsAsync()
  await getBarterItemPricesAsync()

  initialized.value = true
}

/**
 * Reacts to the click inside the price detail overlay.
 *
 * Prevents the item selection dropdown to close when clicking inside of the price detail popup of one of the dropdown items.
 */
function onClick(event: MouseEvent): void {
  event.stopPropagation()
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the selected item price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  getBarterItemPricesAsync()
}

/**
 * Toggles the details of the price.
 */
function togglePriceDetails(event: Event): void {
  if (!canShowDetails.value) {
    return
  }

  priceDetailPanel.value?.toggle(event)
  event.stopPropagation()
}
</script>










<template>
  <div
    v-if="showPrice"
    class="price"
  >
    <Tooltip
      :apply-hover-style="applyHoverStyle"
      :tooltip="priceTooltip"
      @click="togglePriceDetails"
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
          class="price-icons"
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
            v-if="price.merchant != '' && ignorePriceStatus === IgnoredUnitPrice.notIgnored"
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
            :icon="_mainCurrency.iconName"
            :class="'currency-' + _mainCurrency.name"
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
          :missing="barterItemPrices[index].unitPrice.valueInMainCurrency === 0"
          :price="barterItemPrices[index].price"
          :quantity="barterItem.quantity"
          :unit-price="barterItemPrices[index].unitPrice"
          class="price-details-barter-item"
        />
      </div>
    </div>
  </OverlayPanel>
</template>










<style scoped>
.price {
  align-items: center;
  display: flex;
  justify-content: end;
}

.price-icons {
  align-items: center;
  display: flex;
  gap: 0.25rem;
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
  gap: 0.25rem;
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