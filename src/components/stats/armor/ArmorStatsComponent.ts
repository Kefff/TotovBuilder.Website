import { computed, defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import StatsUtils from '../../../utils/StatsUtils'
import WearableStats from '../wearable/WearableStatsComponent.vue'
import { IWearableModifiers } from '../../../models/utils/IWearableModifiers'

export default defineComponent({
  components: {
    WearableStats
  },
  props: {
    item: {
      type: Object as PropType<IArmor>,
      required: true
    },
    wearableModifiersOverride: {
      type: Object as PropType<IWearableModifiers>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const hasRicochetChance = computed(() => props.item.ricochetChance !== '')

    return {
      hasRicochetChance,
      StatsUtils
    }
  }
})