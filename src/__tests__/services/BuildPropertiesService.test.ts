import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
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
import { ammo545bp, armor6b13FlDefault, bansheeDefault, berkut, ekp802dt, nf30mm, opSksDefault, opSksDt, paca, pso1, rpk16, rpk16Default, rpk16DustCover, rpk16Handguard, rpk16Rail, rpk16Rs, rpk16RsBase, scavVest, specterDr } from '../__data__/itemMocks'
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
                itemId: opSksDefault.id,
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
      `build:123456789/slot:onSling_0/item:${opSksDefault.id}/mod:mod_mount/item:${opSksDt.id}/mod:mod_scope`,
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
      useItemServiceMock()
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

describe('getArmorModifiers()', () => {
  it.each([
    [
      build1,
      {
        armorClass: 4,
        durability: 50
      } as IArmorModifiers
    ],
    [
      {
        id: '',
        name: '',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: paca.id,
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: 'bodyArmor'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      },
      {
        armorClass: 2,
        durability: 0
      } as IArmorModifiers
    ],
    [
      build2,
      {
        armorClass: 4,
        durability: 40
      } as IArmorModifiers
    ],
    [
      {
        id: '',
        name: 'Build 3',
        inventorySlots: [
          {
            items: [undefined],
            typeId: 'bodyArmor'
          },
          {
            items: [undefined],
            typeId: 'tacticalRig'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      } as IBuild,
      {
        armorClass: 0,
        durability: 0
      } as IArmorModifiers
    ],
    [
      {
        id: '',
        name: '',
        inventorySlots: [
          {
            items: [undefined],
            typeId: 'bodyArmor'
          },
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
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      } as IBuild,
      {
        armorClass: 0,
        durability: 0
      } as IArmorModifiers
    ],
    [
      {
        id: '',
        name: '',
        inventorySlots: [
          {
            items: [undefined],
            typeId: 'bodyArmor'
          },
          {
            items: [undefined],
            typeId: 'tacticalRig'
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      } as IBuild,
      {
        armorClass: 0,
        durability: 0
      } as IArmorModifiers
    ]
  ])('should get the armor modifiers of an armor or vest in a build', async (build: IBuild, expected: IArmorModifiers) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotPropertiesService)
    Services.configure(ItemPropertiesService)

    const service = new BuildPropertiesService()

    // Act
    const armorModifiersResult = await service.getArmorModifiers(build)

    // Assert
    expect(armorModifiersResult).not.toBeUndefined()
    expect(armorModifiersResult!.success).toBe(true)
    expect(armorModifiersResult!.value).toStrictEqual(expected)
  })

  it.each(
    [
      [
        {
          id: '',
          name: '',
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
          lastWebsiteVersion: undefined
        } as IBuild
      ],
      [
        {
          id: '',
          name: '',
          inventorySlots: [
            {
              items: [undefined],
              typeId: 'bodyArmor'
            },
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
              typeId: 'tacticalRig'
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined
        } as IBuild
      ]
    ]
  )('should fail when an item cannot be found', async (build: IBuild) => {
    // Arrange
    useItemServiceMock()
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotPropertiesService)
    Services.configure(ItemPropertiesService)

    const service = new BuildPropertiesService()

    // Act
    const armorModifiersResult = await service.getArmorModifiers(build)

    // Assert
    expect(armorModifiersResult.success).toBe(false)
    expect(armorModifiersResult.failureMessage).toBe('Item "invalid" not found.')
  })
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
        ergonomicsPercentageModifierWithMods: -0.09500000000000001,
        movementSpeedPercentageModifier: 0,
        movementSpeedPercentageModifierWithMods: -0.060000000000000005,
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
      expect(wearableModifiersResult.value).toStrictEqual(expected)
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
          value: 366019,
          valueInMainCurrency: 366019
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 366019,
            valueInMainCurrency: 366019
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
          value: 247747,
          valueInMainCurrency: 247747
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 444,
            valueInMainCurrency: 63495
          },
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 184252,
            valueInMainCurrency: 184252
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
        expect(recoil?.value).toStrictEqual(expected)
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
    [build2, 8.936000000000002]
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