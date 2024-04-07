import { IInventoryItem } from '../models/build/IInventoryItem'
import { IArmorMod } from '../models/item/IArmorMod'
import { IArmorPlateModifiers } from '../models/utils/IArmorPlateModifiers'
import vueI18n from '../plugins/vueI18n'
import { ItemService } from '../services/ItemService'
import Services from '../services/repository/Services'
import { TarkovValuesService } from '../services/TarkovValuesService'
import Result from './Result'

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
    const tooltip = vueI18n.t('caption.armorClassPenetration', { class: armorClass }) + ' : ' + vueI18n.t('caption.armorClassPenetrationValue', { penetration, efficiency: efficiency })

    return tooltip
  }

  /**
   * Gets the armor class of the front ballistic plate of the inventory item.
   * @param inventoryItem - Inventory item.
   * @returns Front plate armor class.
   */
  public static async getFrontPlateArmorClass(inventoryItem: IInventoryItem): Promise<Result<IArmorPlateModifiers>> {
    for (const modSlot of inventoryItem.modSlots) {
      if (modSlot.modSlotName === 'front_plate') {
        if (modSlot.item != null) {
          const frontPlateResult = await Services.get(ItemService).getItem(modSlot.item.itemId)

          if (!frontPlateResult.success) {
            return Result.failFrom(frontPlateResult)
          }

          const frontPlate = frontPlateResult.value as IArmorMod

          return Result.ok({
            armorClass: frontPlate.armorClass,
            durability: frontPlate.durability
          })
        }

        break
      }
    }

    return Result.ok({
      armorClass: 0,
      durability: 0
    })
  }
}