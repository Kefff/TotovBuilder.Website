import { computed, defineComponent, ref, watch } from 'vue'
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
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible'],
  setup: (props, { emit }) => {
    const globalFilterService = Services.get(GlobalFilterService)

    const sidebarVisible = computed<boolean>({
      get: () => props.visible,
      set: (value: boolean) => emit('update:visible', value)
    })

    const globalFilter = ref<IGlobalFilter>({
      itemExclusionFilters: [],
      merchantFilters: []
    })
    const hasChanged = ref(false)

    watch(
      () => props.visible,
      (newValue: boolean) => {
        if (newValue) {
          initialize()
        }
      })

    /**
     * Initializes the component.
     */
    function initialize() {
      hasChanged.value = false
      globalFilter.value = globalFilterService.get()
    }

    /**
     * Saves the global filter and closes the side bar.
     */
    function save() {
      sidebarVisible.value = false
      hasChanged.value = false
      globalFilterService.save(globalFilter.value)
    }

    return {
      globalFilter,
      hasChanged,
      save,
      sidebarVisible
    }
  }
})