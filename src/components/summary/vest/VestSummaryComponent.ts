import { defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import { IArmorModifiers } from '../../../models/utils/IArmorModifiers'
import StatsUtils from '../../../utils/StatsUtils'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'

export default defineComponent({
  components: {
    ArmorSummary,
    ContainerSummary
  },
  props: {
    armorModifiersOverride: {
      type: Object as PropType<IArmorModifiers>,
      required: false,
      default: undefined
    },
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