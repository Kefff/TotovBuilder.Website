import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../models/item/IItem'
import ItemFilterAndSortingData from '../../../models/utils/ItemFilterAndSortingData'
import { AmmunitionSortingFunctions, ItemSortingFunctions } from '../../../services/sorting/functions/itemSortingFunctions'

describe('ItemFilterAndSortingData', () => {
  describe('isCategoryIdReadOnly getter', () => {
    it('should return true when there is only one available item category', () => {
      // Arrange
      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)

      // Act / Assert
      expect(itemFilterAndSortingData.isCategoryIdReadOnly).toBe(true)

      // Arrange
      itemFilterAndSortingData.availableItemCategories.push(ItemCategoryId.ammunition)

      // Act / Assert
      expect(itemFilterAndSortingData.isCategoryIdReadOnly).toBe(true)

      // Arrange
      itemFilterAndSortingData.availableItemCategories.push(ItemCategoryId.armband)

      // Act / Assert
      expect(itemFilterAndSortingData.isCategoryIdReadOnly).toBe(false)
    })
  })

  describe('categoryId setter', () => {
    it('should update sorting functions and reset the sorting property to "name" when the previous sorting property does not exist in the new sorting functions', () => {
      // Arrange
      const itemFilterAndSortingData = new ItemFilterAndSortingData(AmmunitionSortingFunctions)
      itemFilterAndSortingData.property = 'fleshDamage'

      // Act
      itemFilterAndSortingData.categoryId = ItemCategoryId.armband

      // Assert
      expect(itemFilterAndSortingData.sortingFunctions).toBe(ItemSortingFunctions)
      expect(itemFilterAndSortingData.property).toBe('name')
    })
  })
})