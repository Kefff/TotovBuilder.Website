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
    const hasLoadSpeedPercentageModifier = computed(() => props.item.loadSpeedPercentageModifier !== 0)
    const hasCheckSpeedPercentageModifier = computed(() => props.item.checkSpeedPercentageModifier !== 0)
    const hasErgonomicsModifier = computed(() => props.item.ergonomicsModifier !== 0)

    return {
      hasCheckSpeedPercentageModifier,
      hasErgonomicsModifier,
      hasLoadSpeedPercentageModifier,
      StatsUtils
    }
  }
})