import { computed, defineComponent, PropType } from 'vue'
import { IAmmunition } from '../../../models/item/IAmmunition'
import StatsUtils from '../../../utils/StatsUtils'
import StringUtils from '../../../utils/StringUtils'
import { ArmorUtils } from '../../../utils/ArmorUtils'
import Services from '../../../services/repository/Services'
import { TarkovValuesService } from '../../../services/TarkovValuesService'
import Images from '../../../images'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IAmmunition>,
      required: true
    }
  },
  setup: (props) => {
    const canOneshot = computed(() => props.item.fleshDamage >= Services.get(TarkovValuesService).values.chestHp)

    /**
     * Gets the tooltip for an armor penetration.
     * @param armorClass - Armor class penetrated.
     * @param penetration - Penetration value.
     * @returns Tooltip.
     */
    function getArmorPenetrationTooltip(armorClass: number, penetration: number): string {
      return ArmorUtils.getArmorPenetrationTooltip(armorClass, penetration)
    }

    return {
      canOneshot,
      getArmorPenetrationTooltip,
      Images,
      StatsUtils,
      StringUtils
    }
  }
})