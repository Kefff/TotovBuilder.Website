import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import Services from '../repository/Services'
import { BaseItemReaderService } from './BaseItemReaderService'
import { ModdableReaderService } from './ModdableReaderService'

/**
 * Represents a reader that populates mod properties from Tarkov item data.
 */
export class ModReaderService extends BaseItemReaderService<IMod> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IMod> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const moddableReaderService = Services.get(ModdableReaderService)

    itemToPopulate = await moddableReaderService.read(tarkovItem, categoryId, itemToPopulate)
    const mod = itemToPopulate as IMod

    mod.ergonomicsModifier = props['Ergonomics'] as number ?? 0

    return mod
  }
}