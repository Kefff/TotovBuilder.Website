import { computed, defineComponent, PropType, ref } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import ItemIcon from '../item-icon/ItemIconComponent.vue'
import MerchantIcon from '../merchant-icon/MerchantIconComponent.vue'
import Price from '../price/PriceComponent.vue'
import { IBuildSummaryShoppingMerchant } from '../../models/utils/IBuildSummaryMerchant'

export default defineComponent({
  components: {
    ItemIcon,
    MerchantIcon,
    Price
  },
  props: {
    shoppingList: {
      type: Object as PropType<IShoppingListItem[]>,
      required: true
    }
  },
  setup: (props) => {
    const requiredMerchants = computed(() => getRequiredMerchants())

    const open = ref(false)

    /**
     * Closes shopping list.
     */
    function close() {
      open.value = false
    }

    /**
     * Gets the required merchants.
     */
    function getRequiredMerchants(): IBuildSummaryShoppingMerchant[] {
      const merchants: IBuildSummaryShoppingMerchant[] = []

      for (const item of props.shoppingList) {
        const merchant = merchants.find(m => m.name === item.price.merchant)

        if (merchant == null) {
          merchants.push({
            name: item.price.merchant,
            level: item.price.merchantLevel
          })
        } else {
          if (merchant.level < item.price.merchantLevel) {
            merchant.level = item.price.merchantLevel
          }
        }
      }

      return merchants
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
      requiredMerchants,
      show
    }
  }
})