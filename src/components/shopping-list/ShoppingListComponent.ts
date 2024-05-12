import { computed, defineComponent, PropType, ref } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IBuildSummaryShoppingMerchant } from '../../models/utils/IBuildSummaryMerchant'
import ItemIcon from '../item-icon/ItemIconComponent.vue'
import MerchantIcon from '../merchant-icon/MerchantIconComponent.vue'
import Price from '../price/PriceComponent.vue'
import ShoppingListMerchants from '../shopping-list-merchants/ShoppingListMerchantsComponent.vue'

export default defineComponent({
  components: {
    ItemIcon,
    MerchantIcon,
    ShoppingListMerchants,
    Price
  },
  props: {
    shoppingList: {
      type: Object as PropType<IShoppingListItem[]>,
      required: true
    },
    buttonStyle: {
      type: String as PropType<'full' | 'discreet'>,
      required: false,
      default: 'discreet'
    }
  },
  setup: (props) => {
    const requiredMerchants = computed(() => getRequiredMerchants())

    const visible = ref(false)

    /**
     * Closes shopping list.
     */
    function close() {
      visible.value = false
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
      visible.value = true
    }

    return {
      close,
      requiredMerchants,
      show,
      visible
    }
  }
})