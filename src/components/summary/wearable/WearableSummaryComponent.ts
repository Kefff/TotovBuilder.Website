import { computed, defineComponent, PropType } from 'vue'
import StatsUtils from '../../../utils/StatsUtils'
import { IWearable } from '../../../models/item/IWearable'
import { IWearableModifiers } from '../../../models/utils/IWearableModifiers'

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
    const ergonomicsPercentageModifier = computed(() => props.wearableModifiersOverride?.ergonomicsPercentageModifierWithMods ?? props.item.ergonomicsPercentageModifier)
    const movementSpeedPercentageModifier = computed(() => props.wearableModifiersOverride?.ergonomicsPercentageModifierWithMods ?? props.item.ergonomicsPercentageModifier)
    const turningSpeedPercentageModifier = computed(() => props.wearableModifiersOverride?.ergonomicsPercentageModifierWithMods ?? props.item.ergonomicsPercentageModifier)

    return {
      ergonomicsPercentageModifier,
      movementSpeedPercentageModifier,
      turningSpeedPercentageModifier,
      StatsUtils
    }
  }
})