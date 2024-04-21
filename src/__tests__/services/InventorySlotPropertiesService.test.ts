import { describe, expect, it } from 'vitest'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IRecoil } from '../../models/utils/IRecoil'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../services/InventorySlotService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import { ak12PistolGrip, ak12Stock, ammo545bp, ammo545us, armbandBlue, armor6b13FlDefault, bansheeDefault, cultLocust, lshZ2dtm, lshZ2dtmFs, monocletePe, ms2000, paca, plate6b33Back, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, scavVest, specterDr, srd9 } from '../__data__/itemMocks'
import { useGlobalFilterServiceMock } from '../__mocks__/GlobalFilterServiceMock'
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
  typeId: 'pockets',
  items: [
    {
      content: [],
      ignorePrice: false,
      itemId: ms2000.id,
      modSlots: [],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: specterDr.id,
      modSlots: [],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: srd9.id,
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

describe('getSummary()', () => {
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
      }
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
      }
    ]
  ])('should get the armor modifiers of an armor or vest inventory slot', async (inventorySlot: IInventorySlot, expected: IArmorModifiers) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.armorModifiers).toStrictEqual(expected)
  })

  it('should not get armor modifiers if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary({
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
    expect(summary.wearableModifiers).toStrictEqual({
      ergonomicsPercentageModifier: 0,
      movementSpeedPercentageModifier: 0,
      turningSpeedPercentageModifier: 0
    })
  })

  it.each([
    [inventorySlot2, 38],
    [inventorySlot1, 0],
    [
      {
        typeId: 'onSling',
        items: []
      } as IInventorySlot,
      0
    ]
  ])('should get the ergonomics of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: number) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.ergonomics).toBe(expected)
  })

  it('should not get ergonomics if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary({
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
    expect(summary.ergonomics).toBe(0)
  })

  it.each([
    [
      inventorySlot1,
      {
        missingPrice: false,
        priceInMainCurrency: 93298,
        priceByCurrency: [
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
        ]
      } as IInventoryPrice
    ],
    [
      inventorySlot2,
      {
        missingPrice: false,
        priceInMainCurrency: 76779,
        priceByCurrency: [
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
        ]
      } as IInventoryPrice
    ],
    [
      inventorySlot3,
      {
        missingPrice: false,
        priceInMainCurrency: 89597,
        priceByCurrency: [
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
            value: 521,
            valueInMainCurrency: 74492
          }
        ]
      } as IInventoryPrice
    ],
    [
      {
        items: [undefined],
        typeId: 'pockets'
      },
      {
        missingPrice: false,
        priceInMainCurrency: 0,
        priceByCurrency: []
      } as IInventoryPrice
    ]
  ])('should get the price of an inventory slot', async (inventorySlot: IInventorySlot, expected: IInventoryPrice) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.price).toStrictEqual(expected)
  })

  it('should have a missing price when no merchants sell the item', async () => {
    // Arrange
    useGlobalFilterServiceMock()
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
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
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.price).toStrictEqual({
      missingPrice: true,
      priceInMainCurrency: 0,
      priceByCurrency: []
    } as IInventoryPrice)
  })

  it('should not get a price if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)
    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(
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
      })

    // Assert
    expect(summary.price).toStrictEqual({
      missingPrice: false,
      priceInMainCurrency: 0,
      priceByCurrency: []
    } as IInventoryPrice)
  })

  it.each([
    [
      inventorySlot2,
      {
        horizontalRecoil: 226.44,
        verticalRecoil: 76.16
      } as IRecoil
    ],
    [
      inventorySlot1,
      {
        horizontalRecoil: 0,
        verticalRecoil: 0
      } as IRecoil
    ],
    [
      {
        typeId: 'onSling',
        items: []
      } as IInventorySlot,
      {
        horizontalRecoil: 0,
        verticalRecoil: 0
      } as IRecoil
    ]
  ])('should get the recoil of a ranged weapon inventory slot', async (inventorySlot: IInventorySlot, expected: IRecoil) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.recoil).toStrictEqual(expected)
  })

  it('should not get the recoil if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary({
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
    expect(summary.recoil).toStrictEqual({
      horizontalRecoil: 0,
      verticalRecoil: 0
    } as IRecoil)
  })

  it.each([
    [
      inventorySlot1,
      {
        ergonomicsPercentageModifier: -0.05,
        movementSpeedPercentageModifier: 0,
        turningSpeedPercentageModifier: -0.08
      } as IWearableModifiers
    ],
    [
      inventorySlot4,
      {
        ergonomicsPercentageModifier: -0.03,
        movementSpeedPercentageModifier: -0.03,
        turningSpeedPercentageModifier: -0.01
      }
    ],
    [
      inventorySlot2,
      {
        ergonomicsPercentageModifier: 0,
        movementSpeedPercentageModifier: 0,
        turningSpeedPercentageModifier: 0
      } as IWearableModifiers
    ],
    [
      {
        items: [undefined],
        typeId: 'headwear'
      },
      {
        ergonomicsPercentageModifier: 0,
        movementSpeedPercentageModifier: 0,
        turningSpeedPercentageModifier: 0
      } as IWearableModifiers
    ]
  ])('should get the wearable modifiers of an inventory slot', async (inventorySlot: IInventorySlot, expected: IWearableModifiers) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.wearableModifiers).toStrictEqual(expected)
  })

  it('should not get wearable modifiers if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary({
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
    expect(summary.wearableModifiers).toStrictEqual({
      ergonomicsPercentageModifier: 0,
      movementSpeedPercentageModifier: 0,
      turningSpeedPercentageModifier: 0
    })
  })

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
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary(inventorySlot)

    // Assert
    expect(summary.weight).toBe(expected)
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)

    const service = new InventorySlotPropertiesService()

    // Act
    const summary = await service.getSummary({
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
    expect(summary.weight).toBe(0)
  })
})