import { defineComponent, onMounted, PropType, ref } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { IPrice } from '../../../models/item/IPrice'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    Price
  },
  props: {
    item: {
      type: Object as PropType<IItem>,
      required: true
    }
  },
  setup: (props) => {
    const inventoryItemService = Services.get(InventoryItemService)
    const notificationService = Services.get(NotificationService)

    const prices = ref<IPrice[]>([])

    onMounted(() => {
      setPrices()
    })

    /**
     * Opens a new tab displaying the item in Tarkov.dev.
     */
    function openMarket() {
      window.open(props.item.marketLink, '_blank')
    }

    /**
     * Opens a new tab displaying the item in the Wiki.
     */
    function openWiki() {
      window.open(props.item.wikiLink, '_blank')
    }

    /**
     * Sets the prices to display.
     */
    async function setPrices() {
      // Using an intermidiate variable here because directly adding prices to prices.value and then sorting them mixes up
      // barters displayed in the price detail popups
      const pricesToDisplay: IPrice[] = []

      for (const price of props.item.prices) {
        // Creating a new instance because we need to calculate de valueInMainCurrency of the barter prices ignoring the merchant filter.
        // If we directly use references to itemResult.value.prices, then we modify those prices for the whole application each time we pass here
        const priceToAdd = { ...price }

        if (priceToAdd.currencyName === 'barter') {
          let barterPrice = 0

          for (const barterItem of priceToAdd.barterItems) {
            const barterItemPriceResult = await inventoryItemService.getPrice({
              content: [],
              ignorePrice: false,
              itemId: barterItem.itemId,
              modSlots: [],
              quantity: barterItem.quantity
            }, undefined, true, false)

            if (!barterItemPriceResult.success) {
              notificationService.notify(NotificationType.error, barterItemPriceResult.failureMessage)

              continue
            }

            barterPrice += barterItemPriceResult.value.priceWithContentInMainCurrency.valueInMainCurrency
          }

          priceToAdd.valueInMainCurrency = barterPrice
        }

        pricesToDisplay.push(priceToAdd)
      }

      prices.value = pricesToDisplay.sort((i1, i2) => i1.valueInMainCurrency - i2.valueInMainCurrency)
    }

    return {
      openMarket,
      openWiki,
      prices
    }
  }
})