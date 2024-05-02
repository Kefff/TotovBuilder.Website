import { computed, defineComponent, PropType } from 'vue'
import { IWearable } from '../../../models/item/IWearable'
import { IWearableModifiers } from '../../../models/utils/IWearableModifiers'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IWearable>,
      required: true
    },
    wearableModifiersOverride: {
      type: Object as PropType<IWearableModifiers>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const ergonomicsPercentageModifier = computed(() => props.wearableModifiersOverride?.ergonomicsPercentageModifier ?? props.item.ergonomicsPercentageModifier)
    const movementSpeedPercentageModifier = computed(() => props.wearableModifiersOverride?.movementSpeedPercentageModifier ?? props.item.movementSpeedPercentageModifier)
    const turningSpeedPercentageModifier = computed(() => props.wearableModifiersOverride?.turningSpeedPercentageModifier ?? props.item.turningSpeedPercentageModifier)

    return {
      DisplayValueType,
      ergonomicsPercentageModifier,
      movementSpeedPercentageModifier,
      turningSpeedPercentageModifier,
      StatsUtils
    }
  }
})