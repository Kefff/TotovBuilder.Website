import { defineComponent, onMounted, ref } from 'vue'
import { IMerchantFilter } from '../../models/utils/IMerchantFilter'
import vueI18n from '../../plugins/vueI18n'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import Services from '../../services/repository/Services'

export default defineComponent({
  props: {
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: () => {
    const merchantFilterService = Services.get(MerchantFilterService)
    const filters = ref<IMerchantFilter[]>([])
    const merchantLevelOptions = [1, 2, 3, 4]

    onMounted(() => initialize())

    /**
     * Initializes the merchants filter.
     */
    function initialize() {
      filters.value = merchantFilterService.get()
    }

    /**
     * Gets the tooltip for the checkbox of a merchant.
     * @param enabled - Indicates whether the merchant is enabled or not.
     * @returns checkbox Tooltip
     */
    function getCheckboxTooltip(enabled: boolean): string {
      return vueI18n.t('caption.' + (enabled ? 'enabled' : 'disabled'))
    }

    /**
     * Gets the level options for a merchant.
     * @param merchantName - Merchant name.
     * @returns Level options.
     */
    function getMerchantLevels(merchantName: string): number[] {
      const levels = merchantFilterService.getMerchantLevels(merchantName)

      return levels
    }

    /**
     * Indicates whether a merchant has levels.
     * @param merchantName - Merchant name.
     * @returns true when the merchant has levels; otherwise false.
     */
    function hasLevels(merchantName: string): boolean {
      const result = merchantFilterService.hasLevels(merchantName)

      return result
    }

    /**
     * Saves the filters.
     */
    function onFiltersChanged() {
      merchantFilterService.save(filters.value)
    }

    return {
      filters,
      getCheckboxTooltip,
      getMerchantLevels,
      hasLevels,
      merchantLevelOptions,
      onFiltersChanged
    }
  }
})