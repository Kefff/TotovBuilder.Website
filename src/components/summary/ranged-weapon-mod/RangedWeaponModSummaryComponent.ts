import { computed, defineComponent, PropType } from 'vue'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IRangedWeaponMod>,
      required: true
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const ergonomicsModifier = computed(() => props.item.presetErgonomicsModifier ?? props.item.ergonomicsModifier)

    return {
      ergonomicsModifier,
      StatsUtils
    }
  }
})