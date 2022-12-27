import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IPrice } from '../../models/item/IPrice'
import ItemIcon from '../item-icon/ItemIconComponent.vue'
import Price from '../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ItemIcon,
    Price
  },
  props: {
    shoppingList: {
      type: Object as PropType<IShoppingListItem[]>,
      required: true
    }
  },
  setup: (props) => {
    const prices = ref<IPrice[]>([])
    const open = ref(false)

    onMounted(() => {
      getPricesWithQuantity()
    })

    watch(() => props.shoppingList, () => getPricesWithQuantity())

    /**
     * Closes shopping list.
     */
    function close() {
      open.value = false
    }

    function getPricesWithQuantity() {
      for (const shoppingListItem of props.shoppingList) {
        prices.value.push({
          barterItems: shoppingListItem.unitPrice.barterItems,
          currencyName: shoppingListItem.unitPrice.currencyName,
          itemId: shoppingListItem.unitPrice.itemId,
          merchant: shoppingListItem.unitPrice.merchant,
          merchantLevel: shoppingListItem.unitPrice.merchantLevel,
          quest: shoppingListItem.unitPrice.quest,
          value: shoppingListItem.unitPrice.value * shoppingListItem.quantity,
          valueInMainCurrency: shoppingListItem.unitPrice.valueInMainCurrency * shoppingListItem.quantity
        })
      }
    }

    /**
     * Displays the shopping list.
     */
    function show() {
      open.value = true
    }

    return {
      close,
      open,
      prices,
      show
    }
  }
})