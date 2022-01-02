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
    const hasAccuracyPercentageModifier = computed(() => props.item.accuracyPercentageModifier !== 0)
    const hasErgonomicsModifier = computed(() => props.item.ergonomicsModifier !== 0)
    const hasRecoilPercentageModifier = computed(() => props.item.recoilPercentageModifier !== 0)

    return {
      hasAccuracyPercentageModifier,
      hasErgonomicsModifier,
      hasRecoilPercentageModifier,
      StatsUtils
    }
  }
})