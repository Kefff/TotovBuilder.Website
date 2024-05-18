import { PropType, computed, defineComponent } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import Services from '../../services/repository/Services'
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
    parameters: {
      type: Array as PropType<IShoppingListItem[]>,
      required: true
    }
  },
  setup: (props) => {
    const buildPropertiesService = Services.get(BuildPropertiesService)

    const requiredMerchants = computed(() => buildPropertiesService.getShoppingListMerchants(props.parameters))

    return {
      requiredMerchants
    }
  }
})