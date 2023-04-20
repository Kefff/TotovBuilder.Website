import { computed, defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IArmor>,
      required: true
    },
    forcedErgonomicsPercentageModifier: {
      type: Number,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const ergonomicsPercentageModifier = computed(() => props.forcedErgonomicsPercentageModifier ?? props.item.ergonomicsPercentageModifier)
    const hasRicochetChance = computed(() => props.item.ricochetChance !== '')

    return {
      ergonomicsPercentageModifier,
      hasRicochetChance,
      StatsUtils
    }
  }
})