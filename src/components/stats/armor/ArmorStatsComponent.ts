import { defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IArmor>,
      required: true
    }
  },
  setup: () => {
    return { StatsUtils }
  }
})