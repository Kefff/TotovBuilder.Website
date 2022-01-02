import { IItem } from '../../models/item/IItem'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import Services from '../repository/Services'
import { BaseItemReaderService } from './BaseItemReaderService'
import { ModdableReaderService } from './ModdableReaderService'

/**
 * Represents a reader that populates ranged weapon properties from Tarkov item data.
 */
export class RangedWeaponReaderService extends BaseItemReaderService<IRangedWeapon> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IRangedWeapon> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const moddableReaderService = Services.get(ModdableReaderService)

    itemToPopulate = await moddableReaderService.read(tarkovItem, categoryId, itemToPopulate)
    const rangedWeapon = itemToPopulate as IRangedWeapon

    rangedWeapon.caliber = props['ammoCaliber'] as string
    rangedWeapon.ergonomics = props['Ergonomics'] as number
    rangedWeapon.fireRate = props['bFirerate'] as number
    rangedWeapon.horizontalRecoil = props['RecoilForceBack'] as number
    rangedWeapon.verticalRecoil = props['RecoilForceUp'] as number

    const chambers = props['Chambers'] as Record<string, unknown>[]
    const chamberAcceptedAmmunitionIds: string[] = []

    if (chambers.length > 0) {
      const chamberProps = chambers[0]['_props'] as Record<string, unknown>
      const chamberFilters = chamberProps['filters'] as Record<string, unknown>[]

      for (const chamberFilter of chamberFilters) {
        chamberAcceptedAmmunitionIds.push(...chamberFilter['Filter'] as string[])
      }

      for (let i = chambers.length - 1; i >= 0; i--) {
        const chamber = chambers[i]
        rangedWeapon.modSlots.unshift({
          compatibleItemIds: chamberAcceptedAmmunitionIds,
          id: chamber['_id'] as string,
          maxStackableAmount: 1,
          name: 'chamber' + i,
          required: false
        })
      }
    }

    return rangedWeapon
  }
}