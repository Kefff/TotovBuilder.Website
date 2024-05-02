import { computed, defineComponent, PropType } from 'vue'
import Images from '../../../images'
import { IAmmunition } from '../../../models/item/IAmmunition'
import Services from '../../../services/repository/Services'
import { TarkovValuesService } from '../../../services/TarkovValuesService'
import { ArmorUtils } from '../../../utils/ArmorUtils'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'
import StringUtils from '../../../utils/StringUtils'

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
      DisplayValueType,
      getArmorPenetrationTooltip,
      Images,
      StatsUtils,
      StringUtils
    }
  }
})