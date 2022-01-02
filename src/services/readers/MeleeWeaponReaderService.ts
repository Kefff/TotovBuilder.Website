import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import { BaseItemReaderService } from './BaseItemReaderService'

/**
 * Represents a reader that populates melee weapon properties from Tarkov item data.
 */
export class MeleeWeaponReaderService extends BaseItemReaderService<IMeleeWeapon> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IMeleeWeapon> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const meleeWeapon = await super.read(tarkovItem, categoryId, itemToPopulate)

    meleeWeapon.chopDamage = props['knifeHitSlashDam'] as number
    meleeWeapon.hitRadius = props['knifeHitRadius'] as number
    meleeWeapon.stabDamage = props['knifeHitStabDam'] as number

    return meleeWeapon
  }
}