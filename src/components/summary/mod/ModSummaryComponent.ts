import { computed, defineComponent, PropType } from 'vue'
import { IMod } from '../../../models/item/IMod'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'

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
    const ergonomicsModifier = computed(() => props.item.presetErgonomicsModifier ?? props.item.ergonomicsModifier)

    return {
      DisplayValueType,
      ergonomicsModifier,
      StatsUtils
    }
  }
})