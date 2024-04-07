import { defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import { IArmorPlateModifiers } from '../../../models/utils/IArmorPlateModifiers'
import StatsUtils from '../../../utils/StatsUtils'
import ArmorSummary from '../armor/ArmorSummaryComponent.vue'
import ContainerSummary from '../container/ContainerSummaryComponent.vue'

export default defineComponent({
  components: {
    ArmorSummary,
    ContainerSummary
  },
  props: {
    armorPlateModifiersOverride: {
      type: Object as PropType<IArmorPlateModifiers>,
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