<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

const prices = ref<IPrice[]>([])

onMounted(() => {
  setPricesAsync()
})

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
  <div class="stats-category">
    {{ $t('caption.pricesAndWeight') }}
  </div>
  <div class="stats-line">
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
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="weight-hanging"
          class="icon-before-text"
        />
        <span>{{ $t('caption.weight') }} :</span>
      </div>
      <div class="stats-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, item.weight) }}
      </div>
    </div>
  </div>
  <slot />
  <div class="stats-category">
    {{ $t('caption.links') }}
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
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
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
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
</template>