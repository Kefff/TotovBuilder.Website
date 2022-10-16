import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IPrice } from '../../models/item/IPrice'
import vueI18n from '../../plugins/vueI18n'
import { ItemService } from '../../services/ItemService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'

export default defineComponent({
  props: {
    price: {
      type: Object as PropType<IPrice>,
      required: true
    },
    showMerchantIcon: {
      type: Boolean,
      required: false,
      default: true
    },
    showTooltip: {
      type: Boolean,
      required: false,
      default: true
    },
    tooltipSuffix: {
      type: String,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const tooltip = computed(() => props.showTooltip ? vueI18n.t('caption.price') + (props.tooltipSuffix ?? '') : '')
    const showPriceInMainCurrency = computed(() => {
      if (currency.value?.name === 'barter') {
        // TODO : Handling barters - WORKAROUND WAITING FOR BARTERS TO BE HANDLED. REMOVE THIS WHEN IT IS DONE
        return false
      }

      return currency.value?.name !== mainCurrency.value?.name && props.showTooltip
    })
    const mainCurrency = ref<ICurrency>()
    const currency = ref<ICurrency>()
    const priceInMainCurrencyPanel = ref()

    watch(() => props.price, () => initialize())

    onMounted(() => initialize())

    /**
     * Sets the tooltip.
     */
    async function initialize() {
      const notificationService = Services.get(NotificationService)
      const mainCurrencyResult = await Services.get(ItemService).getMainCurrency()
      const currencyResult = await Services.get(ItemService).getCurrency(props.price.currencyName)

      if (!mainCurrencyResult.success) {
        notificationService.notify(NotificationType.error, mainCurrencyResult.failureMessage)

        return
      } else if (!currencyResult.success) {
        notificationService.notify(NotificationType.error, currencyResult.failureMessage)

        return
      }

      mainCurrency.value = mainCurrencyResult.value
      currency.value = currencyResult.value
    }

    /**
     * Toggles the advanced menu.
     * @param event - Event.
     */
    function togglePriceInMainCurrencyPanel(event: unknown) {
      if (showPriceInMainCurrency.value || props.price.merchant !== '') {
        priceInMainCurrencyPanel.value?.toggle(event) // In some cames the priceInMainCurrencyPanel is still undefined when the event is triggered. I don't really know why.
      }
    }

    return {
      currency,
      mainCurrency,
      priceInMainCurrencyPanel,
      showPriceInMainCurrency,
      togglePriceInMainCurrencyPanel,
      tooltip
    }
  }
})

