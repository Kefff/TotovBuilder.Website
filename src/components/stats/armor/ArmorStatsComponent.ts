import { computed, defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import StatsUtils from '../../../utils/StatsUtils'
import WearableStats from '../wearable/WearableStatsComponent.vue'

export default defineComponent({
  components: {
    WearableStats
  },
  props: {
    item: {
      type: Object as PropType<IArmor>,
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
    const hasRicochetChance = computed(() => props.item.ricochetChance !== '')

    return {
      ergonomicsPercentageModifier,
      hasRicochetChance,
      StatsUtils
    }
  }
})