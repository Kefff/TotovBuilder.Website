import { defineComponent, PropType } from 'vue'
import { IMod } from '../../../models/item/IMod'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IMod>,
      required: true
    }
  },
  setup: () => {
    return { StatsUtils }
  }
})