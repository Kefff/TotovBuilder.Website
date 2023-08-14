import { defineComponent, ref } from 'vue'
import ItemFilterComponent from '../item-filter/ItemFilterComponent.vue'
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'
import Services from '../../services/repository/Services'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'

export default defineComponent({
  components: {
    ItemFilterComponent,
    MerchantFilter
  },
  emits: ['update:visible'],
  setup: () => {
    const globalFilterService = Services.get(GlobalFilterService)

    const globalFilter = ref<IGlobalFilter>({
      itemExclusionFilters: [],
      merchantFilters: []
    })
    const sidebarVisible = ref(false)

    /**
     * Displays the side bar.
     */
    function display() {
      globalFilter.value = globalFilterService.get() // Getting back the really applied filter when he user did not hit the save button
      sidebarVisible.value = true
    }

    /**
     * Saves the global filter and closes the side bar.
     */
    function save() {
      globalFilterService.save(globalFilter.value)
    }

    return {
      display,
      globalFilter,
      save,
      sidebarVisible
    }
  }
})