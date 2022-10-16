import { computed, defineComponent, PropType } from 'vue'
import { IAmmunition } from '../../../models/item/IAmmunition'
import StatsUtils from '../../../utils/StatsUtils'
import { ArmorUtils } from '../../../utils/ArmorUtils'
import Services from '../../../services/repository/Services'
import { TarkovValuesService } from '../../../services/TarkovValuesService'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IAmmunition>,
      required: true
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  setup: (props) => {
    const canOneshot = computed(() => props.item.fleshDamage >= Services.get(TarkovValuesService).values.chestHp)
    const hasAccuracyPercentageModifier = computed(() => props.item.accuracyPercentageModifier !== 0)
    const hasArmorPenetration = computed(() => props.item.armorPenetrations.length > 0)
    const hasFragmentationChance = computed(() => props.item.fragmentationChancePercentage !== 0)
    const hasRecoilPercentageModifier = computed(() => props.item.recoilPercentageModifier !== 0)

    /**
     * Gets the tooltip for an armor penetration.
     * @param armorClass - Armor class penetrated.
     * @param penetration - Penetration value.
     * @returns Tooltip.
     */
    function getArmorPenetrationTooltip(armorClass: number, penetration: number) {
      return ArmorUtils.getArmorPenetrationTooltip(armorClass, penetration)
    }

    return {
      canOneshot,
      getArmorPenetrationTooltip,
      hasAccuracyPercentageModifier,
      hasArmorPenetration,
      hasFragmentationChance,
      hasRecoilPercentageModifier,
      StatsUtils
    }
  }
})