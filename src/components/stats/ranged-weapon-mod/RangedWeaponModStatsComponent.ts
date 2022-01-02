import { defineComponent, PropType } from 'vue'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IRangedWeaponMod>,
      required: true
    }
  },
  setup: () => {
    return { StatsUtils }
  }
})