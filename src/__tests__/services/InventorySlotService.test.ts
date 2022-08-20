import { InventorySlotService } from '../../services/InventorySlotService'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import InventorySlotTypes from '../../assets/data/inventory-slot-types.json'

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
        {
          id: 'ammunition',
          types: [
            {
              id: '5485a8684bdc2da71d8b4567',
              name: 'Ammo'
            }
          ]
        },
        {
          id: 'armband',
          types: [
            {
              id: '5b3f15d486f77432d0509248',
              name: 'ArmBand'
            }
          ]
        },
        {
          id: 'armorMod',
          types: [
            {
              id: '57bef4c42459772e8d35a53b',
              name: 'ArmoredEquipment'
            }
          ]
        },
        {
          id: 'container',
          types: [
            {
              id: '5795f317245977243854e041',
              name: 'SimpleContainer'
            }
          ]
        },
        {
          'id': 'currency',
          'types': [
            {
              'id': '543be5dd4bdc2deb348b4569',
              'name': 'Money'
            }
          ]
        },
        {
          id: 'faceCover',
          types: [
            {
              id: '5a341c4686f77469e155819e',
              name: 'FaceCover'
            }
          ]
        },
        {
          id: 'grenade',
          types: [
            {
              id: '543be6564bdc2df4348b4568',
              name: 'ThrowWeap'
            }
          ]
        },
        {
          id: 'magazine',
          types: [
            {
              id: '610720f290b75a49ff2e5e25',
              name: 'CylinderMagazine'
            },
            {
              id: '5448bc234bdc2d3c308b4569',
              name: 'Magazine'
            }
          ]
        },
        {
          id: 'mod',
          types: [
            {
              id: '55818b084bdc2d5b648b4571',
              name: 'Flashlight'
            },
            {
              id: '55818b224bdc2dde698b456f',
              name: 'Mount'
            },
            {
              id: '5a2c3a9486f774688b05e574',
              name: 'NightVision'
            },
            {
              id: '5d21f59b6dbe99052b54ef83',
              name: 'ThermalVision'
            }
          ]
        },
        {
          id: 'other',
          types: []
        },
        {
          id: 'special',
          types: [
            { id: '5f4fbaaca5573a5ac31db429', name: 'Compass' },
            { id: '5447e0e74bdc2d3c308b4567', name: 'Special item' }
          ]
        }
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

  it('should get fail if an item category is not found', async () => {
    // Arrange
    useItemServiceMock()
    InventorySlotTypes.find(ist => ist.id === 'armband')?.acceptedItemCategoryIds.push('invalid')
    const service = new InventorySlotService()

    // Act
    const result = await service.getType('armband')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Item category "invalid" not found.')
  })
})