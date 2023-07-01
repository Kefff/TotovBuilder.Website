import { PropType, computed, defineComponent } from 'vue'
import { IBuildSummaryShoppingMerchant } from '../../models/utils/IBuildSummaryMerchant'
import MerchantIcon from '../merchant-icon/MerchantIconComponent.vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'

export default defineComponent({
  components: {
    MerchantIcon
  },
  props: {
    shoppingList: {
      type: Object as PropType<IShoppingListItem[]>,
      required: true
    }
  },
  setup: (props) => {
    const requiredMerchants = computed(() => getRequiredMerchants())

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

    return {
      requiredMerchants
    }
  }
})