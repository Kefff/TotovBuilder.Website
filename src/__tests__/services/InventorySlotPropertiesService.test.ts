import { IInventorySlot } from '../../models/build/IInventorySlot'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import Currencies from '../../assets/data/currencies.json'
import { ICurrency } from '../../models/item/ICurrency'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'

const inventorySlot1: IInventorySlot = {
  items: [
    {
      content: [],
      itemId: '5c0e874186f7745dc7616606', // Maska-1Shch bulletproof helmet (Killa)
      modSlots: [
        {
          item: {
            content: [],
            itemId: '5c0e842486f77443a74d2976', // Maska-1Shch face shield (Killa)
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_equipment'
        }
      ],
      quantity: 1
    }
  ],
  typeId: 'headwear'
}

const inventorySlot2: IInventorySlot = {
  items: [
    {
      content: [
        {
          content: [],
          itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
          modSlots: [],
          quantity: 1
        }
      ],
      itemId: '5beed0f50db834001c062b12', // RPK-16 5.45x39 light machine gun
      modSlots: [
        {
          item: {
            content: [],
            itemId: '5beec8ea0db834001a6f9dbf', // AK-12 pistol grip
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        },
        {
          item: {
            content: [],
            itemId: '5beec91a0db834001961942d', // RPK-16 dust cover
            modSlots: [
              {
                item: {
                  content: [],
                  itemId: '5beec9450db83400970084fd', // RPK-16 rear sight base
                  modSlots: [
                    {
                      item: {
                        content: [],
                        itemId: '5bf3f59f0db834001a6fa060', // RPK-16 rear sight
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'mod_sight_rear'
                    }
                  ],
                  quantity: 1
                },
                modSlotName: 'mod_sight_rear'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_reciever'
        },
        {
          item: {
            content: [
              {
                content: [],
                itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
                modSlots: [],
                quantity: 95
              }
            ],
            itemId: '5bed625c0db834001c062946', // RPK-16 5.45x39 95-round drum magazine
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            itemId: '5beec8b20db834001961942a', // RPK-16 buffer tube
            modSlots: [
              {
                item: {
                  content: [],
                  itemId: '5beec8c20db834001d2c465c', // AK-12 stock
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_stock'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_stock_001'
        },
        {
          item: {
            content: [],
            itemId: '5beec3e30db8340019619424', // RPK-16 handguard
            modSlots: [
              {
                item: {
                  content: [],
                  itemId: '5beecbb80db834001d2c465e', // RPK-16 handguard rail
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_000'
              },
              {
                item: {
                  content: [],
                  itemId: '5beecbb80db834001d2c465e', // RPK-16 handguard rail
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_001'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_handguard'
        },
        {
          item: {
            content: [],
            itemId: '5beec1bd0db834001e6006f3', // RPK-16 5.45x39 15 inch barrel
            modSlots: [
              {
                item: {
                  content: [],
                  itemId: '5beec3420db834001b095429', // RPK-16 5.45x39 muzzle brake \u0026 compensator
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_muzzle'
              }
            ],
            quantity: 1
          },
          modSlotName: 'mod_barrel'
        }
      ],
      quantity: 1
    }
  ],
  typeId: 'onSling'
}

const inventorySlot3: IInventorySlot = {
  typeId: 'backpack',
  items: [
    {
      content: [
        {
          content: [],
          itemId: '5cc70102e4a949035e43ba74', // FN P90 upper receiver
          modSlots: [],
          quantity: 1
        }
      ],
      itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
      modSlots: [],
      quantity: 1
    }
  ]
}

const invalidRangedWeaponInventorySlot: IInventorySlot = {
  items: [
    {
      content: [],
      itemId: 'invalid',
      modSlots: [],
      quantity: 1
    }
  ],
  typeId: 'onSling'
}

const invalidArmorInventorySlot: IInventorySlot = {
  items: [
    {
      content: [],
      itemId: 'invalid',
      modSlots: [],
      quantity: 1
    }
  ],
  typeId: 'bodyArmor'
}

describe('canBeLooted()', () => {
  it.each([
    [
      {
        items: [],
        typeId: 'armband'
      } as IInventorySlot,
      true,
      false
    ],
    [
      {
        items: [],
        typeId: 'backpack'
      } as IInventorySlot,
      true,
      true
    ],
    [
      {
        items: [],
        typeId: 'invalid'
      } as IInventorySlot,
      false,
      true
    ]
  ])('should indicate whether items of an inventory slot can be looted or not', (inventorySlot: IInventorySlot, expectedSuccess: boolean, expectedValue: boolean) => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const result = service.canBeLooted(inventorySlot)

    // Assert
    expect(result.success).toBe(expectedSuccess)

    if (expectedSuccess) {
      expect(result.value).toBe(expectedValue)
    }
  })
})

describe('getErgonomics()', () => {
  it.each([
    [inventorySlot2, 39],
    [inventorySlot1, undefined],
    [{
      typeId: 'onSling',
      items: []
    } as IInventorySlot, undefined]
  ])('should get the ergonomics of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: number | undefined) => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const ergonomics = await service.getErgonomics(inventorySlot)

    // Assert
    if (expected !== undefined) {
      expect(ergonomics?.success).toBe(true)
      expect(ergonomics?.value).toBe(expected)
    } else {
      expect(ergonomics).toBeUndefined()
    }
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const ergonomics = await service.getErgonomics(invalidRangedWeaponInventorySlot)

    // Assert
    expect(ergonomics?.success).toBe(false)
    expect(ergonomics?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getErgonomicsPercentageModifier()', () => {
  it.each([
    [inventorySlot1, -26],
    [inventorySlot2, undefined]
  ])('should get the ergonomics percentage modifier of an inventory slot', async (inventorySlot: IInventorySlot, expected: number | undefined) => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const ergonomicsPercentageModifier = await service.getErgonomicsPercentageModifier(inventorySlot)

    // Assert
    if (expected !== undefined) {
      expect(ergonomicsPercentageModifier?.success).toBe(true)
      expect(ergonomicsPercentageModifier?.value).toBe(expected)
    } else {
      expect(ergonomicsPercentageModifier).toBeUndefined()
    }
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const ergonomicsPercentageModifier = await service.getErgonomicsPercentageModifier(invalidArmorInventorySlot)

    // Assert
    expect(ergonomicsPercentageModifier?.success).toBe(false)
    expect(ergonomicsPercentageModifier?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getPrice()', () => {
  it.each([
    [
      inventorySlot1,
      {
        missingPrice: false,
        price: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 157181,
          valueInMainCurrency: 157181
        },
        pricesWithContent: [
          {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 157181,
            valueInMainCurrency: 157181
          }
        ],
        unitPrice: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        }
      } as IInventoryPrice
    ],
    [
      inventorySlot3,
      {
        missingPrice: false,
        price: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 25836,
          valueInMainCurrency: 25836
        },
        pricesWithContent: [
          {
            currencyName: 'RUB',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 22836,
            valueInMainCurrency: 22836
          },
          {
            currencyName: 'USD',
            merchant: undefined,
            merchantLevel: undefined,
            requiresQuest: false,
            value: 24,
            valueInMainCurrency: 3000
          }
        ],
        unitPrice: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        }
      } as IInventoryPrice
    ]
  ])('should get the price of an inventory slot', async (inventorySlot: IInventorySlot, expected: IInventoryPrice) => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const price = await service.getPrice(inventorySlot, true)

    // Assert
    expect(price.success).toBe(true)
    expect(price.value).toStrictEqual(expected)
  })

  it('should have a missing price when no merchants sell the item', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()
    const inventorySlot: IInventorySlot = {
      items: [{
        content: [],
        itemId: '56deee15d2720bee328b4567', // MP-153 12ga 4-shell forend cap
        modSlots: [],
        quantity: 1
      }],
      typeId: 'backpack'
    }

    // Act
    const price = await service.getPrice(inventorySlot, true)

    // Assert
    expect(price.success).toBe(true)
    expect(price.value).toStrictEqual({
      missingPrice: true,
      price: {
        currencyName: 'RUB',
        merchant: undefined,
        merchantLevel: undefined,
        requiresQuest: false,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        currencyName: 'RUB',
        merchant: undefined,
        merchantLevel: undefined,
        requiresQuest: false,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      unitPrice: {
        currencyName: 'RUB',
        merchant: undefined,
        merchantLevel: undefined,
        requiresQuest: false,
        value: 0,
        valueInMainCurrency: 0
      }
    })
  })

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()
    const mainCurrency = Currencies.find(c => c.name === 'RUB') as ICurrency
    mainCurrency.mainCurrency = false

    // Act
    const price = await service.getPrice(inventorySlot1, true)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Main currency not found.')

    // Clean
    mainCurrency.mainCurrency = true
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const price = await service.getPrice(invalidArmorInventorySlot, true)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getRecoil()', () => {
  it.each([
    [inventorySlot2, { horizontalRecoil: 200, verticalRecoil: 71 }],
    [inventorySlot1, undefined],
    [{
      typeId: 'onSling',
      items: []
    } as IInventorySlot, undefined]
  ])('should get the recoil of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: { horizontalRecoil: number, verticalRecoil: number } | undefined) => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const recoil = await service.getRecoil(inventorySlot)

    // Assert
    if (expected !== undefined) {
      expect(recoil?.success).toBe(true)
      expect(recoil?.value).toStrictEqual(expected)
    } else {
      expect(recoil).toBeUndefined()
    }
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const recoil = await service.getRecoil(invalidRangedWeaponInventorySlot)

    // Assert
    expect(recoil?.success).toBe(false)
    expect(recoil?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getWeight()', () => {
  it('should get the weight of an inventory slot', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const weight = await service.getWeight(inventorySlot1)

    // Assert
    expect(weight.success).toBe(true)
    expect(weight.value).toBe(3.7)
  }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    const service = new InventorySlotPropertiesService()

    // Act
    const weight = await service.getWeight(invalidArmorInventorySlot)

    // Assert
    expect(weight.success).toBe(false)
    expect(weight.failureMessage).toBe('Item "invalid" not found.')
  })
})