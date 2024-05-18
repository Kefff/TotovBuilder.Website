import { PropType, computed, defineComponent } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { IItemExclusionFilter } from '../../models/utils/IItemExclusionFilter'
import StringUtils from '../../utils/StringUtils'

export default defineComponent({
  props: {
    globalFilter: {
      type: Object as PropType<IGlobalFilter>,
      required: true
    }
  },
  emits: ['update:global-filter'],
  setup: (props, { emit }) => {
    const itemExclusionFilters = computed(() => props.globalFilter.itemExclusionFilters)

    /**
     * Emits changes to the parent component.
     */
    function onFiltersChanged() {
      emit('update:global-filter', {
        itemExclusionFilters: itemExclusionFilters.value,
        merchantFilters: props.globalFilter.merchantFilters
      } as IGlobalFilter)
    }

    /**
     * Toggles a filter.
     * @param filter - Filter.
     */
    function toggleFilter(filter: IItemExclusionFilter) {
      filter.enabled = !filter.enabled
      onFiltersChanged()
    }

    return {
      itemExclusionFilters,
      onFiltersChanged,
      StringUtils,
      toggleFilter
    }
  }
})