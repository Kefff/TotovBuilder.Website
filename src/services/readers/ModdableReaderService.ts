import { IItem } from '../../models/item/IItem'
import { IModdable } from '../../models/item/IModdable'
import { BaseItemReaderService } from './BaseItemReaderService'

/**
 * Represents a reader that populates moddable properties from Tarkov item data.
 */
export class ModdableReaderService extends BaseItemReaderService<IModdable> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IModdable> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const moddable = await super.read(tarkovItem, categoryId, itemToPopulate)

    moddable.modSlots = []

    for (const slot of props['Slots'] as Record<string, unknown>[]) {
      const slotProps = slot['_props'] as Record<string, unknown>
      const slotFilters = slotProps['filters'] as Record<string, unknown>[]
      const modSlotCompatibleItemsIds: string[] = []

      for (const slotFilter of slotFilters) {
        modSlotCompatibleItemsIds.push(...slotFilter['Filter'] as string[])
      }

      moddable.modSlots.push({
        compatibleItemIds: modSlotCompatibleItemsIds,
        id: slot['_id'] as string,
        name: slot['_name'] as string,
        required: slot['_required'] as boolean
      })
    }

    return moddable
  }
}