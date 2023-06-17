import { defineComponent, PropType } from 'vue'
import { IArmorMod } from '../../../models/item/IArmorMod'
import ArmorStats from '../armor/ArmorStatsComponent.vue'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  components: {
    ArmorStats
  },
  props: {
    item: {
      type: Object as PropType<IArmorMod>,
      required: true
    }
  },
  setup: () => {
    return {
      StatsUtils
    }
  }
})