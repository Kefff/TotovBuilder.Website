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
    const showDetails = ref(false)
    const canShowDetails = computed(() => {
      return props.price.currencyName !== mainCurrency.value?.name || props.price.merchant !== ''
    })
    const displayedPrice = ref('')

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

      if (props.price.currencyName === 'barter') {
        currency.value = mainCurrency.value
        displayedPrice.value = props.price.valueInMainCurrency.toLocaleString()
      } else {
        displayedPrice.value = props.price.value.toLocaleString()
      }
    }

    /**
     * Toggles the details of the price.
     */
    function togglePriceDetails(event: Event) {
      if (!canShowDetails.value) {
        return
      }

      showDetails.value = !showDetails.value
      event.stopPropagation()
    }

    return {
      canShowDetails,
      currency,
      displayedPrice,
      mainCurrency,
      showDetails,
      showPriceInMainCurrency,
      togglePriceDetails,
      tooltip
    }
  }
})

