import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IItem } from '../../../models/item/IItem'
import { IPrice } from '../../../models/item/IPrice'
import { InventoryItemService } from '../../../services/InventoryItemService'
import Services from '../../../services/repository/Services'
import ItemIcon from '../../ItemIconComponent.vue'
import Price from '../../PriceComponent.vue'

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
    const itemUnitPrice = ref<IPrice>()

    watch(() => props.item, () => initialize())

    onMounted(() => initialize())

    async function initialize() {
      const itemPrice = await Services.get(InventoryItemService).getPrice({
        content: [],
        ignorePrice: false,
        itemId: props.item.id,
        modSlots: [],
        quantity: 1
      })
      itemUnitPrice.value = itemPrice.unitPrice
    }

    return { itemUnitPrice }
  }
})