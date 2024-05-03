import { IItem } from '../../models/item/IItem'

/**
 * Represents a service responsible for managing a ModSlotComponent.
 */
export class ModSlotComponentService {
  /**
   * Gets the accepted items category ID used to detemine the available sort buttons in the item selection dropdown.
   * @param items - Items.
   * @returns Accepted items category ID or undefined when multiple item types are accepted.
   */
  public getAcceptedItemsCategoryId(items: IItem[]): string | undefined {
    const categoryIds: string[] = []

    for (const acceptedItemCategory of items.map((ai) => ai.categoryId)) {
      if (categoryIds.findIndex((ci) => ci === acceptedItemCategory) < 0) {
        categoryIds.push(acceptedItemCategory)
      }
    }

    return categoryIds.length === 1 ? categoryIds[0] : undefined
  }
}