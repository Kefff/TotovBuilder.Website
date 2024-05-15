import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { MerchantItemsOptionsComponentService } from '../../services/components/MerchantItemsOptionsComponentService'
import Services from '../../services/repository/Services'
import ItemFilterComponent from '../item-filter/ItemFilterComponent.vue'
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'

export default defineComponent({
  components: {
    ItemFilterComponent,
    MerchantFilter
  },
  setup: () => {
    const merchantItemsOptionsComponentService = Services.get(MerchantItemsOptionsComponentService)
    const globalFilterService = Services.get(GlobalFilterService)

    const globalFilter = ref<IGlobalFilter>({
      itemExclusionFilters: [],
      merchantFilters: []
    })
    const hasChanged = ref(false)
    const visible = ref(false)

    onMounted(() => {
      merchantItemsOptionsComponentService.emitter.on(MerchantItemsOptionsComponentService.openMerchantItemsOptionsEvent, openMerchantItemsOptions)
    })

    onUnmounted(() => {
      merchantItemsOptionsComponentService.emitter.off(MerchantItemsOptionsComponentService.openMerchantItemsOptionsEvent, openMerchantItemsOptions)
    })

    /**
     * Opens the merchants and items options.
     */
    function openMerchantItemsOptions() {
      globalFilter.value = globalFilterService.get() // Getting back the really applied filter when he user did not hit the save button
      visible.value = true
    }

    /**
     * Saves the global filter and closes the side bar.
     */
    function save() {
      if (hasChanged.value) {
        hasChanged.value = false
        globalFilterService.save(globalFilter.value)
      }
    }

    return {
      globalFilter,
      hasChanged,
      save,
      visible
    }
  }
})