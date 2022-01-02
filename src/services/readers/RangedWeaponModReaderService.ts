import { IItem } from '../../models/item/IItem'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import Services from '../repository/Services'
import { BaseItemReaderService } from './BaseItemReaderService'
import { ModReaderService } from './ModReaderService'

/**
 * Represents a reader that populates ranged weapon mod properties from Tarkov item data.
 */
export class RangedWeaponModReaderService extends BaseItemReaderService<IRangedWeaponMod> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IRangedWeaponMod> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const modReaderService = Services.get(ModReaderService)

    itemToPopulate = await modReaderService.read(tarkovItem, categoryId, itemToPopulate)
    const rangedWeaponMod = itemToPopulate as IRangedWeaponMod

    rangedWeaponMod.accuracyPercentageModifier = props['Accuracy'] as number
    rangedWeaponMod.recoilPercentageModifier = props['Recoil'] as number

    return rangedWeaponMod
  }
}