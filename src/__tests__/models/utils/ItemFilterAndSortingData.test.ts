import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../../models/item/IItem'
import ItemFilterAndSortingData from '../../../models/utils/ItemFilterAndSortingData'
import { SortingOrder } from '../../../models/utils/SortingOrder'
import Services from '../../../services/repository/Services'
import { AmmunitionSortingFunctions, ItemSortingFunctions } from '../../../services/sorting/functions/itemSortingFunctions'
import { WebsiteConfigurationService } from '../../../services/WebsiteConfigurationService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('ItemFilterAndSortingData', () => {
  describe('availableItemCategories setter', () => {
    it('should set the categoryId when only one category is available', () => {
      // Arrange
      const itemFilterAndSortingData1 = new ItemFilterAndSortingData(ItemSortingFunctions)
      const itemFilterAndSortingData2 = new ItemFilterAndSortingData(ItemSortingFunctions)

      // Act
      itemFilterAndSortingData1.availableItemCategories = [ItemCategoryId.ammunition]
      itemFilterAndSortingData2.availableItemCategories = [ItemCategoryId.mod, ItemCategoryId.rangedWeaponMod]

      // Assert
      expect(itemFilterAndSortingData1.categoryId).toBe(ItemCategoryId.ammunition)
      expect(itemFilterAndSortingData1.sortingFunctions).toBe(AmmunitionSortingFunctions)
      expect(itemFilterAndSortingData2.categoryId).toBeUndefined()
      expect(itemFilterAndSortingData2.sortingFunctions).toBe(ItemSortingFunctions)
    })
  })

  describe('categoryId setter', () => {
    it('should update sorting functions', () => {
      // Arrange
      const itemFilterAndSortingData = new ItemFilterAndSortingData(ItemSortingFunctions)
      itemFilterAndSortingData.property = 'price'

      // Act
      itemFilterAndSortingData.categoryId = ItemCategoryId.ammunition

      // Assert
      expect(itemFilterAndSortingData.sortingFunctions).toBe(AmmunitionSortingFunctions)
      expect(itemFilterAndSortingData.property).toBe('price')
    })

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

    it('should set the sorting order from the last sorting order saved in session storage for the item category', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey, SortingOrder.asc.toString())
      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey, 'price')
      sessionStorage.setItem(`${ItemCategoryId.ammunition}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`, SortingOrder.desc.toString())
      sessionStorage.setItem(`${ItemCategoryId.ammunition}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`, 'fleshDamage')

      const itemFilterAndSortingData = new ItemFilterAndSortingData(AmmunitionSortingFunctions)

      // Act
      itemFilterAndSortingData.availableItemCategories = [ItemCategoryId.ammunition] // Automatically calls categoryId setter

      // Assert
      expect(itemFilterAndSortingData.order).toBe(SortingOrder.desc)
      expect(itemFilterAndSortingData.property).toBe('fleshDamage')
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

    it('should copy item filter and sorting data without getting the last sort from session storage', () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const websiteConfigurationService = Services.get(WebsiteConfigurationService)


      const itemFilterAndSortingDataToCopy = new ItemFilterAndSortingData(AmmunitionSortingFunctions)
      itemFilterAndSortingDataToCopy.availableItemCategories = [ItemCategoryId.ammunition]
      itemFilterAndSortingDataToCopy.categoryId = ItemCategoryId.ammunition
      itemFilterAndSortingDataToCopy.property = 'fleshDamage'
      itemFilterAndSortingDataToCopy.currentSortingFunction = AmmunitionSortingFunctions.functions[itemFilterAndSortingDataToCopy.property]
      itemFilterAndSortingDataToCopy.filter = '9x19'
      itemFilterAndSortingDataToCopy.order = SortingOrder.desc

      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey, SortingOrder.asc.toString())
      sessionStorage.setItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey, 'price')
      sessionStorage.setItem(`${ItemCategoryId.ammunition}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`, SortingOrder.asc.toString())
      sessionStorage.setItem(`${ItemCategoryId.ammunition}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`, 'penetrationPower')

      // Act

      const itemFilterAndSortingData = new ItemFilterAndSortingData(AmmunitionSortingFunctions, itemFilterAndSortingDataToCopy)

      // Assert
      expect(itemFilterAndSortingData.categoryId).toBe(ItemCategoryId.ammunition)
      expect(itemFilterAndSortingData.currentSortingFunction).toBe(AmmunitionSortingFunctions.functions['fleshDamage'])
      expect(itemFilterAndSortingData.filter).toBe('9x19')
      expect(itemFilterAndSortingData.order).toBe(SortingOrder.desc)
      expect(itemFilterAndSortingData.property).toBe('fleshDamage')
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
      if (hasCategoryId || itemFilterAndSortingData.availableItemCategories.length === 1) {
        expect(Number(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`))).toBe(SortingOrder.desc)
        expect(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey)).toBeNull()
      } else {
        expect(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortOrderStorageKeySuffix}`)).toBeNull()
        expect(Number(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortOrderStorageKey))).toBe(SortingOrder.desc)
      }
    })
  })

  describe('property setter', () => {
    it.each([
      [true, true, undefined, undefined],
      [true, false, undefined, undefined],
      [false, true, undefined, undefined],
      [false, false, undefined, undefined]
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
      if (hasCategoryId || itemFilterAndSortingData.availableItemCategories.length === 1) {
        expect(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`)).toBe('price')
        expect(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey)).toBeNull()
      } else {
        expect(sessionStorage.getItem(`${ItemCategoryId.rangedWeaponMod}${websiteConfigurationService.configuration.itemCategorySortPropertyStorageKeySuffix}`)).toBeNull()
        expect(sessionStorage.getItem(websiteConfigurationService.configuration.itemsSortPropertyStorageKey)).toBe('price')
      }
    })
  })
})