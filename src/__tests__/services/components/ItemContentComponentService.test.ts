import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { IItem } from '../../../models/item/IItem'
import { IMagazine } from '../../../models/item/IMagazine'
import { ItemContentComponentService } from '../../../services/components/ItemContentComponentService'
import { ItemService } from '../../../services/ItemService'
import { NotificationService } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import ItemCategories from '../../../../test-data/item-categories.json'
import { MerchantFilterService } from '../../../services/MerchantFilterService'
import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../../__mocks__/TarkovValuesServiceMock'
import { useItemFetcherServiceMock } from '../../../__mocks__/ItemFetcherServiceMock'

describe('getAcceptedItems()', () => {
  it.each([
    ['5ca20d5986f774331e7c9602', 83, 68, 16, 1],
    ['5a7ad2e851dfba0016153692', 1, 1, 0, 0]
  ])('should get the acceptem items', async (
    itemId: string,
    expectedItemsAmount: number,
    expectedNonBarterItemsAmount: number,
    expectedBarterItemsAmount: number, expectedNonBarterAndBarterItemsAmount) => {
    // Arrange
    useItemFetcherServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(ItemService)
    Services.configure(MerchantFilterService)

    const merchantFitlerService = Services.get(MerchantFilterService)
    const itemContentService = new ItemContentComponentService()

    merchantFitlerService.save([
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 1
      }
    ])

    // Act
    const items = await itemContentService.getAcceptedItems(itemId)

    // Assert
    const nonBarters = items.filter(i => i.prices.some(p => p.merchant === 'prapor' && p.merchantLevel === 1 && p.currencyName !== 'barter'))
    const barters = items.filter(i => i.prices.some(p => p.merchant === 'prapor' && p.merchantLevel === 1 && p.currencyName === 'barter'))
    const common = barters.filter(b => nonBarters.includes(b))

    expect(items.length).toBe(expectedItemsAmount)
    expect(nonBarters.length).toBe(expectedNonBarterItemsAmount)
    expect(barters.length).toBe(expectedBarterItemsAmount)
    expect(common.length).toBe(expectedNonBarterAndBarterItemsAmount)

    // Clean
    localStorage.clear()
  })

  it('should get an empty list if the parent item is not found', async () => {
    // Arrange
    const itemContentService = new ItemContentComponentService()
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, notificationServiceMock)

    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(anyString())).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    // Act
    const items = await itemContentService.getAcceptedItems('5ca20d5986f774331e7c9602')

    // Assert
    expect(items.length).toBe(0)
  })

  it.each([
    [{ id: '5ca20d5986f774331e7c9602', categoryId: 'backpack' } as IItem],
    [{ id: '5a7ad2e851dfba0016153692', categoryId: 'magazine', acceptedAmmunitionIds: ['5efb0e16aeb21837e749c7ff'] } as IMagazine]
  ])('should ignore accepted items that are not found', async (item: IItem) => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(MerchantFilterService)

    const itemContentService = new ItemContentComponentService()
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, notificationServiceMock)

    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(item.id)).thenReturn(Promise.resolve(Result.ok(item)))
    when(itemServiceMock.getItems(anything(), true)).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    when(itemServiceMock.getItemCategories()).thenReturn(Promise.resolve(ItemCategories))
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    // Act
    const items = await itemContentService.getAcceptedItems(item.id)

    // Assert
    expect(items.length).toBe(0)
  })
})

describe('getCategoryIds()', () => {
  it.each([
    ['backpack', ['item']],
    ['magazine', ['ammunition']]
  ])('should get category IDs', (itemCategoryId: string, expected: string[]) => {
    // Act
    const itemContentService = new ItemContentComponentService()
    const categoryIds = itemContentService.getCategoryIds(itemCategoryId)

    // Assert
    expect(categoryIds).toStrictEqual(expected)
  })
})