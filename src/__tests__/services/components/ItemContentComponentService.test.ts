import { describe, expect, it } from 'vitest'
import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { ItemContentComponentService } from '../../../services/components/ItemContentComponentService'
import { ammo545bp, ammo9mmGT, berkut, m9a3Magazine, ms2000, rgd5 } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'

describe('ItemContentComponentService', () => {
  describe('getAcceptedItems()', () => {
    it.each([
      [
        berkut.id,
        [
          ammo545bp,
          ammo9mmGT,
          ammo9mmPso,
          berkut,
          m9a3Magazine,
          ms2000,
          rgd5
        ]
      ],
      [
        m9a3Magazine.id,
        [
          ammo9mmGT,
          ammo9mmPso
        ]
      ]
    ])('should get the acceptem items', async (
      itemId: string,
      expectedItemIds: IItem[]) => {
      // Arrange
      useItemServiceMock(
        true,
        [
          ammo545bp,
          ammo9mmGT,
          ammo9mmPso,
          berkut,
          m9a3Magazine,
          ms2000,
          rgd5
        ])

      const itemContentService = new ItemContentComponentService()

      // Act
      const items = await itemContentService.getAcceptedItems(itemId)

      // Assert
      expect(items).toStrictEqual(expectedItemIds)
    })

    it('should get all items as accepted if the parent item is not found', async () => {
      // Arrange
      useItemServiceMock(
        true,
        [
          ammo545bp,
          ammo9mmGT,
          ammo9mmPso,
          berkut,
          m9a3Magazine,
          ms2000,
          rgd5
        ]
      )

      const itemContentService = new ItemContentComponentService()

      // Act
      const items = await itemContentService.getAcceptedItems('invalid')

      // Assert
      expect(items).toStrictEqual([
        ammo545bp,
        ammo9mmGT,
        ammo9mmPso,
        berkut,
        m9a3Magazine,
        ms2000,
        rgd5
      ])
    })
  })

  describe('getAcceptedItemsCategoryId()', () => {
    it.each([
      [ItemCategoryId.backpack, undefined],
      [ItemCategoryId.magazine, ItemCategoryId.ammunition]
    ])('should get accepted items category ID', (itemCategoryId: ItemCategoryId, expected: ItemCategoryId | undefined) => {
      // Act
      const itemContentService = new ItemContentComponentService()
      const categoryIds = itemContentService.getAcceptedItemsCategoryId(itemCategoryId)

      // Assert
      expect(categoryIds).toStrictEqual(expected)
    })
  })

  const ammo9mmPso = {
    categoryId: ItemCategoryId.ammunition,
    id: '58864a4f2459770fcc257101'
  } as IItem
})