import { defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'
import StatsUtils from '../../../utils/StatsUtils'
import WearableSummary from '../wearable/WearableSummaryComponent.vue'

export default defineComponent({
  components: {
    WearableSummary,
    ContainerSummary
  },
  props: {
    item: {
      type: Object as PropType<IHeadwear>,
      required: true
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