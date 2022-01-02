import { IGrenade } from '../../models/item/IGrenade'
import { IItem } from '../../models/item/IItem'
import { BaseItemReaderService } from './BaseItemReaderService'


/**
 * Represents a reader that populates grenade properties from Tarkov item data.
 */
export class GrenadeReaderService extends BaseItemReaderService<IGrenade> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IGrenade> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const grenade = await super.read(tarkovItem, categoryId, itemToPopulate)

    grenade.explosionDelay = props['explDelay'] as number
    grenade.fragmentAmmunitionId = props['FragmentType'] as string
    grenade.fragmentsAmount = props['FragmentsCount'] as number
    grenade.maximumExplosionRange = props['MaxExplosionDistance'] as number

    if (grenade.maximumExplosionRange === 0) {
      grenade.maximumExplosionRange = props['ContusionDistance'] as number // For non lethal grenades
    }

    grenade.minimumExplosionRange = props['MinExplosionDistance'] as number

    if (grenade.minimumExplosionRange === 0) {
      grenade.minimumExplosionRange = props['ContusionDistance'] as number // For non lethal grenades
    }

    return grenade
  }
}