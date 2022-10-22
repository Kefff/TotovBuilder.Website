import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../../models/build/IInventoryModSlot'
import { IgnoredUnitPrice } from '../../../models/utils/IgnoredUnitPrice'
import { IInventoryPrice } from '../../../models/utils/IInventoryPrice'
import { IWeight } from '../../../models/utils/IWeight'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { MerchantFilterService } from '../../../services/MerchantFilterService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import Result from '../../../utils/Result'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ItemIcon,
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
    preset: {
      type: Object as PropType<IInventoryModSlot>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const merchantFilterService = Services.get(MerchantFilterService)
    merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

    const inventoryItemService = Services.get(InventoryItemService)
    const price = ref<IInventoryPrice>({
      missingPrice: false,
      price: {
        barterItems: [], // TODO : Handling barters
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      priceWithContentInMainCurrency: {
        barterItems: [], // TODO : Handling barters
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPrice: {
        barterItems: [], // TODO : Handling barters
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
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

    let priceSettingPromise: Promise<Result<IInventoryPrice>> = Promise.resolve(Result.ok({} as IInventoryPrice))

    watch(() => [
      props.modelValue.ignorePrice,
      props.modelValue.itemId,
      props.modelValue.quantity,
      props.preset?.item?.itemId
    ], () => {
      setPrice()
    })

    watch(() => [props.modelValue.itemId, props.modelValue.quantity], () => {
      setWeight()
    })

    onMounted(() => {
      setPrice()
      setWeight()
    })

    onUnmounted(() => {
      merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged)
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
      // Awaiting for previous price setting.
      // This is because when the component is first mounted, the item preset is not always defined right away.
      // So there were cases where the price is gotten with an undefined props.preset?.item that is then updated while inventoryItemService.getPrice() is being executed.
      // That triggered another call to inventoryItemService.getPrice() that could be resolved before the first call.
      // So the result of the first call could overwrite the result of the second call.
      await priceSettingPromise

      priceSettingPromise = inventoryItemService.getPrice(props.modelValue, props.preset?.item, props.canBeLooted)
      const priceResult = await priceSettingPromise

      if (!priceResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, priceResult.failureMessage)

        return
      }

      price.value = priceResult.value
    }

    /**
     * Sets the weight of the inventory items.
     */
    async function setWeight() {
      const weightResult = await inventoryItemService.getWeight(props.modelValue)

      if (!weightResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, weightResult.failureMessage)

        return
      }

      weight.value = weightResult.value
    }

    return {
      IgnoredUnitPrice,
      price,
      weight
    }
  }
})