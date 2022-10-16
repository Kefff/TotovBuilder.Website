import i18n from '../plugins/vueI18n'
import Services from '../services/repository/Services'
import { TarkovValuesService } from '../services/TarkovValuesService'

/**
 * Represents an utility class for manipulating armor properties.
 */
export class ArmorUtils {
  /**
   * Gets the tooltip for an armor penetration.
   * @param armorClass - Armor class penetrated.
   * @param penetration - Penetration value.
   * @returns Tooltip.
   */
  public static getArmorPenetrationTooltip(armorClass: number, penetration: number): string {
    const efficiency = Services.get(TarkovValuesService).values.armorPenetrationEfficiencies[penetration]
    const tooltip = i18n.t('caption.armorClassPenetration', { class: armorClass }) + ' : ' + i18n.t('caption.armorClassPenetrationValue', { penetration, efficiency: efficiency })

    return tooltip
  }
}