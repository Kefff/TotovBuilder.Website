import { defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'
import StatsUtils from '../../../utils/StatsUtils'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ArmorSummary,
    ContainerSummary,
    ItemIcon,
    Price
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