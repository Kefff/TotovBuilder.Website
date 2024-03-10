import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IMod } from '../../models/item/IMod'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../services/InventorySlotService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import Result from '../../utils/Result'
import { build1, build2 } from '../__data__/buildMocks'
import { ItemMocks, ammo545bp, armor6b13FlDefault, bansheeDefault, berkut, rpk16, rpk16Default, rpk16DustCover, rpk16Handguard, rpk16Rail, rpk16Rs, rpk16RsBase, scavVest } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('canAddArmor()', () => {
  it.each([
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'backpack',
            items: [] as IInventoryItem[]
          }
        ]
      } as IBuild,
      {
        failureContext: 'BuildService.canAddArmor()',
        failureMessage: 'Cannot find mod slot "tacticalRig".',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [undefined] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: 'invalid',
                modSlots: [],
                quantity: 1
              }
            ] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: scavVest.id,
                modSlots: [],
                quantity: 1
              }
            ] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'tacticalRig',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: bansheeDefault.id,
                modSlots: [],
                quantity: 1
              }
            ] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      {
        failureContext: 'BuildService.canAddArmor()',
        failureMessage:
          'Cannot select a body armor because an armored tactical rig has already been added.',
        success: false
      } as Result
    ]
  ])(
    'should check if an armor can be added to the build',
    async (build: IBuild, expected: Result) => {
      // Arrange
      useItemServiceMock()
      const service = new BuildPropertiesService()

      // Act
      const result = await service.canAddArmor(build)

      // Assert
      expect(result).toEqual(expected)
    }
  )
})

describe('canAddMod()', () => {
  it.each([
    [
      {} as IBuild,
      'invalid',
      `build:123456789/slot:onSling_0/item:${rpk16Default.id}/mod:mod_handguard/item:${rpk16Handguard.id}/mod_mount_000`,
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false,
        value: undefined
      } as Result
    ],
    [
      {
        id: '123456789',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'build1'
      } as IBuild,
      rpk16Rail.id,
      `build:123456789/slot:onSling_0/item:${rpk16Default.id}/invalid`,
      {
        failureContext: 'PathUtils.getInventorySlotItem()',
        failureMessage: 'Cannot find inventory slot "onSling".',
        success: false,
        value: undefined
      } as Result
    ],
    [
      {
        id: '123456789',
        inventorySlots: [
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
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'build1'
      } as IBuild,
      rpk16Rail.id,
      `build:123456789/slot:onSling_0/item:invalid/mod:mod_handguard/item:${rpk16Handguard.id}/mod_mount_000`,
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false,
        value: undefined
      } as Result
    ],
    [
      {
        id: '123456789',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rpk16Default.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: rpk16DustCover.id,
                      ignorePrice: false,
                      modSlots: [
                        {
                          item: {
                            content: [],
                            itemId: rpk16RsBase.id,
                            ignorePrice: false,
                            modSlots: [
                              {
                                item: {
                                  content: [],
                                  itemId: rpk16Rs.id,
                                  ignorePrice: false,
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
                  }
                ],
                quantity: 1
              }
            ],
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'buil1'
      } as IBuild,
      nf30mm.id, // Conflicts with rpk16RsBase
      `build:123456789/slot:onSling_0/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}/mod_scope`,
      {
        failureContext: 'BuildService.canAddMod()',
        failureMessage:
          'Cannot add mod "Nightforce Magmount 30mm ring scope mount" because it conflicts with item "RPK-16 rear sight base".',
        success: false
      } as Result
    ],
    [
      {
        id: '123456789',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rpk16Default.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      itemId: rpk16DustCover.id,
                      ignorePrice: false,
                      modSlots: [
                        {
                          item: {
                            content: [],
                            itemId: rpk16RsBase.id,
                            ignorePrice: false,
                            modSlots: [
                              {
                                item: {
                                  content: [],
                                  itemId: rpk16Rs.id,
                                  ignorePrice: false,
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
                  }
                ],
                quantity: 1
              }
            ],
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'buil1'
      } as IBuild,
      specterDr.id, // No conflict
      `build:123456789/slot:onSling_0/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}/mod_scope`,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '123456789',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: opSks.id,
                modSlots: [
                  {
                    item: {
                      content: [],
                      ignorePrice: false,
                      itemId: opSksDt.id,
                      modSlots: [
                        {
                          item: {
                            content: [],
                            ignorePrice: false,
                            itemId: ekp802dt.id,
                            modSlots: [],
                            quantity: 1
                          },
                          modSlotName: 'mod_scope'
                        }
                      ],
                      quantity: 1
                    },
                    modSlotName: 'mod_mount'
                  }
                ],
                quantity: 1
              }
            ],
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'buil1'
      } as IBuild,
      pso1.id, // Conflicts with the item it replaces, so the conflict is ignored
      `build:123456789/slot:onSling_0/item:${opSks.id}/mod:mod_mount/item:${opSksDt.id}/mod:mod_scope`,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ]
  ])(
    'should check if a mod can be added to an item',
    async (build: IBuild, modId: string, modSlotPath: string, expected: Result) => {
      // Arrange
      useItemServiceMock(true, [...ItemMocks, ekp802dt, nf30mm, opSks, opSksDt, pso1, specterDr])
      const service = new BuildPropertiesService()

      // Act
      const result = await service.canAddMod(build, modId, modSlotPath)

      // Assert
      expect(result).toEqual(expected)
    }
  )
})

describe('canAddVest()', () => {
  it.each([
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: armor6b13FlDefault.id,
                modSlots: [],
                quantity: 1
              }
            ] as IInventoryItem[]
          }
        ]
      } as IBuild,
      'invalid',
      {
        failureContext: 'ItemService.getItem()',
        failureMessage: 'Item "invalid" not found.',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: armor6b13FlDefault.id,
                modSlots: [],
                quantity: 1
              }
            ] as IInventoryItem[]
          }
        ]
      } as IBuild,
      scavVest.id,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'backpack',
            items: [undefined] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      bansheeDefault.id,
      {
        failureContext: 'BuildService.canAddVest()',
        failureMessage: 'Cannot find mod slot "bodyArmor".',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: armor6b13FlDefault.id,
                modSlots: [],
                quantity: 1
              }
            ] as IInventoryItem[]
          }
        ]
      } as IBuild,
      bansheeDefault.id,
      {
        failureContext: 'BuildService.canAddVest()',
        failureMessage:
          'Cannot select an armored tactical rig because a body armor has already been added.',
        success: false
      } as Result
    ],
    [
      {
        id: '',
        inventorySlots: [
          {
            typeId: 'bodyArmor',
            items: [undefined] as (IInventoryItem | undefined)[]
          }
        ]
      } as IBuild,
      bansheeDefault.id,
      {
        failureContext: '',
        failureMessage: '',
        success: true
      } as Result
    ]
  ])(
    'should check if a vest can be added to the build',
    async (build: IBuild, vestId: string, expected: Result) => {
      // Arrange
      useItemServiceMock()
      const service = new BuildPropertiesService()

      // Act
      const result = await service.canAddVest(build, vestId)

      // Assert
      expect(result).toEqual(expected)
    }
  )
})

describe('getErgonomics()', () => {
  it.each([
    [build1, 38],
    [build2, 54],
    [
      {
        id: 'build3',
        inventorySlots: [
          {
            typeId: 'onBack',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rpk16.id,
                modSlots: [],
                quantity: 1
              }
            ]
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 3'
      } as IBuild,
      45
    ],
    [
      {
        name: 'Empty build',
        id: 'EmptyBuild',
        inventorySlots: [
          {
            typeId: 'onSling',
            items: []
          },
          {
            typeId: 'onBack',
            items: [undefined]
          },
          {
            typeId: 'holster',
            items: [null]
          }
        ]
      } as IBuild,
      undefined
    ]
  ])(
    'should get the ergonomics of the main ranged weapon of a build',
    async (build: IBuild, expected: number | undefined) => {
      // Arrange
      useItemServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)
      Services.configure(InventorySlotService)
      Services.configure(InventorySlotPropertiesService)
      const service = new BuildPropertiesService()

      // Act
      const ergonomics = await service.getErgonomics(build)

      // Assert
      if (expected == null) {
        expect(ergonomics).toBeUndefined()
      } else {
        expect(ergonomics?.success).toBe(true)
        expect(ergonomics?.value).toBe(expected)
      }
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(ItemPropertiesService)
    Services.configure(InventorySlotService)
    Services.configure(InventorySlotPropertiesService)
    const service = new BuildPropertiesService()

    // Act
    const ergonomics = await service.getErgonomics(
      {
        id: 'build1',
        inventorySlots: [
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
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 1'
      }
    )

    // Assert
    expect(ergonomics?.success).toBe(false)
    expect(ergonomics?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getWearableModifiers()', () => {
  it.each([
    [
      build1,
      {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: -0.095,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: -0.06,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: -0.09
      } as IWearableModifiers
    ],
    [
      build2,
      {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithMods: -0.03,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: -0.03,
        turningSpeedPercentageModifier: 0,
        turningSpeedPercentageModifierWithMods: -0.01
      } as IWearableModifiers
    ]
  ])(
    'should get the wearable modifiers of a build',
    async (build: IBuild, expected: IWearableModifiers) => {
      // Arrange
      useItemServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)
      Services.configure(InventorySlotPropertiesService)
      const service = new BuildPropertiesService()

      // Act
      const wearableModifiersResult = await service.getWearableModifiers(build)

      // Assert
      expect(wearableModifiersResult.success).toBe(true)
      expect(wearableModifiersResult.value.ergonomicsPercentageModifier.toFixed(3)).toBe(expected.ergonomicsPercentageModifier.toFixed(3))
      expect(wearableModifiersResult.value.ergonomicsPercentageModifierWithMods.toFixed(3)).toBe(expected.ergonomicsPercentageModifierWithMods.toFixed(3))
      expect(wearableModifiersResult.value.movementSpeedPercentageModifier.toFixed(3)).toBe(expected.movementSpeedPercentageModifier.toFixed(3))
      expect(wearableModifiersResult.value.movementSpeedPercentageModifierWithMods.toFixed(3)).toBe(expected.movementSpeedPercentageModifierWithMods.toFixed(3))
      expect(wearableModifiersResult.value.turningSpeedPercentageModifier.toFixed(3)).toBe(expected.turningSpeedPercentageModifier.toFixed(3))
      expect(wearableModifiersResult.value.turningSpeedPercentageModifierWithMods.toFixed(3)).toBe(expected.turningSpeedPercentageModifierWithMods.toFixed(3))
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotPropertiesService)
    const service = new BuildPropertiesService()

    // Act
    const wearableModifiersResult = await service.getWearableModifiers(
      {
        id: 'build1',
        inventorySlots: [
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
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 1'
      }
    )

    // Assert
    expect(wearableModifiersResult.success).toBe(false)
    expect(wearableModifiersResult.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getPrice()', () => {
  it.each([
    [
      build1,
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
          value: 355315,
          valueInMainCurrency: 355315
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 355315,
            valueInMainCurrency: 355315
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
      build2,
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
          value: 199636,
          valueInMainCurrency: 199636
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 199,
            valueInMainCurrency: 29048
          },
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 170588,
            valueInMainCurrency: 170588
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
    ]
  ])(
    'should get the price of a build',
    async (build: IBuild, expected: IInventoryPrice) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(GlobalFilterService)

      const service = new BuildPropertiesService()

      // Act
      const price = await service.getPrice(build)

      // Assert
      expect(price.success).toBe(true)
      expect(price.value).toStrictEqual(expected)
    }
  )

  it('should have the missing price flag when no merchants sell on of the item', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)
    const service = new BuildPropertiesService()

    const build: IBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: ammo545bp.id, // No merchant
                  modSlots: [],
                  quantity: 1
                }
              ],
              ignorePrice: false,
              itemId: berkut.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'backpack'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    }

    // Act
    const price = await service.getPrice(build)

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
        value: 24509,
        valueInMainCurrency: 24509
      },
      pricesWithContent: [
        {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 24509,
          valueInMainCurrency: 24509
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
    } as IInventoryPrice)
  })

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    useItemServiceMock(false)
    Services.configure(InventorySlotPropertiesService)

    const service = new BuildPropertiesService()

    // Act
    const price = await service.getPrice(build1)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Main currency not found.')
  })

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventoryItemService)
    Services.configure(GlobalFilterService)

    const service = new BuildPropertiesService()

    // Act
    const price = await service.getPrice({
      id: 'build1',
      inventorySlots: [
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
          typeId: 'onBack'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Build 1'
    })

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Item "invalid" not found.')
  })

  it('should fail if an inventory slot is invalid', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventorySlotPropertiesService)

    const service = new BuildPropertiesService()

    // Act
    const price = await service.getPrice({
      id: 'build1',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'invalid'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Build 1'
    })

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Inventory slot type "invalid" not found.')
  })
})

describe('getNotExportedTooltip()', () => {
  it.each([
    [undefined, undefined, 'Build not exported. It will be lost if your browser history is cleared.'],
    [new Date(1), undefined, 'Build not exported. It will be lost if your browser history is cleared.'],
    [new Date(2), new Date(1), 'Changes from the 01/01/1970 01:00:00 have not been exported. They will be lost if your browser data is cleared. Last export on 01/01/1970 01:00:00.']
  ])('should get the tooltip for not exported builds', (lastUpdated: Date | undefined, lastExported: Date | undefined, expected: string) => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const tooltip = service.getNotExportedTooltip(lastUpdated, lastExported)

    // Assert
    expect(tooltip).toBe(expected)
  })
})

describe('getRecoil()', () => {
  it.each([
    [build1, { horizontalRecoil: 226.44, verticalRecoil: 76.16 }],
    [build2, { horizontalRecoil: 254.8, verticalRecoil: 367.64 }],
    [
      {
        name: 'Empty build',
        id: 'EmptyBuild',
        inventorySlots: [
          {
            typeId: 'onSling',
            items: []
          },
          {
            typeId: 'onBack',
            items: [undefined]
          },
          {
            typeId: 'holster',
            items: [null]
          }
        ]
      } as IBuild, undefined
    ]
  ])(
    'should get the recoil of the main ranged weapon of a build',
    async (build: IBuild, expected: { horizontalRecoil: number; verticalRecoil: number } | undefined) => {
      // Arrange
      useItemServiceMock()
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)

      const service = new BuildPropertiesService()

      // Act
      const recoil = await service.getRecoil(build)

      // Assert
      if (expected == null) {
        expect(recoil).toBeUndefined()
      } else {
        expect(recoil?.success).toBe(true)
        expect(recoil?.value.horizontalRecoil.toFixed(3)).toStrictEqual(expected.horizontalRecoil.toFixed(3))
        expect(recoil?.value.verticalRecoil.toFixed(3)).toStrictEqual(expected.verticalRecoil.toFixed(3))
      }
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventoryItemService)

    const service = new BuildPropertiesService()

    // Act
    const recoil = await service.getRecoil(
      {
        id: 'build1',
        inventorySlots: [
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
            typeId: 'onSling'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 1'
      }
    )

    // Assert
    expect(recoil?.success).toBe(false)
    expect(recoil?.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getWeight()', () => {
  it.each([
    [build1, 24.153],
    [build2, 8.936]
  ])(
    'should get the weight of a build',
    async (build: IBuild, expected: number) => {
      // Arrange
      useItemServiceMock()
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventoryItemService)

      const service = new BuildPropertiesService()

      // Act
      const weight = await service.getWeight(build)

      // Assert
      expect(weight.success).toBe(true)
      expect(weight.value).toBe(expected)
    }
  )

  it('should fail if an item cannot be found', async () => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventoryItemService)

    const service = new BuildPropertiesService()

    // Act
    const weight = await service.getWeight({
      id: 'build1',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              itemId: 'invalid',
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Build 1'
    })

    // Assert
    expect(weight.success).toBe(false)
    expect(weight.failureMessage).toBe('Item "invalid" not found.')
  })
})



const ekp802dt: IRangedWeaponMod = {
  accuracyPercentageModifier: 0,
  baseItemId: undefined,
  defaultPresetId: undefined,
  ergonomicsModifier: -3,
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '591c4e1186f77410354b316e'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical',
      required: false
    }
  ],
  presetErgonomicsModifier: undefined,
  presetRecoilPercentageModifier: undefined,
  prices: [],
  recoilPercentageModifier: 0,
  categoryId: 'rangedWeaponMod',
  conflictingItemIds: [
    '5827272a24597748c74bdeea'
  ],
  iconLink: 'https://assets.tarkov.dev/5947db3f86f77447880cf76f-icon.webp',
  id: '5947db3f86f77447880cf76f',
  imageLink: 'https://assets.tarkov.dev/5947db3f86f77447880cf76f-image.webp',
  marketLink: 'https://tarkov.dev/item/axion-kobra-ekp-8-02-reflex-sight-dovetail',
  name: 'Axion Kobra EKP-8-02 reflex sight (Dovetail)',
  shortName: 'EKP-8-02 DT',
  weight: 0.273,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Axion_Kobra_EKP-8-02_reflex_sight_(Dovetail)'
}

const nf30mm: IMod = {
  baseItemId: undefined,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5b2388675acfc4771e1be0be',
        '5b3b99475acfc432ff4dcbee',
        '5a37cb10c4a282329a73b4e7',
        '57c5ac0824597754771e88a9',
        '618ba27d9008e4636a67f61d',
        '617151c1d92c473c770214ab',
        '6567e7681265c8a131069b0f'
      ],
      maxStackableAmount: 1,
      name: 'mod_scope',
      required: false
    }
  ],
  presetErgonomicsModifier: undefined,
  prices: [],
  categoryId: 'mod',
  iconLink: 'https://assets.tarkov.dev/5b3b99265acfc4704b4a1afb-icon.webp',
  id: '5b3b99265acfc4704b4a1afb',
  imageLink: 'https://assets.tarkov.dev/5b3b99265acfc4704b4a1afb-image.webp',
  marketLink: 'https://tarkov.dev/item/nightforce-magmount-30mm-ring-scope-mount',
  name: 'Nightforce Magmount 30mm ring scope mount',
  shortName: 'NF 30mm',
  weight: 0.19,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Nightforce_Magmount_30mm_ring_scope_mount'
}

const opSks: IRangedWeapon = {
  baseItemId: '587e02ff24597743df3deaeb',
  caliber: 'Caliber762x39',
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomics: 40,
  fireModes: ['SingleFire'],
  fireRate: 40,
  horizontalRecoil: 360,
  maxStackableAmount: 1,
  minuteOfAngle: 4.13,
  modSlots: [
    {
      compatibleItemIds: [
        '5d0236dad7ad1a0940739d29',
        '587e0531245977466077a0f7',
        '5afd7ded5acfc40017541f5e',
        '574dad8024597745964bf05c',
        '653ecef836fae5a82f02b869'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock',
      required: false
    },
    {
      compatibleItemIds: [
        '634eff66517ccc8a960fc735',
        '634f02331f9f536910079b51'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    },
    {
      compatibleItemIds: [
        '61695095d92c473c7702147a',
        '5c5970672e221602b21d7855',
        '587df583245977373c4f1129',
        '587df3a12459772c28142567'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '587e08ee245977446b4410cf',
        '6415d33eda439c6a97048b5b'
      ],
      maxStackableAmount: 1,
      name: 'mod_mount',
      required: false
    },
    {
      compatibleItemIds: [
        '634f06262e5def262d0b30ca',
        '634f05ca517ccc8a960fc748',
        '6415c694da439c6a97048b56'
      ],
      maxStackableAmount: 1,
      name: 'mod_reciever',
      required: false
    }
  ],
  presetErgonomics: undefined,
  presetHorizontalRecoil: undefined,
  presetVerticalRecoil: undefined,
  prices: [],
  verticalRecoil: 155,
  categoryId: 'mainWeapon',
  iconLink: 'https://assets.tarkov.dev/59dcdbb386f77417b03f350d-icon.webp',
  id: '59dcdbb386f77417b03f350d',
  imageLink: 'https://assets.tarkov.dev/59dcdbb386f77417b03f350d-image.webp',
  marketLink: 'https://tarkov.dev/item/molot-arms-simonov-op-sks-762x39-carbine-default',
  name: 'Molot Arms Simonov OP-SKS 7.62x39 carbine Default',
  shortName: 'OP-SKS Default',
  weight: 0.82,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Molot_Arms_Simonov_OP-SKS_7.62x39_carbine'
}

const opSksDt: IMod = {
  baseItemId: undefined,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5947db3f86f77447880cf76f',
        '6113d6c3290d254f5e6b27db',
        '57486e672459770abd687134',
        '5c82342f2e221644f31c060e',
        '576fd4ec2459777f0b518431',
        '5c82343a2e221644f31c0611',
        '5cf638cbd7f00c06595bc936',
        '5a7c74b3e899ef0014332c29',
        '591ee00d86f774592f7b841e',
        '618a75c9a3884f56c957ca1b',
        '57acb6222459771ec34b5cb0',
        '638db77630c4240f9e06f8b6',
        '63d114019e35b334d82302f7',
        '6544d4187c5457729210d277'
      ],
      maxStackableAmount: 1,
      name: 'mod_scope',
      required: false
    }
  ],
  presetErgonomicsModifier: undefined,
  prices: [],
  categoryId: 'mod',
  iconLink: 'https://assets.tarkov.dev/587e08ee245977446b4410cf-icon.webp',
  id: '587e08ee245977446b4410cf',
  imageLink: 'https://assets.tarkov.dev/587e08ee245977446b4410cf-image.webp',
  marketLink: 'https://tarkov.dev/item/op-sks-dovetail-mount',
  name: 'OP-SKS dovetail mount',
  shortName: 'OPSKS DT',
  weight: 0.02,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/OP-SKS_dovetail_mount'
}

const pso1: IRangedWeaponMod = {
  accuracyPercentageModifier: 0,
  baseItemId: undefined,
  defaultPresetId: undefined,
  ergonomicsModifier: -7,
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '57f3a5ae2459772b0e0bf19e'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical',
      required: false
    }
  ],
  presetErgonomicsModifier: undefined,
  presetRecoilPercentageModifier: undefined,
  prices: [],
  recoilPercentageModifier: 0,
  categoryId: 'rangedWeaponMod',
  conflictingItemIds: [
    '5827272a24597748c74bdeea',
    '58272b392459774b4c7b3ccd',
    '6113d6c3290d254f5e6b27db',
    '57486e672459770abd687134',
    '5947db3f86f77447880cf76f',
    '57acb6222459771ec34b5cb0',
    '591ee00d86f774592f7b841e'
  ],
  iconLink: 'https://assets.tarkov.dev/5c82342f2e221644f31c060e-icon.webp',
  id: '5c82342f2e221644f31c060e',
  imageLink: 'https://assets.tarkov.dev/5c82342f2e221644f31c060e-image.webp',
  marketLink: 'https://tarkov.dev/item/belomo-pso-1-4x24-scope',
  name: 'BelOMO PSO-1 4x24 scope',
  shortName: 'PSO-1',
  weight: 0.6,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/BelOMO_PSO-1_4x24_scope'
}

const specterDr: IRangedWeaponMod = {
  accuracyPercentageModifier: 0,
  baseItemId: undefined,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -4,
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [],
      maxStackableAmount: 1,
      name: 'mod_mount',
      required: false
    }
  ],
  presetErgonomicsModifier: undefined,
  presetRecoilPercentageModifier: undefined,
  prices: [],
  recoilPercentageModifier: 0,
  categoryId: 'rangedWeaponMod',
  iconLink: 'https://assets.tarkov.dev/57ac965c24597706be5f975c-icon.webp',
  id: '57ac965c24597706be5f975c',
  imageLink: 'https://assets.tarkov.dev/57ac965c24597706be5f975c-image.webp',
  marketLink: 'https://tarkov.dev/item/elcan-specterdr-1x4x-scope',
  name: 'ELCAN SpecterDR 1x/4x scope',
  shortName: 'SpecterDR',
  weight: 0.64,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/ELCAN_SpecterDR_1x/4x_scope'
}