import { defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import ArmorStats from '../armor/ArmorStatsComponent.vue'
import ItemStats from '../item/ItemStatsComponent.vue'

export default defineComponent({
  components: {
    ArmorStats,
    ItemStats
  },
  props: {
    item: {
      type: Object as PropType<IHeadwear>,
      required: true
    }
  }
})