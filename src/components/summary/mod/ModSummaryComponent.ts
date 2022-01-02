import { computed, defineComponent, PropType } from 'vue'
import { IMod } from '../../../models/item/IMod'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IMod>,
      required: true
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const hasErgonomicsModifier = computed(() => props.item.ergonomicsModifier !== 0)

    return {
      hasErgonomicsModifier,
      StatsUtils
    }
  }
})