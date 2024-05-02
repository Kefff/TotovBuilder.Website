import { defineComponent, PropType } from 'vue'
import { IArmorMod } from '../../../models/item/IArmorMod'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'
import ArmorStats from '../armor/ArmorStatsComponent.vue'

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
      DisplayValueType,
      StatsUtils
    }
  }
})