import { computed, defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import Images from '../../../images'

export default defineComponent({
  components: {
    ArmorSummary
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
      hasRicochetChance,
      Images
    }
  }
})