import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import Services from '../repository/Services'
import { ArmorReaderService } from './ArmorReaderService'
import { BaseItemReaderService } from './BaseItemReaderService'
import { ModReaderService } from './ModReaderService'

/**
 * Represents a reader that populates armor mod properties from Tarkov item data.
 */
export class ArmorModReaderService extends BaseItemReaderService<IArmorMod> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IArmorMod> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const armorReaderService = Services.get(ArmorReaderService)
    const modReaderService = Services.get(ModReaderService)

    itemToPopulate = await armorReaderService.read(tarkovItem, categoryId, itemToPopulate)
    itemToPopulate = await modReaderService.read(tarkovItem, categoryId, itemToPopulate)
    const armorMod = itemToPopulate as IArmorMod

    armorMod.blindnessProtectionPercentage = Math.round(props['BlindnessProtection'] as number * 100) // Round to avoid floating point imprecision that generates long numbers

    return armorMod
  }
}