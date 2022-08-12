import { defineComponent, PropType } from 'vue'
import { IGrenade } from '../../../models/item/IGrenade'
import AmmunitionStats from '../ammunition/AmmunitionStatsComponent.vue'

export default defineComponent({
  components: {
    AmmunitionStats
  },
  props: {
    item: {
      type: Object as PropType<IGrenade>,
      required: true
    }
  }
})