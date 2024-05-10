import { PropType, defineComponent, reactive } from 'vue'
import Images from '../../images'
import { IGlobalFilter } from '../../models/utils/IGlobalFilter'
import { IMerchantFilter } from '../../models/utils/IMerchantFilter'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import Services from '../../services/repository/Services'
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
    const globalFilterService = Services.get(GlobalFilterService)
    const merchantLevelOptions = [1, 2, 3, 4]

    const merchantFilters = reactive(props.globalFilter.merchantFilters).sort((m1, m2) => StringUtils.compare(m1.merchant, m2.merchant))

    /**
     * Gets the level options for a merchant.
     * @param merchantName - Merchant name.
     * @returns Level options.
     */
    function getMerchantLevels(merchantName: string): number[] {
      const levels = globalFilterService.getMerchantLevels(merchantName)

      return levels
    }

    /**
     * Indicates whether a merchant has levels.
     * @param merchantName - Merchant name.
     * @returns true when the merchant has levels; otherwise false.
     */
    function hasLevels(merchantName: string): boolean {
      const result = globalFilterService.hasLevels(merchantName)

      return result
    }

    /**
     * Emits changes to the parent component.
     */
    function onFiltersChanged() {
      emit('update:global-filter', {
        itemExclusionFilters: props.globalFilter.itemExclusionFilters,
        merchantFilters
      } as IGlobalFilter)
    }

    /**
     * Toggles a filter.
     * @param filter - Filter.
     */
    function toggleFilter(filter: IMerchantFilter) {
      filter.enabled = !filter.enabled
      onFiltersChanged()
    }

    return {
      getMerchantLevels,
      hasLevels,
      Images,
      merchantFilters,
      merchantLevelOptions,
      onFiltersChanged,
      StringUtils,
      toggleFilter
    }
  }
})