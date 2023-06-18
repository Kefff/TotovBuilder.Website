import { computed, defineComponent, PropType } from 'vue'
import { IMagazine } from '../../../models/item/IMagazine'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'
import StatsUtils from '../../../utils/StatsUtils'

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
      ergonomicsModifier,
      StatsUtils
    }
  }
})