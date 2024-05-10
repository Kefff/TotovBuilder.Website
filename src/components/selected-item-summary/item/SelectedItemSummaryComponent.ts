import { computed, defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { IgnoredUnitPrice } from '../../../models/utils/IgnoredUnitPrice'
import { IInventoryItemPrice } from '../../../models/utils/IInventoryItemPrice'
import { IWeight } from '../../../models/utils/IWeight'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { InventoryItemService } from '../../../services/InventoryItemService'
import Services from '../../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    Price
  },
  props: {
    inventoryItem: {
      type: Object as PropType<IInventoryItem>,
      required: true
    },
    canBeLooted: {
      type: Boolean,
      required: false,
      default: true
    },
    inventoryItemInSameSlotInPreset: { // When the parent item is a preset, represents the inventory item that is in the same slot in the preset
      type: Object as PropType<IInventoryItem>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const globalFilterService = Services.get(GlobalFilterService)
    const inventoryItemService = Services.get(InventoryItemService)

    const hasMissingPrice = computed(() => selectedItemPrice.value.missingPrice
      && !props.inventoryItem.ignorePrice
      && selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored
      && selectedItemPrice.value.unitPrice.valueInMainCurrency === 0) // We don't show the missing price icon on items that contain an item with a missing price
    const showPrice = computed(() => selectedItemPrice.value.unitPriceIgnoreStatus === IgnoredUnitPrice.notIgnored)
    const showUnitPrice = computed(() => showPrice.value && selectedItemPrice.value.price.valueInMainCurrency !== selectedItemPrice.value.unitPrice.valueInMainCurrency)

    const selectedItemPrice = ref<IInventoryItemPrice>({
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
      priceWithContentInMainCurrency: 0,
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
    const selectedItemWeight = ref<IWeight>({
      weight: 0,
      weightWithContent: 0,
      unitWeight: 0
    })

    watch(() => [
      props.inventoryItem.ignorePrice,
      props.inventoryItem.itemId,
      props.inventoryItem.quantity,
      props.inventoryItemInSameSlotInPreset?.itemId
    ], () => {
      setPrice()
    })

    watch(() => [props.inventoryItem.itemId, props.inventoryItem.quantity], () => {
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
      selectedItemPrice.value = await inventoryItemService.getPrice(props.inventoryItem, props.inventoryItemInSameSlotInPreset, props.canBeLooted)
    }

    /**
     * Sets the weight of the inventory items.
     */
    async function setWeight() {
      selectedItemWeight.value = await inventoryItemService.getWeight(props.inventoryItem)
    }

    return {
      DisplayValueType,
      hasMissingPrice,
      IgnoredUnitPrice,
      selectedItemPrice,
      selectedItemWeight,
      showPrice,
      showUnitPrice,
      StatsUtils
    }
  }
})