import { IInventorySlot } from '../../models/build/IInventorySlot'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import Services from '../../services/repository/Services'
import { InventoryItemService } from '../../services/InventoryItemService'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { usePresetServiceMock } from '../../__mocks__/PresetPropertiesServiceMock'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'

const inventorySlot1: IInventorySlot = {
  items: [
    {
      content: [],
      ignorePrice: false,
      itemId: '5d6d3716a4b9361bc8618872', // BNTI LShZ-2DTM helmet
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5d6d3829a4b9361bc8618943', // LShZ-2DTM face shield
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
          ignorePrice: false,
          itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: '5beed0f50db834001c062b12', // RPK-16 5.45x39 light machine gun
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5beec8ea0db834001a6f9dbf', // AK-12 pistol grip
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5beec91a0db834001961942d', // RPK-16 dust cover
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5beec9450db83400970084fd', // RPK-16 rear sight base
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
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
                ignorePrice: false,
                itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
                modSlots: [],
                quantity: 95
              }
            ],
            ignorePrice: false,
            itemId: '5bed625c0db834001c062946', // RPK-16 5.45x39 95-round drum magazine
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5beec8b20db834001961942a', // RPK-16 buffer tube
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
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
            ignorePrice: false,
            itemId: '5beec3e30db8340019619424', // RPK-16 handguard
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '5beecbb80db834001d2c465e', // RPK-16 handguard rail
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_000'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
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
            ignorePrice: false,
            itemId: '5beec1bd0db834001e6006f3', // RPK-16 5.45x39 15 inch barrel
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
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
  typeId: 'securedContainer',
  items: [
    {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: '5a6b59a08dc32e000b452fb7', // Glock SAI 9x19 thread protector
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: '544a11ac4bdc2d470e8b456a', // Secure container Alpha
      modSlots: [],
      quantity: 1
    }
  ]
}

const invalidRangedWeaponInventorySlot: IInventorySlot = {
  items: [
    {
      content: [],
      ignorePrice: false,
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
      ignorePrice: false,
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
    [inventorySlot2, 37.5],
    [inventorySlot1, undefined],
    [{
      typeId: 'onSling',
      items: []
    } as IInventorySlot, undefined]
  ])('should get the ergonomics of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: number | undefined) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)
    const service = new InventorySlotPropertiesService()

    // Act
    const ergonomics = await service.getErgonomics(inventorySlot)

    // Assert
    if (expected != null) {
      expect(ergonomics?.success).toBe(true)
      expect(ergonomics?.value).toBe(expected)
    } else {
      expect(ergonomics).toBeUndefined()
    }
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    const service = new InventorySlotPropertiesService()

    // Act
    const ergonomics = await service.getErgonomics(invalidRangedWeaponInventorySlot)

    // Assert
    expect(ergonomics?.success).toBe(false)
    expect(ergonomics?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getWearableModifiers()', () => {
  it.each([
    [
      inventorySlot1,
      {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: -0.05,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: 0,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: -0.08
      } as IWearableModifiers
    ],
    [
      inventorySlot2,
      undefined
    ]
  ])('should get the wearable modifiers of an inventory slot', async (inventorySlot: IInventorySlot, expected: IWearableModifiers | undefined) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)
    const service = new InventorySlotPropertiesService()

    // Act
    const wearableModifiersResult = await service.getWearableModifiers(inventorySlot)

    // Assert
    if (expected != null) {
      expect(wearableModifiersResult?.success).toBe(true)
      expect(wearableModifiersResult?.value).toStrictEqual(expected)
    } else {
      expect(wearableModifiersResult).toBeUndefined()
    }
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    const service = new InventorySlotPropertiesService()

    // Act
    const wearableModifiersResult = await service.getWearableModifiers(invalidArmorInventorySlot)

    // Assert
    expect(wearableModifiersResult?.success).toBe(false)
    expect(wearableModifiersResult?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getPrice()', () => {
  it.each([
    [
      inventorySlot1,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 116824,
          valueInMainCurrency: 116824
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 116824,
            valueInMainCurrency: 116824
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      inventorySlot3,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 1026292,
          valueInMainCurrency: 1026292
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'EUR',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 12,
            valueInMainCurrency: 1380
          },
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 9151,
            valueInMainCurrency: 1024912
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ]
  ])('should get the price of an inventory slot', async (inventorySlot: IInventorySlot, expected: IInventoryPrice) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)
    const service = new InventorySlotPropertiesService()

    // Act
    const price = await service.getPrice(inventorySlot, true)

    // Assert
    expect(price.success).toBe(true)
    expect(price.value).toStrictEqual(expected)
  })

  it('should have a missing price when no merchants sell the item', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)
    const service = new InventorySlotPropertiesService()

    const inventorySlot: IInventorySlot = {
      items: [{
        content: [],
        ignorePrice: false,
        itemId: '5c0e874186f7745dc7616606', // Maska-1SCh bulletproof helmet (Killa)
        modSlots: [],
        quantity: 1
      }],
      typeId: 'headwear'
    }

    // Act
    const price = await service.getPrice(inventorySlot, true)

    // Assert
    expect(price.success).toBe(true)
    expect(price.value).toStrictEqual({
      missingPrice: true,
      price: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      pricesWithContent: [],
      unitPrice: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: null,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    } as IInventoryPrice)
  })

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    useItemServiceMock(false)
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)
    const service = new InventorySlotPropertiesService()

    // Act
    const price = await service.getPrice(inventorySlot1, true)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Main currency not found.')
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)
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
    [inventorySlot2, { horizontalRecoil: 230, verticalRecoil: 81 }],
    [inventorySlot1, undefined],
    [{
      typeId: 'onSling',
      items: []
    } as IInventorySlot, undefined]
  ])('should get the recoil of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: { horizontalRecoil: number, verticalRecoil: number } | undefined) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)
    const service = new InventorySlotPropertiesService()

    // Act
    const recoil = await service.getRecoil(inventorySlot)

    // Assert
    if (expected != null) {
      expect(recoil?.success).toBe(true)
      expect(recoil?.value).toStrictEqual(expected)
    } else {
      expect(recoil).toBeUndefined()
    }
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
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
    useItemServiceMock()
    Services.configure(InventoryItemService)
    const service = new InventorySlotPropertiesService()

    // Act
    const weight = await service.getWeight(inventorySlot1)

    // Assert
    expect(weight.success).toBe(true)
    expect(weight.value).toBe(4.4)
  }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    const service = new InventorySlotPropertiesService()

    // Act
    const weight = await service.getWeight(invalidArmorInventorySlot)

    // Assert
    expect(weight.success).toBe(false)
    expect(weight.failureMessage).toBe('Item "invalid" not found.')
  })
})