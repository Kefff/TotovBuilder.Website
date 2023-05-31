import { PropType, defineComponent, reactive } from 'vue'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import vueI18n from '../../plugins/vueI18n'
import { IItemExclusionFilter } from '../../models/utils/IItemExclusionFilter'

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
     * Gets the tooltip for the checkbox of a merchant.
     * @param enabled - Indicates whether the merchant is enabled or not.
     * @returns checkbox Tooltip
     */
    function getCheckboxTooltip(enabled: boolean): string {
      return vueI18n.t('caption.' + (enabled ? 'enabled' : 'disabled'))
    }

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
      getCheckboxTooltip,
      itemExclusionFilters,
      onFiltersChanged,
      toggleFilter
    }
  }
})