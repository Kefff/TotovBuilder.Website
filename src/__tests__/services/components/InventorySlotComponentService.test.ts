import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../../models/build/IInventoryItem'
import { NotificationService } from '../../../services/NotificationService'
import { CompatibilityService } from '../../../services/compatibility/CompatibilityService'
import { InventorySlotComponentService } from '../../../services/components/InventorySlotComponentService'
import Services from '../../../services/repository/Services'
import { PathUtils } from '../../../utils/PathUtils'
import { armor6b13FlDefault, berkut, scavVest } from '../../__data__/itemMocks'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('checkCompatibility', () => {
  it.each([
    ['bodyArmor', { itemId: armor6b13FlDefault.id } as IInventoryItem, true],
    ['bodyArmor', { itemId: armor6b13FlDefault.id } as IInventoryItem, false],
    ['tacticalRig', { itemId: scavVest.id } as IInventoryItem, true],
    ['backpack', { itemId: berkut.id } as IInventoryItem, true],
    ['backpack', undefined, true]
  ])('should check compatibility of items selected in the inventory slot', async (inventorySlotTypeId: string, item: IInventoryItem | undefined, expected: boolean) => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const compatibilityServiceMock = mock<CompatibilityService>()
    when(compatibilityServiceMock.checkCompatibility(anything(), anything(), anyString()))
      .thenResolve(expected)
    Services.configure(CompatibilityService, undefined, instance(compatibilityServiceMock))

    const inventorySlotComponentService = new InventorySlotComponentService()

    // Act
    const result = await inventorySlotComponentService.checkCompatibility(inventorySlotTypeId, item, PathUtils.buildPrefix + '123456789/' + PathUtils.inventorySlotPrefix + inventorySlotTypeId)

    // Assert
    expect(result).toBe(expected)
  })
})