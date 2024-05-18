import { defineComponent, onMounted, ref } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarComponentService } from '../../services/components/GlobalSidebarComponentService'
import Services from '../../services/repository/Services'
import ItemFilterComponent from '../item-filter/ItemFilterComponent.vue'
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'

export default defineComponent({
  components: {
    ItemFilterComponent,
    MerchantFilter
  },
  props: {
    parameters: {
      type: undefined,
      required: false,
      default: undefined
    }
  },
  setup: () => {
    const globalSidebarComponentService = Services.get(GlobalSidebarComponentService)
    globalSidebarComponentService.registerOnClosingAction(save)

    const globalFilterService = Services.get(GlobalFilterService)

    const globalFilter = ref<IGlobalFilter>({
      itemExclusionFilters: [],
      merchantFilters: []
    })
    const hasChanged = ref(false)

    onMounted(() => {
      globalFilter.value = globalFilterService.get()
    })

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
      save
    }
  }
})