import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IBuildSummaryShoppingMerchant } from '../../models/utils/IBuildSummaryMerchant'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { ShoppingListComponentService } from '../../services/components/ShoppingListComponentService'
import Services from '../../services/repository/Services'
import ItemIcon from '../item-icon/ItemIconComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import MerchantIcon from '../merchant-icon/MerchantIconComponent.vue'
import Price from '../price/PriceComponent.vue'
import ShoppingListMerchants from '../shopping-list-merchants/ShoppingListMerchantsComponent.vue'

export default defineComponent({
  components: {
    ItemIcon,
    Loading,
    MerchantIcon,
    ShoppingListMerchants,
    Price
  },
  setup: () => {
    const buildPropertiesService = Services.get(BuildPropertiesService)
    const shoppingListComponentService = Services.get(ShoppingListComponentService)

    const loading = ref(true)
    const requiredMerchants = ref<IBuildSummaryShoppingMerchant[]>([])
    const shoppingList = ref<IShoppingListItem[]>([])
    const visible = ref(false)

    onMounted(() => {
      shoppingListComponentService.emitter.on(ShoppingListComponentService.openShoppingListEvent, onOpenShoppingList)
    })

    onUnmounted(() => {
      shoppingListComponentService.emitter.off(ShoppingListComponentService.openShoppingListEvent, onOpenShoppingList)
    })

    /**
     * Opens the shopping list.
     * @param shoppingListToDisplay - Shopping to display.
     */
    function onOpenShoppingList(shoppingListToDisplay: IShoppingListItem[]) {
      loading.value = true
      visible.value = true

      shoppingList.value = shoppingListToDisplay
      requiredMerchants.value = buildPropertiesService.getShoppingListMerchants(shoppingList.value)

      loading.value = false
    }

    return {
      loading,
      requiredMerchants,
      shoppingList,
      visible
    }
  }
})