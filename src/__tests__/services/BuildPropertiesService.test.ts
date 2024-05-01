/* eslint-disable no-irregular-whitespace */
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../services/InventorySlotService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import Result from '../../utils/Result'
import { build1, build2 } from '../__data__/buildMocks'
import { armor6b13FlDefault, bansheeDefault, ekp802dt, nf30mm, opSksDefault, opSksDt, pso1, rpk16Default, rpk16DustCover, rpk16Handguard, rpk16Rail, rpk16Rs, rpk16RsBase, scavVest, specterDr } from '../__data__/itemMocks'
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

describe('getAsString()', () => {
  it.each([
    [build1, expectedToString1],
    [build2, expectedToString2]
  ])('should convert a build to a string', async (build: IBuild, expected: string) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)
    Services.configure(GlobalFilterService)
    Services.configure(InventoryItemService)
    Services.configure(InventorySlotPropertiesService)
    Services.configure(InventorySlotService)
    Services.configure(ItemPropertiesService)
    Services.configure(ReductionService)

    const service = new BuildPropertiesService()

    // Act
    const result = await service.getAsString(build, 'fr')

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
Recul vertical: 76    |    Recul horizontal: 226    |    Ergonomie: 34 (-9,5%)
Armure: 4    |    Vitesse: -6%    |    Vitesse de rotation: -9%
Prix: 366 019₽    |    Poids: 24,153kg

[En bandouillère] RPK-16 5.45x39 light machine gun Default    |    Marché: 43 345₽
    [Chargeur] RPK-16 5.45x39 95-round drum magazine    |    Prapor 3 (échange): 24 218₽
        95 x 5.45x39mm US gs    |    Prapor 1: 9 120₽
[Pare-balles] 6B13 assault armor (Flora) Default    |    Ragman 2: 64 269₽
[Couvre-chef] BNTI LShZ-2DTM helmet (Black)    |    Marché: 63 493₽
    [Équipement] LShZ-2DTM face shield    |    Ragman 3 (échange): 29 805₽
[Poches] Morphine injector    |    Marché: 17 421₽
[Poches] Vaseline balm    |    Marché: 27 714₽
[Poches] RGD-5 hand grenade    |    Prapor 3: 11 822₽
[Poches] 60 x 5.45x39mm US gs    |    Prapor 1: 5 760₽
[Sac à dos] WARTECH Berkut BB-102 backpack (A-TACS FG)    |    Ragman 2: 24 509₽
    Iskra ration pack    |    Jaeger 2: 24 392₽
    Bottle of water (0.6L)    |    La Toubib 1 (échange): 11 473₽
[Masque] Cold Fear infrared balaclava    |    Ragman 2: 4 793₽
[Lunettes] Crossbow tactical glasses    |    Ragman 2: 3 885₽

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAK6BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOgqVu58gCOQB3_lygItavScD6KETjsnnqqDlYa8teT26vMr7mcA4yJzLaCaKHfPnnQM4LV5edlloSISmpvJN3hlYvrz74DQyinjTwOr26OE9Lnqe7m55nUc1D6Xfe96wXdgNVhx1u8PO2ZlQ9ijOUvKKJjWrfnb3Y_z_HX9VZ0tc-GC8TifY5MzhZfr2mwp-SnV4lSZ91gfE5MsR7GcSvroCe9Nwn41ZhdEGt-z_Lb8j_gCygg`

const expectedToString2 = `Build 2
Recul vertical: 368    |    Recul horizontal: 255    |    Ergonomie: 52 (-3%)
Armure: 4    |    Vitesse: -3%    |    Vitesse de rotation: -1%
Prix: 444$ et 184 252₽ (= 247 747₽)    |    Poids: 8,936kg

[Holster] Beretta M9A3 9x19 pistol Default    |    Peacekeeper 1: 107$ (= 15 337₽)
    [Canon] 
        [Bouche] SIG Sauer SRD9 9x19 sound suppressor    |    Peacekeeper 2: 242$ (= 34 606₽)
    [Chargeur] 
        17 x 9x19mm Green Tracer    |    Le Mécano 1: 1 241₽
    [Dispositif tactique] SureFire X400 Ultra tactical flashlight with laser    |    Peacekeeper 2: 95$ (= 13 552₽)
[Gilet tactique] Shellback Tactical Banshee plate carrier (A-TACS AU)    |    Marché: 33 950₽
    [Plaque frontale] Monoclete level III PE ballistic plate    |    Peacekeeper 3 (échange): 31 503₽
    [Plaque dorsale] Monoclete level III PE ballistic plate    |    Peacekeeper 3 (échange): 31 503₽
    Salewa first aid kit    |    La Toubib 1 (échange): 21 923₽
[Dispositif audio] Walker's Razor Digital headset    |    Marché: 64 132₽
[Pochette] Secure container Alpha
[Fourreau] 6Kh5 Bayonet

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAL-AgAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGtZFQI4nHXyvXeCkGDnE2yJSmmd0bDcQmx-3C2F32vOjYAWw23ezEFu9AKFIKbj4FojTuE3p0k5O-4x8UQPdF8MZxt6uQN2iguqmpNUwuma3GHEITztjySMh4BZzRXIxDIuifBYqAV3UKCQgbyu7ExKnBNb_JsU6NpGDPtI5Sv5sP_rxAFv`