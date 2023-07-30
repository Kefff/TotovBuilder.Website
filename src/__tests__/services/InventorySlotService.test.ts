import { InventorySlotService } from '../../services/InventorySlotService'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { describe, expect, it } from 'vitest'

describe('getType()', () => {
  it('should get an inventory slot type', async () => {
    // Arrange
    useItemServiceMock()
    const service = new InventorySlotService()

    // Act
    const slotTypeResult = await service.getType('pockets')

    // Assert
    expect(slotTypeResult.success).toBe(true)
    expect(slotTypeResult.value).toStrictEqual({
      acceptedItemCategories: [
        'ammunition',
        'armband',
        'armorMod',
        'container',
        'currency',
        'faceCover',
        'grenade',
        'magazine',
        'mod',
        'other',
        'special'
      ],
      canBeLooted: true,
      customIcon: undefined,
      displayOrder: 8,
      icon: 'th-large',
      id: 'pockets',
      itemSlotsAmount: 4
    })
  })

  it('should fail if an inventory slot type is not found', async () => {
    // Arrange
    const service = new InventorySlotService()

    // Act
    const result = await service.getType('invalid')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Inventory slot type "invalid" not found.')
  })
})