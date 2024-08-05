/* eslint-disable no-irregular-whitespace */
import { anything, instance, mock, verify } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IShoppingListMerchant } from '../../models/utils/IShoppingListMerchant'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../services/InventorySlotService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { build1, build2 } from '../__data__/buildMocks'
import { ak12PistolGrip, ammo545bp, armor6b13FlDefault, bansheeDefault, ekp802dt, mechanism, ms2000, nf30mm, opSksDefault, opSksDt, plate6b33Back, plate6b33Front, precision, pso1, rpk16Default, rpk16DustCover, rpk16Handguard, rpk16Rail, rpk16Rs, rpk16RsBase, salewa, scavVest, specterDr } from '../__data__/itemMocks'
import { rpk16DefaultPrices, salewaPrices } from '../__data__/priceMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('BuildPropertiesService', () => {
  describe('canAddArmor()', () => {
    it.each([
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
        true,
        undefined
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
        true,
        undefined
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
        true,
        undefined
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
        false,
        'Cannot select a body armor because an armored tactical rig has already been added.'
      ]
    ])(
      'should check if an armor can be added to the build',
      async (build: IBuild, expectedResult: boolean, expectedErrorMessage: string | undefined) => {
        // Arrange
        useItemServiceMock()

        const notificationServiceMock = mock<NotificationService>()
        Services.configure(NotificationService, undefined, instance(notificationServiceMock))

        const service = new BuildPropertiesService()

        // Act
        const result = await service.canAddArmor(build)

        // Assert
        expect(result).toBe(expectedResult)

        if (expectedErrorMessage != null) {
          verify(notificationServiceMock.notify(NotificationType.warning, expectedErrorMessage)).once()
        } else {
          verify(notificationServiceMock.notify(NotificationType.warning, anything())).never()
        }
      }
    )
  })

  describe('canAddMod()', () => {
    it.each([
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
        true,
        undefined
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
        false,
        'Cannot add mod "Nightforce Magmount 30mm ring scope mount" because it conflicts with item "RPK-16 rear sight base".'
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
        true,
        undefined
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
        true,
        undefined
      ]
    ])(
      'should check if a mod can be added to an item',
      async (build: IBuild, modId: string, modSlotPath: string, expectedResult: boolean, expectedErrorMessage: string | undefined) => {
        // Arrange
        useItemServiceMock()

        const notificationServiceMock = mock<NotificationService>()
        Services.configure(NotificationService, undefined, instance(notificationServiceMock))

        const service = new BuildPropertiesService()

        // Act
        const result = await service.canAddMod(build, modId, modSlotPath)

        // Assert
        expect(result).toEqual(expectedResult)

        if (expectedErrorMessage != null) {
          verify(notificationServiceMock.notify(NotificationType.warning, expectedErrorMessage)).once()
        } else {
          verify(notificationServiceMock.notify(NotificationType.warning, anything())).never()
        }
      }
    )

    it('should throw when a build has no inventory slot', async () => {
      // Arrange
      useItemServiceMock()

      const service = new BuildPropertiesService()

      // Act
      const act = service.canAddMod(
        {
          id: '123456789',
          inventorySlots: [],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'build1'
        } as IBuild,
        rpk16Rail.id,
        `build:123456789/slot:onSling_0/item:${rpk16Default.id}`)

      // Assert
      await expect(act).rejects.toThrowError('Cannot find inventory slot "onSling".')
    })
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
        true,
        undefined
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
        true,
        undefined
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
        false,
        'Cannot select an armored tactical rig because a body armor has already been added.'
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
        true,
        undefined
      ]
    ])(
      'should check if a vest can be added to the build',
      async (build: IBuild, vestId: string, expectedResult: boolean, expectedErrorMessage: string | undefined) => {
        // Arrange
        useItemServiceMock()
        Services.configure(ItemPropertiesService)

        const notificationServiceMock = mock<NotificationService>()
        Services.configure(NotificationService, undefined, instance(notificationServiceMock))

        const service = new BuildPropertiesService()

        // Act
        const result = await service.canAddVest(build, vestId)

        // Assert
        expect(result).toEqual(expectedResult)

        if (expectedErrorMessage != null) {
          verify(notificationServiceMock.notify(NotificationType.warning, expectedErrorMessage)).once()
        } else {
          verify(notificationServiceMock.notify(NotificationType.warning, anything())).never()
        }
      }
    )
  })

  describe('checkMatchesFilter()', () => {
    it.each([
      ['invalid', false],
      ['meta', true],
      ['kedr meta', false],
      ['rpk meta', true],
      ['rpk meta first aid kit', true]
    ])('should check whether a build summary matches a filter', (filter: string, expected: boolean) => {
      // Arrange
      const buildSummary = {
        name: 'Meta',
        shoppingList: [
          {
            ignorePrice: false,
            inventorySlotId: undefined,
            item: rpk16Default,
            missingPrice: false,
            price: rpk16DefaultPrices[0],
            quantity: 1,
            unitPrice: rpk16DefaultPrices[0]
          } as IShoppingListItem,
          {
            ignorePrice: false,
            inventorySlotId: undefined,
            item: salewa,
            missingPrice: false,
            price: salewaPrices[0],
            quantity: 1,
            unitPrice: salewaPrices[0]
          } as IShoppingListItem
        ] as IShoppingListItem[]
      } as IBuildSummary

      const service = new BuildPropertiesService()

      // Act
      const result = service.checkMatchesFilter(buildSummary, filter)

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('getAsString()', () => {
    it.each([
      [build1, expectedToString1],
      [build2, expectedToString2],
      [
        {
          id: 'buildWithArmorOnly',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: armor6b13FlDefault.id,
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: plate6b33Front.id,
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'front_plate'
                    },
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: plate6b33Back.id,
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
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'Build with armor only'
        } as IBuild,
        expectedToString3
      ],
      [
        {
          id: 'buildWithBackpackOnly',
          inventorySlots: [
            {
              items: [
                {
                  content: [
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
                      itemId: precision.id,
                      modSlots: [],
                      quantity: 1
                    }
                  ],
                  ignorePrice: false,
                  itemId: mechanism.id,
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
          name: 'Build with backpack only and every currency'
        } as IBuild,
        expectedToString4
      ],
      [
        {
          id: 'buildWithWeaponOnBackOnly',
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
              typeId: 'onBack'
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'Build with weapon on back only'
        } as IBuild,
        expectedToString5
      ],
      [
        {
          id: 'buildWithMissingPrice',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: ammo545bp.id,
                  modSlots: [],
                  quantity: 60
                }
              ],
              typeId: 'pockets'
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'Build with missing price'
        } as IBuild,
        expectedToString6
      ]
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
      [undefined, undefined, 'Build not exported. It will be lost if you clear your browser data.'],
      [new Date(1), undefined, 'Build not exported. It will be lost if you clear your browser data.'],
      [new Date(2), new Date(1), 'Changes from the 01/01/1970 01:00:00 have not been exported. They will be lost if you clear your browser data. Last export on 01/01/1970 01:00:00.']
    ])('should get the tooltip for not exported builds', (lastUpdated: Date | undefined, lastExported: Date | undefined, expected: string) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const tooltip = service.getNotExportedTooltip(lastUpdated, lastExported)

      // Assert
      expect(tooltip).toBe(expected)
    })
  })

  describe('getShoppingListMerchants()', () => {
    it('should get the merchants and their maximum level from a shopping list', () => {
      // Arrange
      const services = new BuildPropertiesService()

      // Act
      const merchants = services.getShoppingListMerchants([
        {
          ignorePrice: false,
          inventorySlotId: undefined,
          item: ak12PistolGrip,
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ak12PistolGrip.id,
            merchant: 'prapor',
            merchantLevel: 2,
            quest: undefined,
            value: 2163,
            valueInMainCurrency: 2163
          },
          quantity: 1,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: ak12PistolGrip.id,
            merchant: 'prapor',
            merchantLevel: 2,
            quest: undefined,
            value: 2163,
            valueInMainCurrency: 2163
          }
        },
        {
          ignorePrice: false,
          inventorySlotId: undefined,
          item: salewa,
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: salewa.id,
            merchant: 'therapist',
            merchantLevel: 2,
            quest: {
              id: '596760e186f7741e11214d58',
              name: 'Postman Pat - Part 2',
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Postman_Pat_-_Part_2'
            },
            value: 37061,
            valueInMainCurrency: 37061
          },
          quantity: 1,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: salewa.id,
            merchant: 'therapist',
            merchantLevel: 2,
            quest: {
              id: '596760e186f7741e11214d58',
              name: 'Postman Pat - Part 2',
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Postman_Pat_-_Part_2'
            },
            value: 37061,
            valueInMainCurrency: 37061
          }
        },
        {
          ignorePrice: false,
          inventorySlotId: 'onSling',
          item: rpk16Default,
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'prapor',
            merchantLevel: 4,
            quest: undefined,
            value: 69734,
            valueInMainCurrency: 69734
          },
          quantity: 1,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16Default.id,
            merchant: 'prapor',
            merchantLevel: 4,
            quest: undefined,
            value: 69734,
            valueInMainCurrency: 69734
          }
        },
        {
          ignorePrice: false,
          inventorySlotId: 'tacticalRig',
          item: scavVest,
          missingPrice: false,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: scavVest.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 33447,
            valueInMainCurrency: 33447
          },
          quantity: 1,
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: scavVest.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 33447,
            valueInMainCurrency: 33447
          }
        }
      ])

      // Assert
      expect(merchants).toStrictEqual([
        {
          level: 4,
          name: 'prapor'
        },
        {
          level: 2,
          name: 'therapist'
        },
        {
          level: 0,
          name: 'flea-market'
        }
      ] as IShoppingListMerchant[])
    })
  })
})

const expectedToString1 = `Build 1
Recul vertical: 76    |    Recul horizontal: 226    |    Ergonomie: 34 (-9,5%)
Armure: 4    |    Vitesse: -6%    |    Vitesse de rotation: -9%
Prix: 366 019₽    |    Poids: 24,153 kg

[En bandouillère] RPK-16 5.45x39 light machine gun Default    |    Marché: 43 345₽
    [Chargeur] RPK-16 5.45x39 95-round drum magazine    |    Prapor 3 (échange): 24 218₽
        95 x 5.45x39mm US gs    |    Prapor 1: 9 120₽
[Pare-balles] 6B13 assault armor (Flora) Default    |    Ragman 2: 64 269₽
[Couvre-chef] BNTI LShZ-2DTM helmet (Black)    |    Marché: 63 493₽
    [Équipement] LShZ-2DTM face shield    |    Ragman 3 (échange): 29 805₽
[Sac à dos] WARTECH Berkut BB-102 backpack (A-TACS FG)    |    Ragman 2: 24 509₽
    Iskra ration pack    |    Jaeger 2: 24 392₽
    Bottle of water (0.6L)    |    La Toubib 1 (échange): 11 473₽
[Poches] Morphine injector    |    Marché: 17 421₽
[Poches] Vaseline balm    |    Marché: 27 714₽
[Poches] RGD-5 hand grenade    |    Prapor 3: 11 822₽
[Poches] 60 x 5.45x39mm US gs    |    Prapor 1: 5 760₽
[Lunettes] Crossbow tactical glasses    |    Ragman 2: 3 885₽
[Masque] Cold Fear infrared balaclava    |    Ragman 2: 4 793₽

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAK6BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOgqVu58gCOQB3_lygItavScD6KD6ETn76Ld4PKfNdDBTW60zKOTDUfLOKskPAvv8CJS6JIOZmG7z_bNwXWARPvkJgt24Ywgc1c_CuqrOoDN0iCO6QtaYMI3KcKgbqf16_1WH7L2-6ogCMKK0sAadxDUFJJ7BF3mvgQC_Ty9YilypMSb3oKwOpZIoK9kljWX_3NDn0DpMmjcn4bU3jMtOhFAs2j2g4z7JXCle7mzXDAUGG_6xUYU`

const expectedToString2 = `Build 2
Recul vertical: 368    |    Recul horizontal: 255    |    Ergonomie: 52 (-3%)
Armure: 4    |    Vitesse: -3%    |    Vitesse de rotation: -1%
Prix: 444$ et 184 252₽ (= 247 747₽)    |    Poids: 8,936 kg

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

const expectedToString3 = `Build with armor only
Ergonomie: -2,5%
Armure: 4    |    Vitesse: -6%    |    Vitesse de rotation: -1%
Prix: 64 269₽    |    Poids: 10,600 kg

[Pare-balles] 6B13 assault armor (Flora) Default    |    Ragman 2: 64 269₽

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAKkAAAAAAAAAABBKEnLUiJ9Ha4afnegDxWD05WKxGsZJsgWhKhOKNccaw3ZYUhII89YeYBEADewHwT4SGNj7DB88SCLjMqubc8aJnAxII091CJSM4SdhD3Qa9S2y0Vz5NwKfe7JWo68FWPa4TwknuMgjK_pWAhF3oXl3tBC8fxmQ6DU1JvAQhu_xIOgBiIycu6J3DYNVgf20v_7OcoA`

const expectedToString4 = `Build with backpack only and every currency
Ergonomie: -3%
Vitesse: -2%    |    Vitesse de rotation: -1%
Prix: 95€, 157$ et 67 446₽ (= 104 936₽)    |    Poids: 1,307 kg

[Sac à dos] Oakley Mechanism heavy duty backpack (Black)    |    Ragman 2: 67 446₽
    MS2000 Marker    |    Ragman 1: 95€ (= 15 105₽)
    AR-15 B5 Systems Precision stock    |    Peacekeeper 4: 157$ (= 22 385₽)

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAKZAAAAAAAAAABBKEnNkWPZwxLGD5AbqDRCABlUfHwjFlOcCKJCZtnY_G5Iw3yl8ARRMk-8vspnH0kfziAl5_AEWuLGxK4m_HrE19pZnFe2Mnv-2lo_MvFl_2QXgBgRDw5_ZiTl1OB6KjSSCgtwlxM5CvykrSWukYlKP_xOWFPMroTf86mmjAF-y9Dp-SQibkX8Ap5A`

const expectedToString5 = `Build with weapon on back only
Recul vertical: 112    |    Recul horizontal: 333    |    Ergonomie: 45
Prix: 43 345₽    |    Poids: 1,500 kg

[Dans le dos] RPK-16 5.45x39 light machine gun Default    |    Marché: 43 345₽

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAJOAAAAAAAAAABBKEnL4iJ9Ha4afnegDxWQTLsQzwkpgEEZ5P17Rk0UiykRW0ApjpaFQ6TR_AWFoFNHfz758PAigkjDNzljvK7CyqK5Q3NR5CNalmBcKYWWwRr_692wAA`

const expectedToString6 = `Build with missing price
Poids: 0,600 kg

[Poches] 60 x 5.45x39mm BP gs    |    Pas de marchand

Créé avec Totov Builder
Équipement interactif et statistiques complètes:
http://localhost:3000/s/XQAAAAJMAAAAAAAAAABBKEnLgiJ9Ha4afnegDxWD1AyOSjT9n_TYdhCtEy9EU1vXI1gHKo_6AMbgo9kFz-nmBlk3iys6khYTodWFDluyJb2ICHD2ow222Wddpp99A___y7mAAA`