import { defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import ArmorStats from '../ArmorStatsComponent.vue'

export default defineComponent({
  components: {
    ArmorStats
  },
  props: {
    item: {
      type: Object as PropType<IHeadwear>,
      required: true
    }
  }
})