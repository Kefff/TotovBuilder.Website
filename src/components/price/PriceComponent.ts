import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { IInventoryItemPrice } from '../../models/utils/IInventoryItemPrice'
import vueI18n from '../../plugins/vueI18n'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'
import MerchantIcon from '../merchant-icon/MerchantIconComponent.vue'

export default defineComponent({
  components: {
    ItemIcon,
    MerchantIcon
  },
  props: {
    price: {
      type: Object as PropType<IPrice>,
      required: true
    },
    showDetails: {
      type: Boolean,
      required: false,
      default: true
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
    },
    useMerchantFilter: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const itemService = Services.get(ItemService)
    const globalFilterService = Services.get(GlobalFilterService)


    const mainCurrency = Services.get(ItemService).getMainCurrency()

    const barterItemPrices = ref<IInventoryItemPrice[]>([])
    const barterItems = ref<IItem[]>([])
    const initialized = ref(false)
    const priceDetailPanel = ref()

    const canShowDetails = computed(() => {
      return props.showDetails
        && (showPriceInMainCurrency.value
          || props.price.quest != null
          || isBarter.value)
    })
    const canShowMerchantIcon = computed(() => props.showMerchantIcon && props.price.merchant !== '')
    const currency = computed(() => itemService.getCurrency(props.price.currencyName))
    const displayedCurrency = computed(() => isBarter.value ? mainCurrency : currency.value)
    const displayedPrice = computed(() => {
      const value = isBarter.value ? props.price.valueInMainCurrency : props.price.value
      const displayedValue = StatsUtils.getStandardDisplayValue(DisplayValueType.price, value)

      return displayedValue
    })
    const isBarter = computed(() => props.price.currencyName === 'barter')

    const merchantTooltip = computed(() => props.showTooltip
      ? (props.price.merchant !== ''
        ? (vueI18n.t('caption.merchant_' + props.price.merchant)
          + (props.price.merchantLevel !== 0
            ? (' ' + vueI18n.t('caption.level').toLowerCase() + ' ' + props.price.merchantLevel)
            : '')
          + (isBarter.value ? '\n' + vueI18n.t('caption.barter') : '')
          + (props.price.quest != null ? '\n' + vueI18n.t('caption.questRequired') : ''))
        : '')
      : '')
    const priceValueTooltip = computed(() => props.showTooltip ? vueI18n.t('caption.price') + (props.tooltipSuffix ?? '') : '')
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
     * Sets the tooltip.
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

    return {
      barterItemPrices,
      barterItems,
      canShowDetails,
      canShowMerchantIcon,
      currency,
      displayedCurrency,
      displayedPrice,
      DisplayValueType,
      initialized,
      isBarter,
      mainCurrency,
      merchantTooltip,
      priceDetailPanel,
      priceValueTooltip,
      showPriceInMainCurrency,
      StatsUtils,
      togglePriceDetails
    }
  }
})

