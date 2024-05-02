import { computed, defineComponent, PropType } from 'vue'
import { IMagazine } from '../../../models/item/IMagazine'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'

export default defineComponent({
  components: {
    ContainerSummary
  },
  props: {
    item: {
      type: Object as PropType<IMagazine>,
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