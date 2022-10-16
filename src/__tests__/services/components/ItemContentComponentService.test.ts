import { anyString, instance, mock, when } from 'ts-mockito'
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
import { useItemServiceMock } from '../../../__mocks__/ItemServiceMock'

describe('getAcceptedItems()', () => {
  it.each([
    ['5ca20d5986f774331e7c9602', 68],
    ['5a7ad2e851dfba0016153692', 1]
  ])('should get the acceptem items', async (itemId: string, expected: number) => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
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
    expect(items.length).toBe(expected)

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
    when(itemServiceMock.getItem('5efb0e16aeb21837e749c7ff')).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    when(itemServiceMock.getItemsOfCategory(anyString())).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    when(itemServiceMock.getItemCategories()).thenReturn(Promise.resolve(ItemCategories))
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