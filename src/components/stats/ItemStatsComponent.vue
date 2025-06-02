<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { InventoryItemService } from '../../services/InventoryItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Price from '../PriceComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const _inventoryItemService = Services.get(InventoryItemService)

const weight = computed(() => props.item?.presetWeight ?? props.item.weight)

const prices = ref<IPrice[]>([])

onMounted(() => setPricesAsync())

/**
 * Opens a new tab displaying the item in Tarkov.dev.
 */
function openMarket(): void {
  window.open(props.item.marketLink, '_blank')
}

/**
 * Opens a new tab displaying the item in the Wiki.
 */
function openWiki(): void {
  window.open(props.item.wikiLink, '_blank')
}

/**
 * Sets the prices to display.
 */
async function setPricesAsync(): Promise<void> {
  // Using an intermidiate variable here because directly adding prices to prices.value and then sorting them mixes up
  // barters displayed in the price detail popups
  const pricesToDisplay: IPrice[] = []

  for (const price of props.item.prices) {
    // Creating a new instance because we need to calculate de valueInMainCurrency of the barter prices ignoring the merchant filter.
    // If we directly use references to props.item.prices, then we modify those prices for the whole application each time we pass here
    const priceToAdd = { ...price }

    if (priceToAdd.currencyName === 'barter') {
      let barterPrice = 0

      for (const barterItem of priceToAdd.barterItems) {
        const barterItemPrice = await _inventoryItemService.getPriceAsync(
          {
            content: [],
            ignorePrice: false,
            itemId: barterItem.itemId,
            modSlots: [],
            quantity: barterItem.quantity
          },
          undefined,
          true,
          false)
        barterPrice += barterItemPrice.priceWithContentInMainCurrency
      }

      priceToAdd.valueInMainCurrency = barterPrice
    }

    pricesToDisplay.push(priceToAdd)
  }

  prices.value = pricesToDisplay.sort((i1, i2) => i1.valueInMainCurrency - i2.valueInMainCurrency)
}

</script>










<template>
  <!-- Links -->
  <div
    v-if="item.marketLink != null || item.wikiLink != null"
    class="stats-category"
  >
    {{ $t('caption.links') }}
  </div>
  <div
    v-if="item.marketLink != null || item.wikiLink != null"
    class="stats-line"
  >
    <div
      v-if="item.marketLink != null || item.wikiLink != null"
      class="stats-entry"
    >
      <div
        v-if="item.marketLink != null"
        class="stats-caption"
      >
        <font-awesome-icon
          icon="globe"
          class="icon-before-text"
        />
        <span
          class="link"
          @click="openMarket()"
        >
          Tarkov.dev
        </span>
      </div>
      <div
        v-if="item.wikiLink != null"
        class="stats-caption"
      >
        <font-awesome-icon
          icon="globe"
          class="icon-before-text"
        />
        <span
          class="link"
          @click="openWiki()"
        >
          Wiki
        </span>
      </div>
    </div>
  </div>
  <!-- Weight and prices -->
  <div
    v-if="weight > 0 || prices.length > 0"
    class="stats-category"
  >
    {{ $t('caption.weightAndPrices') }}
  </div>
  <div
    v-if="weight > 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="weight-hanging"
          class="icon-before-text"
        />
        <span>{{ $t('caption.weight') }} :</span>
      </div>
      <div class="stats-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, weight) }}
      </div>
    </div>
  </div>
  <div
    v-if="prices.length > 0"
    class="stats-line item-stats-price"
  >
    <div
      v-for="(price, index) of prices"
      :key="index"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="coins"
          class="icon-before-text"
        />
        <span>{{ $t('caption.merchant_' + price.merchant) + (price.merchantLevel > 0 ? ' ' + $t('caption.level').toLocaleLowerCase() + ' ' + price.merchantLevel : '') }} :</span>
      </div>
      <div class="stats-value">
        <Price
          :price="price"
          :use-merchant-filter="false"
        />
      </div>
    </div>
  </div>
</template>










<style scoped>
.item-stats-price {
  grid-row-gap: 0.5rem;
}
</style>