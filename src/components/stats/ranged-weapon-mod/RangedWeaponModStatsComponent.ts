import { computed, defineComponent, PropType } from 'vue'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IRangedWeaponMod>,
      required: true
    }
  },
  setup: (props) => {
    const ergonomicsModifier = computed(() => props.item.presetErgonomicsModifier ?? props.item.ergonomicsModifier)

    return {
      DisplayValueType,
      ergonomicsModifier,
      StatsUtils
    }
  }
})