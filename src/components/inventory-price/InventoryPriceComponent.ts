import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { ICurrency } from '../../models/item/ICurrency'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { ItemService } from '../../services/ItemService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import Price from '../price/PriceComponent.vue'

export default defineComponent({
  components: {
    Price
  },
  props: {
    inventoryPrice: {
      type: Object as PropType<IInventoryPrice>,
      required: true
    },
    showSpaceForIcon: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const showPriceInMainCurrency = ref(false)
    const mainCurrency = ref<ICurrency>()
    const priceInMainCurrency = ref(0)
    const priceInMainCurrencyPanel = ref()

    const missingPriceIconClass = computed(() => {
      if (!props.showSpaceForIcon) {
        return 'inventory-price-missing-price-icon-no-width'
      } else {
        return 'inventory-price-missing-price-icon'
      }
    })

    watch(() => props.inventoryPrice, () => initialize())

    onMounted(() => initialize())

    /**
     * Sets the tooltip.
     */
    async function initialize() {
      const notificationService = Services.get(NotificationService)
      const mainCurrencyResult = await Services.get(ItemService).getMainCurrency()
      priceInMainCurrency.value = 0

      if (!mainCurrencyResult.success) {
        notificationService.notify(NotificationType.error, mainCurrencyResult.failureMessage)

        return
      }

      mainCurrency.value = mainCurrencyResult.value
      showPriceInMainCurrency.value = props.inventoryPrice.pricesWithContent.some(p => p.currencyName !== mainCurrency.value?.name)

      for (const priceWithContent of props.inventoryPrice.pricesWithContent) {
        priceInMainCurrency.value += priceWithContent.valueInMainCurrency
      }
    }

    /**
     * Toggles the advanced menu.
     * @param event - Event.
     */
    function togglePriceInMainCurrencyPanel(event: unknown) {
      if (showPriceInMainCurrency.value) {
        priceInMainCurrencyPanel.value?.toggle(event) // In some cames the priceInMainCurrencyPanel is still undefined when the event is triggered. I don't really know why.
      }
    }

    return {
      mainCurrency,
      missingPriceIconClass,
      priceInMainCurrency,
      priceInMainCurrencyPanel,
      togglePriceInMainCurrencyPanel
    }
  }
})