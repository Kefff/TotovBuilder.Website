import { PropType, defineComponent, reactive } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { IItemExclusionFilter } from '../../models/utils/IItemExclusionFilter'
import StringUtils from '../../utils/StringUtils'

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<IGlobalFilter>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const itemExclusionFilters = reactive(props.modelValue.itemExclusionFilters)

    /**
     * Emits changes to the parent component.
     */
    function onFiltersChanged() {
      emit('update:modelValue', {
        itemExclusionFilters,
        merchantFilters: props.modelValue.merchantFilters
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