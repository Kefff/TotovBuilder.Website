import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { IPrice } from '../../../models/utils/IPrice'
import { InventoryItemService } from '../../../services/InventoryItemService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ItemIcon,
    Price
  },
  props: {
    item: {
      type: Object as PropType<IItem>,
      required: true
    }
  },
  setup: (props) => {
    const price = ref<IPrice>({
      currencyName: 'RUB',
      merchant: undefined,
      merchantLevel: undefined,
      requiresQuest: false,
      value: 0,
      valueInMainCurrency: 0
    })

    watch(() => props.item, () => initialize())
    onMounted(() => initialize())

    async function initialize() {
      const priceResult = await Services.get(InventoryItemService).getPrice({
        content: [],
        itemId: props.item.id,
        modSlots: [],
        quantity: 1
      })

      if (!priceResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, priceResult.failureMessage)

        return
      }

      price.value = priceResult.value.unitPrice
    }

    return { price }
  }
})