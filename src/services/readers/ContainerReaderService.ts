import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import { BaseItemReaderService } from './BaseItemReaderService'


/**
 * Represents a reader that populates container properties from Tarkov item data.
 */
export class ContainerReaderService extends BaseItemReaderService<IContainer> {
  /**
   * {@inheritDoc IItemReaderService.read}
   */
  public async read(tarkovItem: Record<string, unknown>, categoryId: string, itemToPopulate?: IItem): Promise<IContainer> {
    const props = tarkovItem['_props'] as Record<string, unknown>
    const container = await super.read(tarkovItem, categoryId, itemToPopulate)

    container.capacity = 0

    for (const grid of props['Grids'] as Record<string, unknown>[]) {
      const gridProps = grid['_props'] as Record<string, unknown>
      container.capacity += (gridProps['cellsH'] as number) * (gridProps['cellsV'] as number)
    }

    return container
  }
}