import { defineComponent, PropType } from 'vue'
import { IEyewear } from '../../../models/item/IEyewear'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IEyewear>,
      required: true
    }
  },
  setup: () => {
    return { StatsUtils }
  }
})