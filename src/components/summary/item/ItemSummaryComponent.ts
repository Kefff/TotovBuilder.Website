import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { IPrice } from '../../../models/item/IPrice'
import { InventoryItemService } from '../../../services/InventoryItemService'
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
      barterItems: [],
      currencyName: 'RUB',
      itemId: '',
      merchant: '',
      merchantLevel: 0,
      quest: null,
      value: 0,
      valueInMainCurrency: 0
    })

    watch(() => props.item, () => initialize())
    onMounted(() => initialize())

    async function initialize() {
      const priceResult = await Services.get(InventoryItemService).getPrice({
        content: [],
        ignorePrice: false,
        itemId: props.item.id,
        modSlots: [],
        quantity: 1
      })

      if (priceResult.success) {
        price.value = priceResult.value.unitPrice
      } else {
        price.value = {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        }
      }
    }

    return { price }
  }
})