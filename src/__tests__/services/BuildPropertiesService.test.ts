/* eslint-disable no-irregular-whitespace */
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import Result from '../../utils/Result'
import { build1, build2 } from '../__data__/buildMocks'
import { armor6b13FlDefault, bansheeDefault, ekp802dt, nf30mm, opSksDefault, opSksDt, pso1, rpk16Default, rpk16DustCover, rpk16Handguard, rpk16Rail, rpk16Rs, rpk16RsBase, scavVest, specterDr } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'

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

describe('getAsString()', () => {
  it.each([
    [build1, expectedToString1],
    [build2, expectedToString2]
  ])('should convert a build to a string', (build: IBuild, expected: string) => {
    // Arrange
    const service = new BuildPropertiesService()

    // Act
    const result = service.getAsString(build, 'fr')

    // Assert
    expect(result).toBe(expected)
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

const expectedToString1 = `Build 1
348 012₽
Recoil: 76v 226h    |    Armor: 4    |    Ergo: 34 (-9.5%)    |    Speed: -6%    |    Turn: -9%    |    Weight: 21.753kg

[On sling] RPK-16 5.45x39 light machine gun Default    |    Marché: 43 345₽
    [Chargeur] RPK-16 5.45x39 95-round drum magazine    |    Prapor 3 (barter): 24 218₽
        95 x 5.45x39mm US gs    |    Prapor 1: 9 120₽
[Body armor] 6B13 assault armor (Digital Flora) Default    |    Ragman 2: 64 269₽
[Headwear] BNTI LShZ-2DTM helmet (Black)    |    Marché: 63 493₽
    [Equipment] LShZ-2DTM face shield    |    Ragman 3 (barter): 29 805₽
[Pocket] Morphine injector    |    Marché: 17 421₽
[Pocket] Vaseline balm    |    Marché: 27 714₽
[Pocket] RGD-5 hand grenade    |    Prapor 3: 11 822₽
[Pocket] 60 x 5.45x39mm US gs    |    Prapor 1: 5 760₽
[Backpack] WARTECH Berkut BB-102 backpack (A-TACS FG)    |    Ragman 2: 24 509₽
[Face cover] Cold Fear infrared balaclava    |    Ragman 2: 4 793₽
[Eyewear] Crossbow tactical glasses    |    Ragman 2: 3 885₽

Created with Totov Builder
Interactive build:`

const expectedToString2 = `Build 2
412$ and 125 163₽ (= 181 346₽)
Recoil: 368v 255h    |    Armor: 4    |    Ergo: 52 (-3%)    |    Speed: -3%    |    Turn: -1%    |    Weight: 8.336kg

[Holster] Beretta M9A3 9x19 pistol Default [Peacekeeper 1: 75$ (= 8 025₽)]
    [Bouche] SIG Sauer SRD9 9x19 sound suppressor    |    Peacekeeper 2: 242$ (= 34 606₽)
    [Chargeur]
        17 x 9x19mm Green Tracer    |    Mechanic 1: 1 241₽
    [Tactical mod] SureFire X400 Ultra tactical flashlight with laser    |    Peacekeeper 2: 95$ (= 13 552₽)
[Tactical rig] Shellback Tactical Banshee plate carrier (A-TACS AU) Default    |    Ragman 3 (barter): 59 790₽
[Earpiece] Walker's Razor Digital headset    |    Marché: 64 132₽
[Pouch] Secure container alpha
[Scabbard] 6Kh5 Bayonet

Created with Totov Builder
Interactive build:`