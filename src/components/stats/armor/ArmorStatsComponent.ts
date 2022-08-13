import { computed, defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IArmor>,
      required: true
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