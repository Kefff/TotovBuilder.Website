import { InventorySlotService } from '../../services/InventorySlotService'

describe('getType()', () => {
  it('should get an inventory slot type', async () => {
    // Arrange
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
          id: 'compass',
          types: [
            {
              id: '5f4fbaaca5573a5ac31db429',
              name: 'Compass'
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
          id: 'food',
          types: [
            {
              id: '5448e8d64bdc2dce718b4568',
              name: 'Drink'
            },
            {
              id: '5448e8d04bdc2ddf718b4569',
              name: 'Food'
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
          id: 'medical',
          types: [
            {
              id: '5448f3a14bdc2d27728b4569',
              name: 'Drugs'
            },
            {
              id: '5448f3ac4bdc2dce718b4569',
              name: 'Medical'
            },
            {
              id: '5448f39d4bdc2d0a728b4568',
              name: 'MedKit'
            },
            {
              id: '5448f3a64bdc2d60728b456a',
              name: 'Stimulator'
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
          types: [
            {
              id: '543be5cb4bdc2deb348b4568',
              name: 'AmmoBox'
            },
            {
              id: '57864ee62459775490116fc1',
              name: 'Battery'
            },
            {
              id: '57864ada245977548638de91',
              name: 'BuildingMaterial'
            },
            {
              id: '57864a66245977548f04a81f',
              name: 'Electronics'
            },
            {
              id: '5d650c3e815116009f6201d2',
              name: 'Fuel'
            },
            {
              id: '57864c322459775490116fbf',
              name: 'HouseholdGoods'
            },
            {
              id: '5448ecbe4bdc2d60728b4568',
              name: 'Info'
            },
            {
              id: '57864a3d24597754843f8721',
              name: 'Jewelry'
            },
            {
              id: '5c164d2286f774194c5e69fa',
              name: 'Keycard'
            },
            {
              id: '5c99f98d86f7745c314214b3',
              name: 'KeyMechanical'
            },
            {
              id: '57864e4c24597754843f8723',
              name: 'Lubricant'
            },
            {
              id: '57864c8c245977548867e7f1',
              name: 'MedicalSupplies'
            },
            {
              id: '590c745b86f7743cc433c5f2',
              name: 'Other'
            },
            {
              id: '61605ddea09d851a0a0c1bbc',
              name: 'PortableRangeFinder'
            },
            {
              id: '57864bb7245977548b3b66c2',
              name: 'Tool'
            }
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

  it('should get fail if an inventory slot type is not found', async () => {
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
    const service = new InventorySlotService()

    // Act
    const result = await service.getType('armband')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Item category "invalid" not found.')
  })
})