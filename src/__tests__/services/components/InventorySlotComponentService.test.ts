import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { CompatibilityService } from '../../../services/compatibility/CompatibilityService'
import { InventorySlotComponentService } from '../../../services/components/InventorySlotComponentService'
import { ItemService } from '../../../services/ItemService'
import { MerchantFilterService } from '../../../services/MerchantFilterService'
import { NotificationService } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import { PathUtils } from '../../../utils/PathUtils'
import Result, { FailureType } from '../../../utils/Result'
import { useItemServiceMock } from '../../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'

describe('getAcceptedItems()', () => {
  it('should get the acceptem items', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(MerchantFilterService)

    const merchantFitlerService = Services.get(MerchantFilterService)
    const inventorySlotComponentServiceService = new InventorySlotComponentService()

    merchantFitlerService.save([
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      },
      {
        enabled: true,
        merchant: 'ragman',
        merchantLevel: 4
      }
    ])

    // Act
    const items = await inventorySlotComponentServiceService.getAcceptedItems(['armband', 'headphones'])

    // Assert
    expect(items.map((i) => i.id)).toStrictEqual([
      '5b3f3af486f774679e752c1f',
      '5b3f3b0186f774021a2afef7',
      '5b3f3ade86f7746b6b790d8e',
      '5b3f16c486f7747c327f55f7',
      '5b3f3b0e86f7746752107cda',
      '5b432b965acfc47a8774094e',
      '5aa2ba71e5b5b000137b758f',
      '5645bcc04bdc2d363b8b4572',
      '628e4e576d783146b124c64d',
      '5c165d832e2216398b5a7e36'
    ])

    // Clean
    localStorage.clear()
  })

  it('should get an empty list if an error occurs', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(MerchantFilterService)

    const inventorySlotComponentService = new InventorySlotComponentService()
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, notificationServiceMock)
    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItemsOfCategory(anyString())).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    // Act
    const items = await inventorySlotComponentService.getAcceptedItems(['securedContainer'])

    // Assert
    expect(items.length).toBe(0)
  })
})

describe('checkCompatibility', () => {
  it.each([
    ['bodyArmor', { itemId: '5648a7494bdc2d9d488b4583' } as IInventoryItem, true],
    ['bodyArmor', { itemId: '5648a7494bdc2d9d488b4583' } as IInventoryItem, false],
    ['tacticalRig', { itemId: '5b44cad286f77402a54ae7e5' } as IInventoryItem, true],
    ['backpack', { itemId: '5ca20d5986f774331e7c9602' } as IInventoryItem, true],
    ['backpack', undefined, true]
  ])('should check compatibility of items selected in the inventory slot', async (inventorySlotTypeId: string, item: IInventoryItem | undefined, expected: boolean) => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const compatibilityServiceMock = mock<CompatibilityService>()
    when(compatibilityServiceMock.checkCompatibility(anything(), anything(), anyString()))
      .thenReturn(Promise.resolve(expected ? Result.ok() : Result.fail(FailureType.hidden, undefined, 'Error')))
    Services.configure(CompatibilityService, undefined, instance(compatibilityServiceMock))

    const inventorySlotComponentService = new InventorySlotComponentService()

    // Act
    const result = await inventorySlotComponentService.checkCompatibility(inventorySlotTypeId, item, PathUtils.buildPrefix + '123456789/' + PathUtils.inventorySlotPrefix + inventorySlotTypeId)

    // Assert
    expect(result).toBe(expected)
  })
})