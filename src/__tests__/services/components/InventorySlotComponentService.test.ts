import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { CompatibilityService } from '../../../services/compatibility/CompatibilityService'
import { InventorySlotComponentService } from '../../../services/components/InventorySlotComponentService'
import { ItemService } from '../../../services/ItemService'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
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
    Services.configure(GlobalFilterService)

    const globalFitlerService = Services.get(GlobalFilterService)
    const inventorySlotComponentServiceService = new InventorySlotComponentService()

    globalFitlerService.saveMerchantFilters([
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
      '619bdeb986e01e16f839a99e',
      '619bdf9cc9546643a67df6f8',
      '5b3f3af486f774679e752c1f',
      '628e4e576d783146b124c64d',
      '619bdfd4c9546643a67df6fa',
      '5b3f16c486f7747c327f55f7',
      '5aa2ba71e5b5b000137b758f',
      '5a16b9fffcdbcb0176308b34',
      '60b0f988c4449e4cb624c1da',
      '5b3f3ade86f7746b6b790d8e',
      '6033fa48ffd42c541047f728',
      '619bddc6c9546643a67df6ee',
      '619bdd8886e01e16f839a99c',
      '619bddffc9546643a67df6f0',
      '619bc61e86e01e16f839a999',
      '5f9949d869e2777a0e779ba5',
      '5645bcc04bdc2d363b8b4572',
      '619bde7fc9546643a67df6f4',
      '619bdef8c9546643a67df6f6',
      '5b432b965acfc47a8774094e',
      '5b3f3b0186f774021a2afef7',
      '619bde3dc9546643a67df6f2',
      '5f60cd6cf2bcbb675b00dac6',
      '5e4d34ca86f774264f758330',
      '5c165d832e2216398b5a7e36',
      '5b3f3b0e86f7746752107cda'
    ])

    // Clean
    localStorage.clear()
  })

  it('should get an empty list if an error occurs', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventorySlotComponentService = new InventorySlotComponentService()
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, notificationServiceMock)
    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenReturn(Promise.resolve(Result.fail(FailureType.hidden, '', 'Error')))
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