import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { IItem } from '../../../models/item/IItem'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { ItemService } from '../../../services/ItemService'
import { NotificationService } from '../../../services/NotificationService'
import { CompatibilityService } from '../../../services/compatibility/CompatibilityService'
import { InventorySlotComponentService } from '../../../services/components/InventorySlotComponentService'
import Services from '../../../services/repository/Services'
import { PathUtils } from '../../../utils/PathUtils'
import Result, { FailureType } from '../../../utils/Result'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('getAcceptedItems()', () => {
  it('should get the acceptem items', async () => {
    // Arrange
    useItemServiceMock(
      true,
      [
        {
          categoryId: 'armband',
          id: '5b3f3af486f774679e752c1f'
        } as IItem,
        {
          categoryId: 'backpack',
          id: '5ab8ee7786f7742d8f33f0b9'
        } as IItem,
        {
          categoryId: 'headphones',
          id: '5b432b965acfc47a8774094e'
        } as IItem
      ])
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const inventorySlotComponentServiceService = new InventorySlotComponentService()

    // Act
    const items = await inventorySlotComponentServiceService.getAcceptedItems(['armband', 'headphones'])

    // Assert
    expect(items.map((i) => i.id)).toStrictEqual([
      '5b3f3af486f774679e752c1f',
      '5b432b965acfc47a8774094e'
    ])
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
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
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
      .thenResolve(expected ? Result.ok() : Result.fail(FailureType.hidden, undefined, 'Error'))
    Services.configure(CompatibilityService, undefined, instance(compatibilityServiceMock))

    const inventorySlotComponentService = new InventorySlotComponentService()

    // Act
    const result = await inventorySlotComponentService.checkCompatibility(inventorySlotTypeId, item, PathUtils.buildPrefix + '123456789/' + PathUtils.inventorySlotPrefix + inventorySlotTypeId)

    // Assert
    expect(result).toBe(expected)
  })
})