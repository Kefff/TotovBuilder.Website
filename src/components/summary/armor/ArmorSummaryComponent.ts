import { defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import StatsUtils from '../../../utils/StatsUtils'
import WearableSummary from '../wearable/WearableSummaryComponent.vue'
import { IWearableModifiers } from '../../../models/utils/IWearableModifiers'

export default defineComponent({
  components: {
    WearableSummary
  }, props: {
    item: {
      type: Object as PropType<IArmor>,
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
  setup: () => {
    return {
      StatsUtils
    }
  }
})