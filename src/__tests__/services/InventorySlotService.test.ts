import { describe, expect, it } from 'vitest'
import { InventorySlotService } from '../../services/InventorySlotService'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'

describe('getType()', () => {
  it('should get an inventory slot type', () => {
    // Arrange
    useItemServiceMock()
    const service = new InventorySlotService()

    // Act
    const slotTypeResult = service.getType('pockets')

    // Assert
    expect(slotTypeResult.success).toBe(true)
    expect(slotTypeResult.value).toStrictEqual({
      acceptedItemCategories: [
        'ammunition',
        'armband',
        'armor',
        'armorMod',
        'backpack',
        'container',
        'currency',
        'eyewear',
        'faceCover',
        'grenade',
        'headphones',
        'headwear',
        'magazine',
        'mainWeapon',
        'meleeWeapon',
        'mod',
        'other',
        'rangedWeaponMod',
        'secondaryWeapon',
        'securedContainer',
        'special',
        'vest'
      ],
      canBeLooted: true,
      customIcon: undefined,
      displayOrder: 8,
      icon: 'th-large',
      id: 'pockets',
      itemSlotsAmount: 4
    })
  })

  it('should fail if an inventory slot type is not found', () => {
    // Arrange
    const service = new InventorySlotService()

    // Act
    const result = service.getType('invalid')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Inventory slot type "invalid" not found.')
  })
})