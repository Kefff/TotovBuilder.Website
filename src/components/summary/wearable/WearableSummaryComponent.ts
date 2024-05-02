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
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const ergonomicsModifierPercentage = computed(() => props.wearableModifiersOverride?.ergonomicsModifierPercentage ?? props.item.ergonomicsModifierPercentage)
    const movementSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.movementSpeedModifierPercentage ?? props.item.movementSpeedModifierPercentage)
    const turningSpeedModifierPercentage = computed(() => props.wearableModifiersOverride?.turningSpeedModifierPercentage ?? props.item.turningSpeedModifierPercentage)

    return {
      DisplayValueType,
      ergonomicsModifierPercentage,
      movementSpeedModifierPercentage,
      turningSpeedModifierPercentage,
      StatsUtils
    }
  }
})