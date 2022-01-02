import ArmorPenetrationEffectivenesses from '../assets/data/armor-penetration-effectivenesses.json'
import i18n from '../plugins/vueI18n'

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
    const effectiveness = ArmorPenetrationEffectivenesses[penetration]
    const tooltip = i18n.t('caption.armorClassPenetration', { class: armorClass }) + ' : ' + i18n.t('caption.armorClassPenetrationValue', { penetration,  effectiveness })

    return tooltip
  }
}