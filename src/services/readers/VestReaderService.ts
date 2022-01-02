import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import Services from '../repository/Services'
import { ArmorReaderService } from './ArmorReaderService'
import { BaseItemReaderService } from './BaseItemReaderService'
import { ContainerReaderService } from './ContainerReaderService'

/**
 * Represents a reader that populates mod properties from Tarkov item data.
 */
export class VestReaderService extends BaseItemReaderService<IVest> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IVest> {
    const armorReaderService = Services.get(ArmorReaderService)
    const containerReaderService = Services.get(ContainerReaderService)

    itemToPopulate = await armorReaderService.read(tarkovItem, categoryId, itemToPopulate)
    itemToPopulate = await containerReaderService.read(tarkovItem, categoryId, itemToPopulate)

    return itemToPopulate as IVest
  }
}