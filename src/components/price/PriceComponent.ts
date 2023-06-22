import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { ICurrency } from '../../models/configuration/ICurrency'
import { IItem } from '../../models/item/IItem'
import { IPrice } from '../../models/item/IPrice'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import vueI18n from '../../plugins/vueI18n'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemService } from '../../services/ItemService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import ItemIcon from '../item-icon/ItemIconComponent.vue'

export default defineComponent({
  components: {
    ItemIcon
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
    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

    const barterItemPrices = ref<IInventoryPrice[]>([])
    const barterItems = ref<IItem[]>([])
    const currency = ref<ICurrency>()
    const displayedCurrency = ref<ICurrency>()
    const displayedPrice = ref('')
    const initialized = ref(false)
    const mainCurrency = ref<ICurrency>()
    const priceDetailPanel = ref()

    const canShowDetails = computed(() => {
      return props.showDetails
        && (showPriceInMainCurrency.value
          || props.price.quest != null
          || isBarter.value)
    })
    const canShowMerchantIcon = computed(() => props.showMerchantIcon && props.price.merchant !== '')
    const isBarter = computed(() => props.price.currencyName === 'barter')
    const merchantTooltip = computed(() => props.showTooltip
      ? (props.price.merchant !== ''
        ? (vueI18n.t('caption.merchant_' + props.price.merchant)
          + (props.price.merchantLevel !== 0
            ? (' ' + vueI18n.t('caption.level').toLowerCase() + ' ' + props.price.merchantLevel)
            : '')
          + (isBarter.value ? '\n' + vueI18n.t('caption.barter') : ''))
        : '')
      : '')
    const priceValueTooltip = computed(() => props.showTooltip ? vueI18n.t('caption.price') + (props.tooltipSuffix ?? '') : '')
    const showPriceInMainCurrency = computed(() => !isBarter.value && currency.value?.name !== mainCurrency.value?.name)

    watch(() => props.price, () => initialize())

    onMounted(() => initialize())

    onUnmounted(() => {
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
    })

    /**
     * Gets barter items.
     */
    async function getBarterItems() {
      if (!isBarter.value) {
        return
      }

      const itemService = Services.get(ItemService)

      for (const barterItem of props.price.barterItems) {
        const itemResult = await itemService.getItem(barterItem.itemId)

        if (!itemResult.success) {
          Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

          return
        }

        barterItems.value?.push(itemResult.value)
      }
    }

    /**
     * Gets barter item prices.
     */
    async function getBarterItemPrices() {
      if (!isBarter.value) {
        return
      }

      const inventoryItemService = Services.get(InventoryItemService)

      for (const barterItem of props.price.barterItems) {
        const priceResult = await inventoryItemService.getPrice({
          content: [],
          ignorePrice: false,
          itemId: barterItem.itemId,
          modSlots: [],
          quantity: barterItem.quantity
        }, undefined, true, props.useMerchantFilter)

        if (!priceResult.success) {
          Services.get(NotificationService).notify(NotificationType.error, priceResult.failureMessage)

          return
        }

        barterItemPrices.value.push(priceResult.value)
      }
    }

    /**
     * Sets the tooltip.
     */
    async function initialize() {
      initialized.value = false

      barterItems.value = []
      barterItemPrices.value = []

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

      if (isBarter.value) {
        displayedCurrency.value = mainCurrency.value
        displayedPrice.value = props.price.valueInMainCurrency.toLocaleString()
      } else {
        displayedCurrency.value = currency.value
        displayedPrice.value = props.price.value.toLocaleString()
      }

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
      initialized,
      isBarter,
      mainCurrency,
      merchantTooltip,
      priceDetailPanel,
      priceValueTooltip,
      showPriceInMainCurrency,
      togglePriceDetails
    }
  }
})

