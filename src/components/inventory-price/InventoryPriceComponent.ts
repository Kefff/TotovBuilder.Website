import { computed, defineComponent, PropType, ref } from 'vue'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Price from '../price/PriceComponent.vue'
import Tooltip from '../tooltip/TooltipComponent.vue'

export default defineComponent({
  components: {
    Price,
    Tooltip
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
    let _mainCurrency: ICurrency | undefined

    const priceDetailPanel = ref()

    const priceInMainCurrency = computed(() => props.inventoryPrice.priceByCurrency.reduce((total, priceInCurrency) => total + priceInCurrency.valueInMainCurrency, 0))
    const canShowDetails = computed(() => props.inventoryPrice.priceByCurrency.some(ip => ip.currencyName !== mainCurrency.value?.name))
    const mainCurrency = computed(() => {
      if (_mainCurrency == null) {
        _mainCurrency = Services.get(ItemService).getMainCurrency()
      }

      return _mainCurrency
    })

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