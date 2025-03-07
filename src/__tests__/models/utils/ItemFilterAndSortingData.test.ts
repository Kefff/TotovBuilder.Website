import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../models/item/IItem'
import ItemFilterAndSortingData from '../../../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../../../models/utils/SortingOrder'
import Services from '../../../services/repository/Services'
import { AmmunitionSortingFunctions, ItemSortingFunctions } from '../../../services/sorting/functions/itemSortingFunctions'
import { WebsiteConfigurationService } from '../../../services/WebsiteConfigurationService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('ItemFilterAndSortingData', () => {
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

  describe('constructor', () => {
    it('should initialize sorting order and property ', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      // Act
      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)

      // Assert
      expect(itemFilterAndSortingData.order).toBe(SortingOrder.asc)
      expect(itemFilterAndSortingData.property).toBe('name')
    })

    it('should initialize sorting order and property from last values in session storage', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey, SortingOrder.desc.toString())
      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey, 'price')

      // Act
      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)

      // Assert
      expect(itemFilterAndSortingData.order).toBe(SortingOrder.desc)
      expect(itemFilterAndSortingData.property).toBe('price')
    })

    it('should copy item filter and sorting data and initialize sorting order and property from last values in session storage for the item category', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const sortingProperty = 'fleshDamage'

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      sessionStorage.setItem(`${ItemCategoryId.ammunition}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`, SortingOrder.desc.toString())
      sessionStorage.setItem(`${ItemCategoryId.ammunition}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`, sortingProperty)

      const itemFilterAndSortingDataToCopy = new ItemFilterAndSortingData(AmmunitionSortingFunctions)
      itemFilterAndSortingDataToCopy.availableItemCategories = [ItemCategoryId.ammunition]
      itemFilterAndSortingDataToCopy.categoryId = ItemCategoryId.ammunition
      itemFilterAndSortingDataToCopy.currentSortingFunction = AmmunitionSortingFunctions.functions[sortingProperty]
      itemFilterAndSortingDataToCopy.filter = 'scav'

      // Act
      const itemFilterAndSortingData = new ItemFilterAndSortingData(AmmunitionSortingFunctions, itemFilterAndSortingDataToCopy)

      // Assert
      expect(itemFilterAndSortingData.categoryId).toBe(ItemCategoryId.ammunition)
      expect(itemFilterAndSortingData.currentSortingFunction).toBe(AmmunitionSortingFunctions.functions[sortingProperty])
      expect(itemFilterAndSortingData.filter).toBe('scav')
      expect(itemFilterAndSortingData.order).toBe(SortingOrder.desc)
      expect(itemFilterAndSortingData.property).toBe(sortingProperty)
    })

    it('should copy item filter and sorting data and initialize sorting order and property from last values in session storage for items when multiple item categories are accepted', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey, SortingOrder.desc.toString())
      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey, 'price')
      sessionStorage.setItem(`${ItemCategoryId.mod}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`, SortingOrder.asc.toString())
      sessionStorage.setItem(`${ItemCategoryId.mod}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`, 'ergonomics')
      sessionStorage.setItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`, SortingOrder.asc.toString())
      sessionStorage.setItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`, 'verticalRecoil')

      const itemFilterAndSortingDataToCopy = new ItemFilterAndSortingData(ItemSortingFunctions)
      itemFilterAndSortingDataToCopy.availableItemCategories = [ItemCategoryId.mod, ItemCategoryId.rangedWeaponMod]
      itemFilterAndSortingDataToCopy.categoryId = ItemCategoryId.rangedWeaponMod
      itemFilterAndSortingDataToCopy.currentSortingFunction = ItemSortingFunctions.functions['weight']
      itemFilterAndSortingDataToCopy.filter = 'scav'

      // Act
      const itemFilterAndSortingData = new ItemFilterAndSortingData(AmmunitionSortingFunctions, itemFilterAndSortingDataToCopy)

      // Assert
      expect(itemFilterAndSortingData.categoryId).toBe(ItemCategoryId.rangedWeaponMod)
      expect(itemFilterAndSortingData.currentSortingFunction).toBe(ItemSortingFunctions.functions['price'])
      expect(itemFilterAndSortingData.filter).toBe('scav')
      expect(itemFilterAndSortingData.order).toBe(SortingOrder.desc)
      expect(itemFilterAndSortingData.property).toBe('price')
    })
  })

  describe('isCategoryIdReadOnly getter', () => {
    it('should return true when there is only one available item category', () => {
      // Arrange
      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)

      // Act / Assert
      expect(itemFilterAndSortingData.isCategoryIdReadOnly).toBe(false)

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

  describe('order setter', () => {
    it.each([
      [true, true],
      [true, false],
      [false, true],
      [false, false]
    ])('should set the sorting order and save it to session storage (hasCategoryId: %s, hasMultipleAcceptedItemCategories: %s)', (hasCategoryId: boolean, hasMultipleAcceptedItemCategories: boolean) => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)

      if (hasCategoryId) {
        itemFilterAndSortingData.categoryId = ItemCategoryId.rangedWeaponMod
      }

      if (hasMultipleAcceptedItemCategories) {
        itemFilterAndSortingData.availableItemCategories = [ItemCategoryId.mod, ItemCategoryId.rangedWeaponMod]
      } else {
        itemFilterAndSortingData.availableItemCategories = [ItemCategoryId.rangedWeaponMod]
      }

      // Act
      itemFilterAndSortingData.order = SortingOrder.desc

      // Assert
      if (hasCategoryId && !hasMultipleAcceptedItemCategories) {
        expect(Number(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`))).toBe(SortingOrder.desc)
        expect(Number(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey))).toBe(SortingOrder.asc)
      } else {
        expect(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`)).toBeNull()
        expect(Number(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey))).toBe(SortingOrder.desc)
      }
    })
  })

  describe('property setter', () => {
    it.each([
      [true, true],
      [true, false],
      [false, true],
      [false, false]
    ])('should set the sorting property and save it to session storage (hasCategoryId: %s, hasMultipleAcceptedItemCategories: %s)', (hasCategoryId: boolean, hasMultipleAcceptedItemCategories: boolean) => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)

      if (hasCategoryId) {
        itemFilterAndSortingData.categoryId = ItemCategoryId.rangedWeaponMod
      }

      if (hasMultipleAcceptedItemCategories) {
        itemFilterAndSortingData.availableItemCategories = [ItemCategoryId.mod, ItemCategoryId.rangedWeaponMod]
      } else {
        itemFilterAndSortingData.availableItemCategories = [ItemCategoryId.rangedWeaponMod]
      }

      // Act
      itemFilterAndSortingData.property = 'price'

      // Assert
      if (hasCategoryId && !hasMultipleAcceptedItemCategories) {
        expect(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`)).toBe('price')
        expect(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey)).toBe('name')
      } else {
        expect(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`)).toBeNull()
        expect(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey)).toBe('price')
      }
    })
  })
})