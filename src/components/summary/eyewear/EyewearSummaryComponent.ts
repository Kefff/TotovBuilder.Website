import { computed, defineComponent, PropType } from 'vue'
import { IEyewear } from '../../../models/item/IEyewear'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IEyewear>,
      required: true
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const hasBlindnessProtectionPercentage = computed(() => props.item.blindnessProtectionPercentage !== 0)

    return {
      hasBlindnessProtectionPercentage,
      StatsUtils
    }
  }
})