import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IRecoil } from '../../models/utils/IRecoil'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
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

describe('getSummary()', () => {
  describe.only('Armor modifiers', () => {
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
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventorySlotService)
      Services.configure(ItemPropertiesService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary(build)

      // Assert
      expect(summary.armorModifiers).toStrictEqual(expected)
    })

    it('should not get an armor modifiers when no body armor nor vest summaries are found', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventorySlotService)
      Services.configure(ItemPropertiesService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary({
        id: 'build1',
        name: 'Build 1',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      })

      // Assert
      expect(summary.armorModifiers).toStrictEqual({
        armorClass: 0,
        durability: 0
      } as IArmorModifiers)
    })
  })

  describe('Ergonomics', () => {
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
      ]
    ])(
      'should get the ergonomics of the main ranged weapon of a build',
      async (build: IBuild, expected: number) => {
        // Arrange
        useItemServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(ItemPropertiesService)
        Services.configure(InventorySlotService)
        Services.configure(InventorySlotPropertiesService)
        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.ergonomics).toBe(expected)
      }
    )

    it.each([
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
        } as IBuild
      ],
      [
        {
          name: 'Empty build',
          id: 'EmptyBuild',
          inventorySlots: [],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined
        } as IBuild
      ]
    ])('should not get the ergonomics of the main ranged when the build contains not ranged weapon', async (build: IBuild) => {
      // Arrange
      useItemServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)
      Services.configure(InventorySlotService)
      Services.configure(InventorySlotPropertiesService)
      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary(build)

      // Assert
      expect(summary.ergonomics).toBe(0)
    })
  })

  describe('Price', () => {
    it.each([
      [
        build1,
        {
          missingPrice: false,
          priceInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 366019,
            valueInMainCurrency: 366019
          },
          priceByCurrency: [
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
          ]
        } as IInventoryPrice
      ],
      [
        build2,
        {
          missingPrice: false,
          priceInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 247747,
            valueInMainCurrency: 247747
          },
          priceByCurrency: [
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
          ]
        } as IInventoryPrice
      ],
      [
        {
          id: 'EmptyBuild',
          name: 'Empty build',
          inventorySlots: [],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined
        } as IBuild,
        {
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: '',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          priceInMainCurrency: {
            barterItems: [],
            currencyName: '',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          priceByCurrency: [],
          unitPrice: {
            barterItems: [],
            currencyName: '',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          }
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
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.price).toStrictEqual(expected)
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
      const summary = await service.getSummary(build)

      // Assert
      expect(summary.price).toStrictEqual({
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
        priceInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 24509,
          valueInMainCurrency: 24509
        },
        priceByCurrency: [
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
        }
      } as IInventoryPrice)
    })

    it('should not get the price when the main currency cannot be found', async () => {
      // Arrange
      useItemServiceMock(false)
      Services.configure(InventorySlotPropertiesService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary(build1)

      // Assert
      expect(summary.price).toStrictEqual({
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: '',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceInMainCurrency: {
          barterItems: [],
          currencyName: '',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        priceByCurrency: [],
        unitPrice: {
          barterItems: [],
          currencyName: '',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        }
      } as IInventoryPrice)
    })
  })

  describe('Recoil', () => {
    it.each([
      [
        build1,
        {
          horizontalRecoil: 226.44,
          verticalRecoil: 76.16
        } as IRecoil
      ],
      [
        build2,
        {
          horizontalRecoil: 254.8,
          verticalRecoil: 367.64
        } as IRecoil
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
        {
          horizontalRecoil: 0,
          verticalRecoil: 0
        } as IRecoil
      ]
    ])(
      'should get the recoil of the first ranged weapon found in the on sling, on back or holter inventory slots of a build',
      async (build: IBuild, expected: IRecoil) => {
        // Arrange
        useItemServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.recoil).toStrictEqual(expected)
      }
    )

    it('should not get the recoil when an item cannot be found', async () => {
      // Arrange
      useItemServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventorySlotService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary(
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
      expect(summary.recoil).toStrictEqual({
        horizontalRecoil: 0,
        verticalRecoil: 0
      } as IRecoil)
    })
  })

  describe('Weight', () => {
    it.each([
      [
        build1,
        24.153
      ],
      [
        build2,
        8.936000000000002
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
        0
      ]
    ])(
      'should get the weight of a build',
      async (build: IBuild, expected: number) => {
        // Arrange
        useItemServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.weight).toBe(expected)
      }
    )
  })

  describe('Wearable modifiers', () => {
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
      ],
      [
        {
          id: 'EmptyBuild',
          inventorySlots: [],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'Empty build'
        } as IBuild,
        {
          ergonomicsPercentageModifier: 0,
          ergonomicsPercentageModifierWithMods: 0,
          movementSpeedPercentageModifier: 0,
          movementSpeedPercentageModifierWithMods: 0,
          turningSpeedPercentageModifier: 0,
          turningSpeedPercentageModifierWithMods: 0
        } as IWearableModifiers
      ]
    ])(
      'should get the wearable modifiers of a build',
      async (build: IBuild, expected: IWearableModifiers) => {
        // Arrange
        useItemServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.wearableModifiers).toStrictEqual(expected)
      })
  })
})