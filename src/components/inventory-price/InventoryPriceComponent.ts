import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
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
    isBuild: {
      type: Boolean,
      required: true
    }
  },
  setup: (props) => {
    const mainCurrency = ref<ICurrency>()
    const priceDetailPanel = ref()
    const priceInMainCurrency = ref(0)
    const showPriceInMainCurrency = ref(false)

    const canShowDetails = computed(() => props.inventoryPrice.priceByCurrency.some(ip => ip.currencyName !== mainCurrency.value?.name))

    watch(() => props.inventoryPrice, () => initialize())

    onMounted(() => initialize())

    /**
     * Initializes the component.
     */
    async function initialize() {
      const mainCurrencyResult = await Services.get(ItemService).getMainCurrency()
      priceInMainCurrency.value = 0

      if (!mainCurrencyResult.success) {
        return
      }

      mainCurrency.value = mainCurrencyResult.value
      showPriceInMainCurrency.value = props.inventoryPrice.priceByCurrency.some(p => p.currencyName !== mainCurrency.value?.name)

      for (const priceWithContent of props.inventoryPrice.priceByCurrency) {
        priceInMainCurrency.value += priceWithContent.valueInMainCurrency
      }
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

    return {
      canShowDetails,
      DisplayValueType,
      mainCurrency,
      priceDetailPanel,
      priceInMainCurrency,
      StatsUtils,
      togglePriceDetails
    }
  }
})