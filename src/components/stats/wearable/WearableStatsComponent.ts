import { computed, defineComponent, PropType } from 'vue'
import StatsUtils from '../../../utils/StatsUtils'
import { IWearable } from '../../../models/item/IWearable'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IWearable>,
      required: true
    },
    customErgonomicsPercentageModifier: {
      type: Number,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const ergonomicsPercentageModifier = computed(() => props.customErgonomicsPercentageModifier ?? props.item.ergonomicsPercentageModifier)

    return {
      ergonomicsPercentageModifier,
      StatsUtils
    }
  }
})