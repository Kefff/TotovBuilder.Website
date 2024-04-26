import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import ItemCategories from '../../../../public/data/item-categories.json'
import { IItem } from '../../../models/item/IItem'
import { ItemService } from '../../../services/ItemService'
import { ItemContentComponentService } from '../../../services/components/ItemContentComponentService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { ammo545bp, ammo9mmGT, berkut, m9a3Magazine, ms2000, rgd5 } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'

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

  it('should get an empty list if the parent item is not found', async () => {
    // Arrange
    const itemContentService = new ItemContentComponentService()

    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(anyString())).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    // Act
    const items = await itemContentService.getAcceptedItems('5ca20d5986f774331e7c9602')

    // Assert
    expect(items.length).toBe(0)
  })

  it.each([
    [berkut],
    [m9a3Magazine]
  ])('should ignore accepted items that are not found', async (item: IItem) => {
    // Arrange
    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(item.id)).thenResolve(Result.ok(item))
    when(itemServiceMock.getItems(anything(), true)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    when(itemServiceMock.getItemCategories()).thenResolve(ItemCategories)
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    const itemContentService = new ItemContentComponentService()

    // Act
    const items = await itemContentService.getAcceptedItems(item.id)

    // Assert
    expect(items.length).toBe(0)
  })
})

describe('getAcceptedItemsCategoryId()', () => {
  it.each([
    ['backpack', undefined],
    ['magazine', 'ammunition']
  ])('should get accepted items category ID', (itemCategoryId: string, expected: string | undefined) => {
    // Act
    const itemContentService = new ItemContentComponentService()
    const categoryIds = itemContentService.getAcceptedItemsCategoryId(itemCategoryId)

    // Assert
    expect(categoryIds).toStrictEqual(expected)
  })
})

const ammo9mmPso = {
  categoryId: 'ammunition',
  id: '58864a4f2459770fcc257101'
} as IItem