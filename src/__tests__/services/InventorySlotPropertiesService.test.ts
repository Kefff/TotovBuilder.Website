import { describe, expect, it } from 'vitest'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import { ak12PistolGrip, ak12Stock, alpha, ammo545bp, ammo545us, armbandBlue, armor6b13FlDefault, bansheeDefault, cultLocust, lshZ2dtm, lshZ2dtmFs, monocletePe, ms2000, paca, plate6b33Back, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, scavVest, specterDr } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

const inventorySlot1: IInventorySlot = {
  items: [
    {
      content: [],
      ignorePrice: false,
      itemId: lshZ2dtm.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: lshZ2dtmFs.id,
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
          itemId: ammo545us.id,
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: rpk16Default.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: ak12PistolGrip.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk16DustCover.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16RsBase.id,
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: rpk16Rs.id,
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
                itemId: ammo545us.id,
                modSlots: [],
                quantity: 95
              }
            ],
            ignorePrice: false,
            itemId: rpk16Drum.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_magazine'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: rpk16Tube.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: ak12Stock.id,
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
            itemId: rpk16Handguard.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Rail.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_mount_000'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Rail.id,
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
            itemId: rpk1615inch.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16MuzzleBreak.id,
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
          itemId: ms2000.id,
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: alpha.id,
      modSlots: [],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: specterDr.id,
      modSlots: [],
      quantity: 1
    }
  ]
}

const inventorySlot4: IInventorySlot = {
  typeId: 'tacticalRig',
  items: [
    {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: ms2000.id,
          modSlots: [],
          quantity: 1
        }
      ],
      ignorePrice: false,
      itemId: bansheeDefault.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: monocletePe.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'front_plate'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: monocletePe.id,
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'back_plate'
        }
      ],
      quantity: 1
    }
  ]
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

describe('getArmorModifiers()', () => {
  it.each([
    [
      {
        items: [
          {
            content: [],
            itemId: armor6b13FlDefault.id,
            ignorePrice: false,
            modSlots: [
              {
                item: {
                  content: [],
                  itemId: cultLocust.id,
                  ignorePrice: false,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'front_plate'
              },
              {
                item: {
                  content: [],
                  itemId: plate6b33Back.id,
                  ignorePrice: false,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'back_plate'
              }
            ],
            quantity: 1
          }
        ],
        typeId: 'bodyArmor'
      } as IInventorySlot,
      {
        armorClass: cultLocust.armorClass,
        durability: cultLocust.durability
      } as IArmorModifiers
    ],
    [
      {
        items: [
          {
            content: [],
            itemId: paca.id,
            ignorePrice: false,
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'bodyArmor'
      } as IInventorySlot,
      {
        armorClass: 2,
        durability: 0
      } as IArmorModifiers
    ],
    [
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: bansheeDefault.id,
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: cultLocust.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'front_plate'
              },
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: monocletePe.id,
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'back_plate'
              }
            ],
            quantity: 1
          }
        ],
        typeId: 'tacticalRig'
      } as IInventorySlot,
      {
        armorClass: cultLocust.armorClass,
        durability: cultLocust.durability
      } as IArmorModifiers
    ],
    [
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: scavVest.id,
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'tacticalRig'
      } as IInventorySlot,
      {
        armorClass: 0,
        durability: 0
      } as IArmorModifiers
    ],
    [
      {
        items: [
          {
            content: [],
            ignorePrice: false,
            itemId: armbandBlue.id,
            modSlots: [],
            quantity: 1
          }
        ],
        typeId: 'armband'
      } as IInventorySlot,
      {
        armorClass: 0,
        durability: 0
      } as IArmorModifiers
    ],
    [
      {
        items: [
          undefined
        ],
        typeId: 'bodyArmor'
      } as IInventorySlot,
      {
        armorClass: 0,
        durability: 0
      } as IArmorModifiers
    ]
  ])('should get the armor modifiers of an armor or vest inventory slot', async (inventorySlot: IInventorySlot, expected: IArmorModifiers) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const armorModifiersResult = await service.getArmorModifiers(inventorySlot)

    // Assert
    expect(armorModifiersResult).not.toBeUndefined()
    expect(armorModifiersResult!.success).toBe(true)
    expect(armorModifiersResult!.value).toStrictEqual(expected)
  })
})

describe('getErgonomics()', () => {
  it.each([
    [inventorySlot2, 38],
    [inventorySlot1, undefined],
    [
      {
        typeId: 'onSling',
        items: []
      } as IInventorySlot,
      undefined
    ]
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
    const ergonomics = await service.getErgonomics({
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
    })

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
      inventorySlot4,
      {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: -0.03,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: -0.03,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: -0.01
      }
    ],
    [
      inventorySlot2,
      undefined
    ],
    [
      {
        items: [undefined],
        typeId: 'headwear'
      },
      {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: 0,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: 0,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: 0
      } as IWearableModifiers
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
    const wearableModifiersResult = await service.getWearableModifiers({
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
    })

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
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 93298,
          valueInMainCurrency: 93298
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 93298,
            valueInMainCurrency: 93298
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      inventorySlot2,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 76779,
          valueInMainCurrency: 76779
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 76779,
            valueInMainCurrency: 76779
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
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
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 1078651,
          valueInMainCurrency: 1078651
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'EUR',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 95,
            valueInMainCurrency: 15105
          },
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 7437,
            valueInMainCurrency: 1063546
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        items: [undefined],
        typeId: 'pockets'
      },
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
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
          quest: undefined,
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
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo545bp.id,
          modSlots: [],
          quantity: 1
        }
      ],
      typeId: 'pockets'
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
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
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
        quest: undefined,
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
    const price = await service.getPrice(
      {
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
      },
      true)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getRecoil()', () => {
  it.each([
    [inventorySlot2, { horizontalRecoil: 226.44, verticalRecoil: 76.16 }],
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
    const recoil = await service.getRecoil({
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
    })

    // Assert
    expect(recoil?.success).toBe(false)
    expect(recoil?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getWeight()', () => {
  it.each([
    [
      inventorySlot1,
      4.4
    ],
    [
      inventorySlot4,
      5.93
    ],
    [
      {
        items: [undefined],
        typeId: 'pockets'
      },
      0
    ]
  ])('should get the weight of an inventory slot', async (inventorySlot: IInventorySlot, expected: number) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    const service = new InventorySlotPropertiesService()

    // Act
    const weight = await service.getWeight(inventorySlot)

    // Assert
    expect(weight.success).toBe(true)
    expect(weight.value).toBe(expected)
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    const service = new InventorySlotPropertiesService()

    // Act
    const weight = await service.getWeight({
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
    })

    // Assert
    expect(weight.success).toBe(false)
    expect(weight.failureMessage).toBe('Item "invalid" not found.')
  })
})