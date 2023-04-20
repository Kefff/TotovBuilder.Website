import { computed, defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import ItemIcon from '../../item-icon/ItemIconComponent.vue'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import Price from '../../price/PriceComponent.vue'

export default defineComponent({
  components: {
    ArmorSummary,
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
  setup: (props) => {
    const hasRicochetChance = computed(() => props.item.ricochetChance !== '')

    return {
      hasRicochetChance
    }
  }
})