import { defineComponent, PropType, ref } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
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
  setup: () => {
    const open = ref(false)

    /**
     * Closes shopping list.
     */
    function close() {
      open.value = false
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
      show
    }
  }
})