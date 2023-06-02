import { computed, defineComponent, PropType } from 'vue'
import { IMagazine } from '../../../models/item/IMagazine'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'
import StatsUtils from '../../../utils/StatsUtils'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ContainerSummary,
    ItemIcon,
    Price
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