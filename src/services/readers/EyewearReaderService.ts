import { IEyewear } from '../../models/item/IEyewear'
import { IItem } from '../../models/item/IItem'
import { BaseItemReaderService } from './BaseItemReaderService'

/**
 * Represents a reader that populates eyewear properties from Tarkov item data.
 */
export class EyewearReaderService extends BaseItemReaderService<IEyewear> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IEyewear> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const eyewear = await super.read(tarkovItem, categoryId, itemToPopulate)

    eyewear.blindnessProtectionPercentage = Math.round(props['BlindnessProtection'] as number * 100) // Round to avoid floating point imprecision that generates long numbers

    return eyewear
  }
}