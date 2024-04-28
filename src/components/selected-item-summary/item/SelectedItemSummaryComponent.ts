import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { IgnoredUnitPrice } from '../../../models/utils/IgnoredUnitPrice'
import { IInventoryItemPrice } from '../../../models/utils/IInventoryItemPrice'
import { IWeight } from '../../../models/utils/IWeight'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { InventoryItemService } from '../../../services/InventoryItemService'
import Services from '../../../services/repository/Services'
import StatsUtils from '../../../utils/StatsUtils'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    Price
  },
  props: {
    modelValue: {
      type: Object as PropType<IInventoryItem>,
      required: true
    },
    canBeLooted: {
      type: Boolean,
      required: false,
      default: true
    },
    itemInSameSlotInPreset: { // When the parent item is a preset, represets the item that is in the same slot in the preset
      type: Object as PropType<IInventoryItem>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const globalFilterService = Services.get(GlobalFilterService)
    const inventoryItemService = Services.get(InventoryItemService)

    const hasMissingPrice = computed(() => price.value.missingPrice
      && !props.modelValue.ignorePrice
      && price.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored
      && price.value.unitPrice.valueInMainCurrency === 0) // We don't show the missing price icon on items that contain an item with a missing price
    const showPrice = computed(() => price.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored)
    const showUnitPrice = computed(() => showPrice.value && price.value.price.valueInMainCurrency !== price.value.unitPrice.valueInMainCurrency)

    const price = ref<IInventoryItemPrice>({
      missingPrice: false,
      price: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPrice: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    })
    const weight = ref<IWeight>({
      weight: 0,
      weightWithContent: 0,
      unitWeight: 0
    })

    watch(() => [
      props.modelValue.ignorePrice,
      props.modelValue.itemId,
      props.modelValue.quantity,
      props.itemInSameSlotInPreset?.itemId
    ], () => {
      setPrice()
    })

    watch(() => [props.modelValue.itemId, props.modelValue.quantity], () => {
      setWeight()
    })

    onMounted(() => {
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      setPrice()
      setWeight()
    })

    onUnmounted(() => {
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
    })

    /**
     * Updates the selected item price to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      setPrice()
    }

    /**
     * Sets the price of the inventory item.
     */
    async function setPrice() {
      const priceResult = await inventoryItemService.getPrice(props.modelValue, props.itemInSameSlotInPreset, props.canBeLooted)

      if (priceResult.success) {
        price.value = priceResult.value
      } else {
        price.value = {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          pricesWithContent: [],
          priceWithContentInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        }
      }
    }

    /**
     * Sets the weight of the inventory items.
     */
    async function setWeight() {
      const weightResult = await inventoryItemService.getWeight(props.modelValue)

      if (weightResult.success) {
        weight.value = weightResult.value
      } else {
        weight.value = {
          unitWeight: 0,
          weight: 0,
          weightWithContent: 0
        }
      }
    }

    return {
      hasMissingPrice,
      IgnoredUnitPrice,
      price,
      showPrice,
      showUnitPrice,
      StatsUtils,
      weight
    }
  }
})