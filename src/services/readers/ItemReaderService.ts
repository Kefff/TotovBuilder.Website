import { IItem } from '../../models/item/IItem'
import { BaseItemReaderService } from './BaseItemReaderService'

/**
 * Represents a reader that populates an item properties from Tarkov item data.
 */
export class ItemReaderService extends BaseItemReaderService<IItem> { }