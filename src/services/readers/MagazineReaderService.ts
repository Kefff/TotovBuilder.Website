import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import Services from '../repository/Services'
import { BaseItemReaderService } from './BaseItemReaderService'
import { ContainerReaderService } from './ContainerReaderService'
import { ModReaderService } from './ModReaderService'

/**
 * Represents a reader that populates magazine properties from Tarkov item data.
 */
export class MagazineReaderService extends BaseItemReaderService<IMagazine> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IMagazine> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const modReaderService = Services.get(ModReaderService)
    const containerReaderService = Services.get(ContainerReaderService)

    itemToPopulate = await containerReaderService.read(tarkovItem, categoryId, itemToPopulate)
    itemToPopulate = await modReaderService.read(tarkovItem, categoryId, itemToPopulate)
    const magazine = itemToPopulate as IMagazine

    const cartridges = props['Cartridges'] as Record<string, unknown>[]

    for (const cartridge of cartridges) {
      magazine.capacity = cartridge['_max_count'] as number

      const cartridgeProps = cartridge['_props'] as Record<string, unknown>
      const filters = cartridgeProps['filters'] as Record<string, unknown>[]

      magazine.acceptedAmmunitionIds = []

      for (const filter of filters) {
        magazine.acceptedAmmunitionIds.push(...filter['Filter'] as string[])
      }
    }

    magazine.checkSpeedPercentageModifier = props['CheckTimeModifier'] as number
    magazine.loadSpeedPercentageModifier = props['LoadUnloadModifier'] as number

    return magazine
  }
}