import { computed, defineComponent, PropType } from 'vue'
import { IAmmunition } from '../../../models/item/IAmmunition'
import StatsUtils from '../../../utils/StatsUtils'
import StringUtils from '../../../utils/StringUtils'
import { ArmorUtils } from '../../../utils/ArmorUtils'
import * as TarkovValues from '../../../assets/data/tarkov-values.json'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IAmmunition>,
      required: true
    },
    ofGrenade: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup: (props) => {
    const canOneshot = computed(() => props.item.fleshDamage >= TarkovValues.chestHp)

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
      StatsUtils,
      StringUtils
    }
  }
})