import { IHeadwear } from '../../models/item/IHeadwear'
import Services from '../repository/Services'
import { ArmorReaderService } from './ArmorReaderService'
import { ModdableReaderService } from './ModdableReaderService'
import { IItem } from '../../models/item/IItem'
import { BaseItemReaderService } from './BaseItemReaderService'

/**
 * Represents a reader that populates headwear properties from Tarkov item data.
 */
export class HeadwearReaderService extends BaseItemReaderService<IHeadwear> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IHeadwear> {
    const armorReaderService = Services.get(ArmorReaderService)
    const moddableReaderService = Services.get(ModdableReaderService)

    itemToPopulate = await armorReaderService.read(tarkovItem, categoryId, itemToPopulate)
    itemToPopulate = await moddableReaderService.read(tarkovItem, categoryId, itemToPopulate)

    return itemToPopulate as IHeadwear
  }
}