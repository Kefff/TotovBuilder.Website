/* eslint-disable no-irregular-whitespace */
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { BuildsToTextType } from '../../models/utils/IBuildsToTextOptions'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { IShoppingListMerchant } from '../../models/utils/IShoppingListMerchant'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { PresetService } from '../../services/PresetService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { build1, build2 } from '../__data__/buildMocks'
import { ak12PistolGrip, ammo545bp, ammo9mmGT, armor6b13FlDefault, bayonet6Kh5, k1s, mechanism, ms2000, plate6b33Back, plate6b33Front, precision, rgd5, rpk16Default, salewa, scavVest } from '../__data__/itemMocks'
import { rpk16DefaultPrices, salewaPrices } from '../__data__/priceMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('BuildPropertiesService', () => {
  describe('checkMatchesFilter', () => {
    it.each([
      [null, true],
      [undefined, true],
      ['', true],
      ['invalid', false],
      ['meta', true],
      ['kedr meta', false],
      ['rpk meta', true],
      ['rpk meta first aid kit', true]
    ])('should check whether a build summary matches a filter', (filter: string | undefined | null, expected: boolean) => {
      // Arrange
      const buildSummary = {
        name: 'Meta',
        shoppingList: [
          {
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: rpk16Default,
            missingPrice: false,
            price: rpk16DefaultPrices[0],
            quantity: 1,
            unitPrice: rpk16DefaultPrices[0]
          } as IShoppingListItem,
          {
            ignorePrice: IgnoredUnitPrice.notIgnored,
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

  describe('getNotExportedTooltip', () => {
    it.each([
      [undefined, undefined, 'Build not saved to a file. It can be lost if you clear your browser data.'],
      [new Date(1), undefined, 'Build not saved to a file. It can be lost if you clear your browser data.'],
      [new Date(2), new Date(1), 'Changes from the 01/01/1970 01:00:00 have not been saved to a file.\nThey can be lost if you clear your browser data.\nLast file save on 01/01/1970 01:00:00.']
    ])('should get the tooltip for not exported builds', (lastUpdated: Date | undefined, lastExported: Date | undefined, expected: string) => {
      // Arrange
      const service = new BuildPropertiesService()

      // Act
      const tooltip = service.getNotExportedTooltip(lastUpdated, lastExported)

      // Assert
      expect(tooltip).toBe(expected)
    })
  })

  describe('getShoppingListMerchants', () => {
    it('should get the merchants and their maximum level from a shopping list', () => {
      // Arrange
      const services = new BuildPropertiesService()

      // Act
      const merchants = services.getShoppingListMerchants([
        {
          ignorePrice: IgnoredUnitPrice.notIgnored,
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
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
        },
        {
          ignorePrice: IgnoredUnitPrice.notLootable,
          inventorySlotId: undefined,
          item: bayonet6Kh5,
          missingPrice: false,
          price: undefined,
          quantity: 1,
          unitPrice: undefined
        }
      ])

      // Assert
      expect(merchants).toStrictEqual([
        {
          level: 0,
          name: 'flea-market'
        },
        {
          level: 4,
          name: 'prapor'
        },
        {
          level: 2,
          name: 'therapist'
        }
      ] as IShoppingListMerchant[])
    })
  })

  describe('getStatsAsString', () => {
    it.each([
      [build1, true, true, 'en', BuildsToTextType.markdown, `↕️ Vertical recoil **66**   ↔️ Horizontal recoil **216**   ✋ Ergonomics **31** (**-19.5%**)  
🛡️ Armor class **4**   🏃 Speed **-7%**   🔄 Turning speed **-12%**  
💵 Price **520,961₽**   ⚓ Weight **26.153 kg**  `],
      [build1, false, false, 'fr', BuildsToTextType.simpleText, `Recul vertical 66   Recul horizontal 216   Ergonomie 31 (-19,5%)
Classe d'armure 4   Vitesse -7%   Vitesse de rotation -12%
Poids 26,153 kg`],
      [build2, true, false, 'fr', BuildsToTextType.markdown, `↕️ Recul vertical **362**   ↔️ Recul horizontal **249**   ✋ Ergonomie **52** (**-3%**)  
🛡️ Classe d'armure **4**   🏃 Vitesse **-3%**   🔄 Vitesse de rotation **-1%**  
⚓ Poids **9,236 kg**  `],
      [build2, false, true, 'en', BuildsToTextType.simpleText, `Vertical recoil 362   Horizontal recoil 249   Ergonomics 52 (-3%)
Armor class 4   Speed -3%   Turning speed -1%
Price 302,311₽ and 459$ (= 367,984₽)   Weight 9.236 kg`]
    ])('should get the stats of a build', async (build: IBuild, includeEmojis: boolean, includePrices: boolean, language: string, type: BuildsToTextType, expected: string) => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()

      const service = new BuildPropertiesService()
      const summary = await service.getSummaryAsync(build)

      // Act
      const result = service.getStatsAsString(
        summary,
        {
          gameMode: 'pvp',
          includeEmojis,
          includeLink: false,
          includePrices,
          language,
          linkOnly: false,
          type
        },
        false)

      // Assert
      expect(result).toBe(expected)
    })

    it.each([
      [build1, true, true, 'en', BuildsToTextType.markdown, '↕️ Vertical recoil **66**   ↔️ Horizontal recoil **216**   ✋ Ergonomics **31** (**-19.5%**)    🛡️ Armor class **4**   🏃 Speed **-7%**   🔄 Turning speed **-12%**    💵 Price **520,961₽**   ⚓ Weight **26.153 kg**  '],
      [build1, false, false, 'fr', BuildsToTextType.simpleText, 'Recul vertical 66   Recul horizontal 216   Ergonomie 31 (-19,5%)    Classe d\'armure 4   Vitesse -7%   Vitesse de rotation -12%    Poids 26,153 kg'],
      [build2, true, false, 'fr', BuildsToTextType.markdown, '↕️ Recul vertical **362**   ↔️ Recul horizontal **249**   ✋ Ergonomie **52** (**-3%**)    🛡️ Classe d\'armure **4**   🏃 Vitesse **-3%**   🔄 Vitesse de rotation **-1%**    ⚓ Poids **9,236 kg**  '],
      [build2, false, true, 'en', BuildsToTextType.simpleText, 'Vertical recoil 362   Horizontal recoil 249   Ergonomics 52 (-3%)    Armor class 4   Speed -3%   Turning speed -1%    Price 302,311₽ and 459$ (= 367,984₽)   Weight 9.236 kg']
    ])('should get the stats of a build as a single line', async (build: IBuild, includeEmojis: boolean, includePrices: boolean, language: string, type: BuildsToTextType, expected: string) => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()

      const service = new BuildPropertiesService()
      const summary = await service.getSummaryAsync(build)

      // Act
      const result = service.getStatsAsString(
        summary,
        {
          gameMode: 'pvp',
          includeEmojis,
          includeLink: false,
          includePrices,
          language,
          linkOnly: false,
          type
        },
        true)

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('toTextAsync() (markdown)', () => {
    it.each([
      [build1, 'fr', expectedMarkdownString1Fr],
      [build1, 'en', expectedMarkdownString1En],
      [build2, 'fr', expectedMarkdownString2],
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
        'fr',
        expectedMarkdownString3
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
        'fr',
        expectedMarkdownString4
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
        'fr',
        expectedMarkdownString5
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
              typeId: InventorySlotTypeId.pockets
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'Build with missing price'
        } as IBuild,
        'fr',
        expectedMarkdownString6
      ]
    ])('should convert a build to a markdown text', async (build: IBuild, language: string, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(ReductionService)

      const service = new BuildPropertiesService()

      // Act
      const result = await service.toTextAsync(
        [build],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language,
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(expected)
    })

    it('should convert builds to a markdown text', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(PresetService)
      Services.configure(ReductionService)

      const build1: IBuild = {
        id: 'build1',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rgd5.id,
                modSlots: [],
                quantity: 1
              },
              {
                content: [],
                ignorePrice: false,
                itemId: ms2000.id,
                modSlots: [],
                quantity: 1
              },
              undefined,
              undefined
            ],
            typeId: InventorySlotTypeId.pockets
          },
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: k1s.id,
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.headwear
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 1'
      }

      const build2: IBuild = {
        id: 'build2',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: ammo9mmGT.id,
                modSlots: [],
                quantity: 25
              },
              undefined
            ],
            typeId: InventorySlotTypeId.pockets
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 2'
      }

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build1, build2],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`# Build 1

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAJ_AAAAAAAAAABBKEnKciJ9Ha4afmksn3ID9gJ5PAcWvYvzduA6qCQ2iyxE_CSen9_XpufSHSHL8RJDDjOD4mYmwzzDzmcTT-fkYBTyehet34mLudzTvi5EDfQCawD5zgMXn__9qMg4z5LrVAzkyhkulsb266vl0hhN-Df_7WGwAA)*

✋ Ergonomie **-2%**  
🔄 Vitesse de rotation **-2%**  
💵 Prix **20 701₽** et **95€** (= **35 806₽**)   ⚓ Poids **2,360 kg**  

[*Poches*] **RGD-5 hand grenade**   💵 Prapor 3 **11 822₽**  
[*Poches*] **MS2000 Marker**   💵 Ragman 1 **95€** (= **15 105₽**)  

[*Couvre-chef*] **Kolpak-1S riot helmet**   💵 Ragman 1 **8 879₽**  



# Build 2

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAI7AAAAAAAAAABBKEnKciJ9Ha4afmlhjXH78TJ5PAcWvYvzduA6soV_78fsVnl_BZRLWWGOMdaAD74_p_rPIryYaIhPJc_2yv__6hmgAA)*

💵 Prix **1 825₽**   ⚓ Poids **0,150 kg**  

[*Poches*] 25 x **9x19mm Green Tracer**   💵 Le Mécano 1 **1 825₽**  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`)
    })

    it('should ignore emojis', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(ReductionService)

      const globalFilterService = Services.get(GlobalFilterService)
      globalFilterService.save({
        excludeItemsWithoutMatchingPrice: true,
        excludePresetBaseItems: true,
        merchantFilters: [
          {
            enabled: true,
            merchant: 'prapor',
            merchantLevel: 4
          },
          {
            enabled: true,
            merchant: 'mechanic',
            merchantLevel: 2
          },
          {
            enabled: true,
            merchant: 'flea-market',
            merchantLevel: 0
          },
          {
            enabled: true,
            merchant: 'therapist',
            merchantLevel: 3
          },
          {
            enabled: true,
            merchant: 'skier',
            merchantLevel: 1
          },
          {
            enabled: false,
            merchant: 'ref',
            merchantLevel: 4
          }
        ]
      })

      const service = new BuildPropertiesService()

      // Act
      const result = await service.toTextAsync(
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
          } as IBuild
        ],
        {
          gameMode: 'pvp',
          includeEmojis: false,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`# Build with weapon on back only

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAJOAAAAAAAAAABBKEnL4iJ9Ha4afnegDxWQTLsQzwkpgEEZ5P17Rk0UiykRW0ApjpaFQ6TR_AWFoFNHfz758PAigkjDNzljvK7CyqK5Q3NR5CNalmBcKYWWwRr_692wAA)*

Recul vertical **112**   Recul horizontal **333**   Ergonomie **45**  
Prix **43 345₽**   Poids **1,500 kg**  

[*Dans le dos*] **RPK-16 5.45x39 light machine gun Default**   Marché **43 345₽**  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché Oui   Le Mécano 2   Prapor 4  
Ref Non   Skier 1   La Toubib 3  

*Créé avec [Totov Builder](http://localhost:3000)*`)
    })

    it('should ignore prices', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(ReductionService)

      const service = new BuildPropertiesService()

      // Act
      const result = await service.toTextAsync(
        [build1],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: false,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`# Build 1

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk)*

↕️ Recul vertical **66**   ↔️ Recul horizontal **216**   ✋ Ergonomie **31** (**-19,5%**)  
🛡️ Classe d'armure **4**   🏃 Vitesse **-7%**   🔄 Vitesse de rotation **-12%**  
⚓ Poids **26,153 kg**  

[*En bandouillère*] **RPK-16 5.45x39 light machine gun Default**  
 [*Magazine*] **RPK-16 5.45x39 95-round drum magazine**  
  95 x **5.45x39mm US gs**  

[*Pare-balles*] **6B13 assault armor (Flora) Default**  

[*Couvre-chef*] **BNTI LShZ-2DTM helmet (Black)**  
 [*Gear*] **LShZ-2DTM face shield**  

[*Sac à dos*] **WARTECH Berkut BB-102 backpack (A-TACS FG)**  
 **Iskra ration pack**  
 **Bottle of water (0.6L)**  

[*Poches*] **Morphine injector**  
[*Poches*] **Vaseline balm**  
[*Poches*] **RGD-5 hand grenade**  
[*Poches*] 60 x **5.45x39mm US gs**  

[*Lunettes*] **ESS Crossbow tactical glasses**  

[*Masque*] **Atomic Defense CQCM up armored ballistic mask (Black)**  

*Créé avec [Totov Builder](http://localhost:3000)*`)
    })

    it('should include the configured merchants', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ReductionService)

      const build: IBuild = {
        id: 'build',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build'
      }

      const globalFilterService = Services.get(GlobalFilterService)
      globalFilterService.save({
        excludeItemsWithoutMatchingPrice: true,
        excludePresetBaseItems: true,
        merchantFilters: [
          {
            enabled: true,
            merchant: 'prapor',
            merchantLevel: 4
          },
          {
            enabled: true,
            merchant: 'mechanic',
            merchantLevel: 2
          },
          {
            enabled: true,
            merchant: 'flea-market',
            merchantLevel: 0
          },
          {
            enabled: true,
            merchant: 'therapist',
            merchantLevel: 3
          },
          {
            enabled: true,
            merchant: 'skier',
            merchantLevel: 1
          },
          {
            enabled: false,
            merchant: 'ref',
            merchantLevel: 4
          }
        ]
      })

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`# Build

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAIMAAAAAAAAAABBKEnKUiJ9Ha4atWFNg2Pf___404AA)*



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché ✅   Le Mécano 2️⃣   Prapor 4️⃣  
Ref ❌   Skier 1️⃣   La Toubib 3️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`)
    })

    it('should only include links', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ReductionService)

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build1, build2],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: true,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`[Build 1](http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk)
[Build 2](http://localhost:3000/s/XQAAAAI_AwAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGsl4dNmidYYtG_dKZDAEXpv0OXo_ACd3rHXVSb7164luG7uqSFJX9gUKvM7w65AqVMEnHltm-pmNer4wgY-3Ie8EDEab8kMzo-hY7JD4zK2s55lopW4QgGNOXdi6ElV07V5v-3Ju9j_IjHjp3KX9WFqDdQAys8nXJho-iIuSwFnbGbawYaht_op0H-SCv9Bj38A)`)
    })

    it('should not include links', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(ItemPropertiesService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ReductionService)

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build1, build2],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: false,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.markdown
        })

      // Assert
      expect(result).toBe(`# Build 1

↕️ Recul vertical **66**   ↔️ Recul horizontal **216**   ✋ Ergonomie **31** (**-19,5%**)  
🛡️ Classe d'armure **4**   🏃 Vitesse **-7%**   🔄 Vitesse de rotation **-12%**  
💵 Prix **361 226₽**   ⚓ Poids **26,153 kg**  

[*En bandouillère*] **RPK-16 5.45x39 light machine gun Default**   💵 Marché **43 345₽**  
 [*Magazine*] **RPK-16 5.45x39 95-round drum magazine**   💵 Prapor 3 (*échange*) **24 218₽**  
  95 x **5.45x39mm US gs**   💵 Prapor 1 **9 120₽**  

[*Pare-balles*] **6B13 assault armor (Flora) Default**   💵 Ragman 2 **64 269₽**  

[*Couvre-chef*] **BNTI LShZ-2DTM helmet (Black)**   💵 Marché **63 493₽**  
 [*Gear*] **LShZ-2DTM face shield**   💵 Ragman 3 (*échange*) **29 805₽**  

[*Sac à dos*] **WARTECH Berkut BB-102 backpack (A-TACS FG)**   💵 Ragman 2 **24 509₽**  
 **Iskra ration pack**   💵 Jaeger 2 **24 392₽**  
 **Bottle of water (0.6L)**   💵 La Toubib 1 (*échange*) **11 473₽**  

[*Poches*] **Morphine injector**   💵 Marché **17 421₽**  
[*Poches*] **Vaseline balm**   💵 Marché **27 714₽**  
[*Poches*] **RGD-5 hand grenade**   💵 Prapor 3 **11 822₽**  
[*Poches*] 60 x **5.45x39mm US gs**   💵 Prapor 1 **5 760₽**  

[*Lunettes*] **ESS Crossbow tactical glasses**   💵 Ragman 2 **3 885₽**  

[*Masque*] **Atomic Defense CQCM up armored ballistic mask (Black)**   💵 Pas de marchand  



# Build 2

↕️ Recul vertical **362**   ↔️ Recul horizontal **249**   ✋ Ergonomie **52** (**-3%**)  
🛡️ Classe d'armure **4**   🏃 Vitesse **-3%**   🔄 Vitesse de rotation **-1%**  
💵 Prix **187 902₽** et **444$** (= **251 397₽**)   ⚓ Poids **9,236 kg**  

[*Holster*] **Beretta M9A3 9x19 pistol Default**   💵 Peacekeeper 1 **107$** (= **15 337₽**)  
 [*Barrel*]  
  [*Muzzle*] **SIG Sauer SRD9 9x19 sound suppressor**   💵 Peacekeeper 2 **242$** (= **34 606₽**)  
 [*Magazine*]  
  17 x **9x19mm Green Tracer**   💵 Le Mécano 1 **1 241₽**  
 [*Tactical*] **SureFire X400 Ultra tactical flashlight with laser**   💵 Peacekeeper 2 **95$** (= **13 552₽**)  

[*Gilet tactique*] **Shellback Tactical Banshee plate carrier (A-TACS AU)**   💵 Marché **33 950₽**  
 [*Plaque frontale*] **Monoclete level III PE ballistic plate**   💵 Peacekeeper 3 (*échange*) **31 503₽**  
 [*Plaque dorsale*] **Monoclete level III PE ballistic plate**   💵 Peacekeeper 3 (*échange*) **31 503₽**  
 **Salewa first aid kit**   💵 La Toubib 1 (*échange*) **21 923₽**  
 35 x **9x19mm Green Tracer**   💵 Le Mécano 1 **2 555₽**  

[*Dispositif audio*] **Walker's Razor Digital headset**   💵 Marché **64 132₽**  

[*Pochette*] **Secure container Alpha**  
 15 x **9x19mm Green Tracer**   💵 Le Mécano 1 **1 095₽**  

[*Fourreau*] **6Kh5 Bayonet**  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`)
    })
  })

  describe('toTextAsync() (simple text)', () => {
    it.each([
      [build1, 'fr', expectedString1Fr],
      [build1, 'en', expectedString1En],
      [build2, 'fr', expectedString2],
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
        'fr',
        expectedString3
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
        'fr',
        expectedString4
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
        'fr',
        expectedString5
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
              typeId: InventorySlotTypeId.pockets
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined,
          name: 'Build with missing price'
        } as IBuild,
        'fr',
        expectedString6
      ]
    ])('should convert a build to a text', async (build: IBuild, language: string, expected: string) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(ReductionService)

      const service = new BuildPropertiesService()

      // Act
      const result = await service.toTextAsync(
        [build],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language,
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(expected)
    })

    it('should convert builds to a text', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(PresetService)
      Services.configure(ReductionService)

      const build1: IBuild = {
        id: 'build1',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: rgd5.id,
                modSlots: [],
                quantity: 1
              },
              {
                content: [],
                ignorePrice: false,
                itemId: ms2000.id,
                modSlots: [],
                quantity: 1
              },
              undefined,
              undefined
            ],
            typeId: InventorySlotTypeId.pockets
          },
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: k1s.id,
                modSlots: [],
                quantity: 1
              }
            ],
            typeId: InventorySlotTypeId.headwear
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 1'
      }

      const build2: IBuild = {
        id: 'build2',
        inventorySlots: [
          {
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: ammo9mmGT.id,
                modSlots: [],
                quantity: 25
              },
              undefined
            ],
            typeId: InventorySlotTypeId.pockets
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build 2'
      }

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build1, build2],
        {
          gameMode: 'pve',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Build 1

✋ Ergonomie -2%
🔄 Vitesse de rotation -2%
💵 Prix 20 701₽ et 95€ (= 35 806₽)   ⚓ Poids 2,360 kg

[Poches] RGD-5 hand grenade   💵 Prapor 3 11 822₽
[Poches] MS2000 Marker   💵 Ragman 1 95€ (= 15 105₽)

[Couvre-chef] Kolpak-1S riot helmet   💵 Ragman 1 8 879₽

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAJ_AAAAAAAAAABBKEnKciJ9Ha4afmksn3ID9gJ5PAcWvYvzduA6qCQ2iyxE_CSen9_XpufSHSHL8RJDDjOD4mYmwzzDzmcTT-fkYBTyehet34mLudzTvi5EDfQCawD5zgMXn__9qMg4z5LrVAzkyhkulsb266vl0hhN-Df_7WGwAA



Build 2

💵 Prix 1 825₽   ⚓ Poids 0,150 kg

[Poches] 25 x 9x19mm Green Tracer   💵 Le Mécano 1 1 825₽

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAI7AAAAAAAAAABBKEnKciJ9Ha4afmlhjXH78TJ5PAcWvYvzduA6soV_78fsVnl_BZRLWWGOMdaAD74_p_rPIryYaIhPJc_2yv__6hmgAA



Mode de jeu : JcE

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`)
    })

    it('should ignore emojis', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(ReductionService)

      const service = new BuildPropertiesService()

      // Act
      const result = await service.toTextAsync(
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
          } as IBuild
        ],
        {
          gameMode: 'pvp',
          includeEmojis: false,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Build with weapon on back only

Recul vertical 112   Recul horizontal 333   Ergonomie 45
Prix 43 345₽   Poids 1,500 kg

[Dans le dos] RPK-16 5.45x39 light machine gun Default   Marché 43 345₽

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAJOAAAAAAAAAABBKEnL4iJ9Ha4afnegDxWQTLsQzwkpgEEZ5P17Rk0UiykRW0ApjpaFQ6TR_AWFoFNHfz758PAigkjDNzljvK7CyqK5Q3NR5CNalmBcKYWWwRr_692wAA



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4   Le Mécano 4
Peacekeeper 4   Prapor 4   Ragman 4
Ref 4   Skier 4   La Toubib 4

Créé avec Totov Builder`)
    })

    it('should ignore prices', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(ReductionService)

      const service = new BuildPropertiesService()

      // Act
      const result = await service.toTextAsync(
        [build1],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: false,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Build 1

↕️ Recul vertical 66   ↔️ Recul horizontal 216   ✋ Ergonomie 31 (-19,5%)
🛡️ Classe d'armure 4   🏃 Vitesse -7%   🔄 Vitesse de rotation -12%
⚓ Poids 26,153 kg

[En bandouillère] RPK-16 5.45x39 light machine gun Default
 [Magazine] RPK-16 5.45x39 95-round drum magazine
  95 x 5.45x39mm US gs

[Pare-balles] 6B13 assault armor (Flora) Default

[Couvre-chef] BNTI LShZ-2DTM helmet (Black)
 [Gear] LShZ-2DTM face shield

[Sac à dos] WARTECH Berkut BB-102 backpack (A-TACS FG)
 Iskra ration pack
 Bottle of water (0.6L)

[Poches] Morphine injector
[Poches] Vaseline balm
[Poches] RGD-5 hand grenade
[Poches] 60 x 5.45x39mm US gs

[Lunettes] ESS Crossbow tactical glasses

[Masque] Atomic Defense CQCM up armored ballistic mask (Black)

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk

Créé avec Totov Builder`)
    })

    it('should include the configured merchants', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ReductionService)

      const build: IBuild = {
        id: 'build',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Build'
      }

      const globalFilterService = Services.get(GlobalFilterService)
      globalFilterService.save({
        excludeItemsWithoutMatchingPrice: true,
        excludePresetBaseItems: true,
        merchantFilters: [
          {
            enabled: true,
            merchant: 'prapor',
            merchantLevel: 4
          },
          {
            enabled: true,
            merchant: 'mechanic',
            merchantLevel: 2
          },
          {
            enabled: true,
            merchant: 'flea-market',
            merchantLevel: 0
          },
          {
            enabled: true,
            merchant: 'therapist',
            merchantLevel: 3
          },
          {
            enabled: true,
            merchant: 'skier',
            merchantLevel: 1
          },
          {
            enabled: false,
            merchant: 'ref',
            merchantLevel: 4
          }
        ]
      })

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build],
        {
          gameMode: 'pve',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Build

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAIMAAAAAAAAAABBKEnKUiJ9Ha4atWFNg2Pf___404AA



Mode de jeu : JcE

Marchands configurés
Marché ✅   Le Mécano 2️⃣   Prapor 4️⃣
Ref ❌   Skier 1️⃣   La Toubib 3️⃣

Créé avec Totov Builder`)
    })

    it('should only include links', async () => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ReductionService)

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build1, build2],
        {
          gameMode: 'pvp',
          includeEmojis: true,
          includeLink: true,
          includePrices: true,
          language: 'fr',
          linkOnly: true,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Build 1
http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk



Build 2
http://localhost:3000/s/XQAAAAI_AwAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGsl4dNmidYYtG_dKZDAEXpv0OXo_ACd3rHXVSb7164luG7uqSFJX9gUKvM7w65AqVMEnHltm-pmNer4wgY-3Ie8EDEab8kMzo-hY7JD4zK2s55lopW4QgGNOXdi6ElV07V5v-3Ju9j_IjHjp3KX9WFqDdQAys8nXJho-iIuSwFnbGbawYaht_op0H-SCv9Bj38A`)
    })

    it('should not include links', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(BuildService)
      Services.configure(GlobalFilterService)
      Services.configure(ItemPropertiesService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ReductionService)

      const buildPropertiesService = new BuildPropertiesService()

      // Act
      const result = await buildPropertiesService.toTextAsync(
        [build1, build2],
        {
          gameMode: 'pve',
          includeEmojis: true,
          includeLink: false,
          includePrices: true,
          language: 'fr',
          linkOnly: false,
          type: BuildsToTextType.simpleText
        })

      // Assert
      expect(result).toBe(`Build 1

↕️ Recul vertical 66   ↔️ Recul horizontal 216   ✋ Ergonomie 31 (-19,5%)
🛡️ Classe d'armure 4   🏃 Vitesse -7%   🔄 Vitesse de rotation -12%
💵 Prix 361 226₽   ⚓ Poids 26,153 kg

[En bandouillère] RPK-16 5.45x39 light machine gun Default   💵 Marché 43 345₽
 [Magazine] RPK-16 5.45x39 95-round drum magazine   💵 Prapor 3 (échange) 24 218₽
  95 x 5.45x39mm US gs   💵 Prapor 1 9 120₽

[Pare-balles] 6B13 assault armor (Flora) Default   💵 Ragman 2 64 269₽

[Couvre-chef] BNTI LShZ-2DTM helmet (Black)   💵 Marché 63 493₽
 [Gear] LShZ-2DTM face shield   💵 Ragman 3 (échange) 29 805₽

[Sac à dos] WARTECH Berkut BB-102 backpack (A-TACS FG)   💵 Ragman 2 24 509₽
 Iskra ration pack   💵 Jaeger 2 24 392₽
 Bottle of water (0.6L)   💵 La Toubib 1 (échange) 11 473₽

[Poches] Morphine injector   💵 Marché 17 421₽
[Poches] Vaseline balm   💵 Marché 27 714₽
[Poches] RGD-5 hand grenade   💵 Prapor 3 11 822₽
[Poches] 60 x 5.45x39mm US gs   💵 Prapor 1 5 760₽

[Lunettes] ESS Crossbow tactical glasses   💵 Ragman 2 3 885₽

[Masque] Atomic Defense CQCM up armored ballistic mask (Black)   💵 Pas de marchand



Build 2

↕️ Recul vertical 362   ↔️ Recul horizontal 249   ✋ Ergonomie 52 (-3%)
🛡️ Classe d'armure 4   🏃 Vitesse -3%   🔄 Vitesse de rotation -1%
💵 Prix 187 902₽ et 444$ (= 251 397₽)   ⚓ Poids 9,236 kg

[Holster] Beretta M9A3 9x19 pistol Default   💵 Peacekeeper 1 107$ (= 15 337₽)
 [Barrel]
  [Muzzle] SIG Sauer SRD9 9x19 sound suppressor   💵 Peacekeeper 2 242$ (= 34 606₽)
 [Magazine]
  17 x 9x19mm Green Tracer   💵 Le Mécano 1 1 241₽
 [Tactical] SureFire X400 Ultra tactical flashlight with laser   💵 Peacekeeper 2 95$ (= 13 552₽)

[Gilet tactique] Shellback Tactical Banshee plate carrier (A-TACS AU)   💵 Marché 33 950₽
 [Plaque frontale] Monoclete level III PE ballistic plate   💵 Peacekeeper 3 (échange) 31 503₽
 [Plaque dorsale] Monoclete level III PE ballistic plate   💵 Peacekeeper 3 (échange) 31 503₽
 Salewa first aid kit   💵 La Toubib 1 (échange) 21 923₽
 35 x 9x19mm Green Tracer   💵 Le Mécano 1 2 555₽

[Dispositif audio] Walker's Razor Digital headset   💵 Marché 64 132₽

[Pochette] Secure container Alpha
 15 x 9x19mm Green Tracer   💵 Le Mécano 1 1 095₽

[Fourreau] 6Kh5 Bayonet



Mode de jeu : JcE

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`)
    })
  })
})



const expectedMarkdownString1En = `# Build 1

*[Interactive version with full statistics](http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk)*

↕️ Vertical recoil **66**   ↔️ Horizontal recoil **216**   ✋ Ergonomics **31** (**-19.5%**)  
🛡️ Armor class **4**   🏃 Speed **-7%**   🔄 Turning speed **-12%**  
💵 Price **361,226₽**   ⚓ Weight **26.153 kg**  

[*On sling*] **RPK-16 5.45x39 light machine gun Default**   💵 Flea market **43,345₽**  
 [*Magazine*] **RPK-16 5.45x39 95-round drum magazine**   💵 Prapor 3 (*barter*) **24,218₽**  
  95 x **5.45x39mm US gs**   💵 Prapor 1 **9,120₽**  

[*Body armor*] **6B13 assault armor (Flora) Default**   💵 Ragman 2 **64,269₽**  

[*Headwear*] **BNTI LShZ-2DTM helmet (Black)**   💵 Flea market **63,493₽**  
 [*Gear*] **LShZ-2DTM face shield**   💵 Ragman 3 (*barter*) **29,805₽**  

[*Backpack*] **WARTECH Berkut BB-102 backpack (A-TACS FG)**   💵 Ragman 2 **24,509₽**  
 **Iskra ration pack**   💵 Jaeger 2 **24,392₽**  
 **Bottle of water (0.6L)**   💵 Therapist 1 (*barter*) **11,473₽**  

[*Pockets*] **Morphine injector**   💵 Flea market **17,421₽**  
[*Pockets*] **Vaseline balm**   💵 Flea market **27,714₽**  
[*Pockets*] **RGD-5 hand grenade**   💵 Prapor 3 **11,822₽**  
[*Pockets*] 60 x **5.45x39mm US gs**   💵 Prapor 1 **5,760₽**  

[*Eyewear*] **ESS Crossbow tactical glasses**   💵 Ragman 2 **3,885₽**  

[*Face cover*] **Atomic Defense CQCM up armored ballistic mask (Black)**   💵 No merchant  



*Game mode* : **PvP**

*Configured merchants*  
Flea market 99   Jaeger 4️⃣   Mechanic 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   Therapist 4️⃣  

*Created with [Totov Builder](http://localhost:3000)*`

const expectedMarkdownString1Fr = `# Build 1

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk)*

↕️ Recul vertical **66**   ↔️ Recul horizontal **216**   ✋ Ergonomie **31** (**-19,5%**)  
🛡️ Classe d'armure **4**   🏃 Vitesse **-7%**   🔄 Vitesse de rotation **-12%**  
💵 Prix **361 226₽**   ⚓ Poids **26,153 kg**  

[*En bandouillère*] **RPK-16 5.45x39 light machine gun Default**   💵 Marché **43 345₽**  
 [*Magazine*] **RPK-16 5.45x39 95-round drum magazine**   💵 Prapor 3 (*échange*) **24 218₽**  
  95 x **5.45x39mm US gs**   💵 Prapor 1 **9 120₽**  

[*Pare-balles*] **6B13 assault armor (Flora) Default**   💵 Ragman 2 **64 269₽**  

[*Couvre-chef*] **BNTI LShZ-2DTM helmet (Black)**   💵 Marché **63 493₽**  
 [*Gear*] **LShZ-2DTM face shield**   💵 Ragman 3 (*échange*) **29 805₽**  

[*Sac à dos*] **WARTECH Berkut BB-102 backpack (A-TACS FG)**   💵 Ragman 2 **24 509₽**  
 **Iskra ration pack**   💵 Jaeger 2 **24 392₽**  
 **Bottle of water (0.6L)**   💵 La Toubib 1 (*échange*) **11 473₽**  

[*Poches*] **Morphine injector**   💵 Marché **17 421₽**  
[*Poches*] **Vaseline balm**   💵 Marché **27 714₽**  
[*Poches*] **RGD-5 hand grenade**   💵 Prapor 3 **11 822₽**  
[*Poches*] 60 x **5.45x39mm US gs**   💵 Prapor 1 **5 760₽**  

[*Lunettes*] **ESS Crossbow tactical glasses**   💵 Ragman 2 **3 885₽**  

[*Masque*] **Atomic Defense CQCM up armored ballistic mask (Black)**   💵 Pas de marchand  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`

const expectedMarkdownString2 = `# Build 2

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAI_AwAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGsl4dNmidYYtG_dKZDAEXpv0OXo_ACd3rHXVSb7164luG7uqSFJX9gUKvM7w65AqVMEnHltm-pmNer4wgY-3Ie8EDEab8kMzo-hY7JD4zK2s55lopW4QgGNOXdi6ElV07V5v-3Ju9j_IjHjp3KX9WFqDdQAys8nXJho-iIuSwFnbGbawYaht_op0H-SCv9Bj38A)*

↕️ Recul vertical **362**   ↔️ Recul horizontal **249**   ✋ Ergonomie **52** (**-3%**)  
🛡️ Classe d'armure **4**   🏃 Vitesse **-3%**   🔄 Vitesse de rotation **-1%**  
💵 Prix **187 902₽** et **444$** (= **251 397₽**)   ⚓ Poids **9,236 kg**  

[*Holster*] **Beretta M9A3 9x19 pistol Default**   💵 Peacekeeper 1 **107$** (= **15 337₽**)  
 [*Barrel*]  
  [*Muzzle*] **SIG Sauer SRD9 9x19 sound suppressor**   💵 Peacekeeper 2 **242$** (= **34 606₽**)  
 [*Magazine*]  
  17 x **9x19mm Green Tracer**   💵 Le Mécano 1 **1 241₽**  
 [*Tactical*] **SureFire X400 Ultra tactical flashlight with laser**   💵 Peacekeeper 2 **95$** (= **13 552₽**)  

[*Gilet tactique*] **Shellback Tactical Banshee plate carrier (A-TACS AU)**   💵 Marché **33 950₽**  
 [*Plaque frontale*] **Monoclete level III PE ballistic plate**   💵 Peacekeeper 3 (*échange*) **31 503₽**  
 [*Plaque dorsale*] **Monoclete level III PE ballistic plate**   💵 Peacekeeper 3 (*échange*) **31 503₽**  
 **Salewa first aid kit**   💵 La Toubib 1 (*échange*) **21 923₽**  
 35 x **9x19mm Green Tracer**   💵 Le Mécano 1 **2 555₽**  

[*Dispositif audio*] **Walker's Razor Digital headset**   💵 Marché **64 132₽**  

[*Pochette*] **Secure container Alpha**  
 15 x **9x19mm Green Tracer**   💵 Le Mécano 1 **1 095₽**  

[*Fourreau*] **6Kh5 Bayonet**  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`

const expectedMarkdownString3 = `# Build with armor only

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAKkAAAAAAAAAABBKEnLUiJ9Ha4afnegDxWD05WKxGsZJsgWhKhOKNccaw3ZYUhII89YeYBEADewHwT4SGNj7DB88SCLjMqubc8aJnAxII091CJSM4SdhD3Qa9S2y0Vz5NwKfe7JWo68FWPa4TwknuMgjK_pWAhF3oXl3tBC8fxmQ6DU1JvAQhu_xIOgBiIycu6J3DYNVgf20v_7OcoA)*

✋ Ergonomie **-2,5%**  
🛡️ Classe d'armure **4**   🏃 Vitesse **-6%**   🔄 Vitesse de rotation **-1%**  
💵 Prix **64 269₽**   ⚓ Poids **10,600 kg**  

[*Pare-balles*] **6B13 assault armor (Flora) Default**   💵 Ragman 2 **64 269₽**  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`

const expectedMarkdownString4 = `# Build with backpack only and every currency

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAKZAAAAAAAAAABBKEnNkWPZwxLGD5AbqDRCABlUfHwjFlOcCKJCZtnY_G5Iw3yl8ARRMk-8vspnH0kfziAl5_AEWuLGxK4m_HrE19pZnFe2Mnv-2lo_MvFl_2QXgBgRDw5_ZiTl1OB6KjSSCgtwlxM5CvykrSWukYlKP_xOWFPMroTf86mmjAF-y9Dp-SQibkX8Ap5A)*

✋ Ergonomie **-3%**  
🏃 Vitesse **-2%**   🔄 Vitesse de rotation **-1%**  
💵 Prix **67 446₽**, **95€** et **157$** (= **104 936₽**)   ⚓ Poids **1,307 kg**  

[*Sac à dos*] **Oakley Mechanism heavy duty backpack (Black)**   💵 Ragman 2 **67 446₽**  
 **MS2000 Marker**   💵 Ragman 1 **95€** (= **15 105₽**)  
 **AR-15 B5 Systems Collapsible Precision Stock**   💵 Peacekeeper 4 **157$** (= **22 385₽**)  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`

const expectedMarkdownString5 = `# Build with weapon on back only

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAJOAAAAAAAAAABBKEnL4iJ9Ha4afnegDxWQTLsQzwkpgEEZ5P17Rk0UiykRW0ApjpaFQ6TR_AWFoFNHfz758PAigkjDNzljvK7CyqK5Q3NR5CNalmBcKYWWwRr_692wAA)*

↕️ Recul vertical **112**   ↔️ Recul horizontal **333**   ✋ Ergonomie **45**  
💵 Prix **43 345₽**   ⚓ Poids **1,500 kg**  

[*Dans le dos*] **RPK-16 5.45x39 light machine gun Default**   💵 Marché **43 345₽**  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`

const expectedMarkdownString6 = `# Build with missing price

*[Version interactive avec statistiques complètes](http://localhost:3000/s/XQAAAAJMAAAAAAAAAABBKEnLgiJ9Ha4afnegDxWD1AyOSjT9n_TYdhCtEy9EU1vXI1gHKo_6AMbgo9kFz-nmBlk3iys6khYTodWFDluyJb2ICHD2ow222Wddpp99A___y7mAAA)*

⚓ Poids **0,600 kg**  

[*Poches*] 60 x **5.45x39mm BP gs**   💵 Pas de marchand  



*Mode de jeu* : **JcJ**

*Marchands configurés*  
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣  
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣  
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣  

*Créé avec [Totov Builder](http://localhost:3000)*`



const expectedString1En = `Build 1

↕️ Vertical recoil 66   ↔️ Horizontal recoil 216   ✋ Ergonomics 31 (-19.5%)
🛡️ Armor class 4   🏃 Speed -7%   🔄 Turning speed -12%
💵 Price 361,226₽   ⚓ Weight 26.153 kg

[On sling] RPK-16 5.45x39 light machine gun Default   💵 Flea market 43,345₽
 [Magazine] RPK-16 5.45x39 95-round drum magazine   💵 Prapor 3 (barter) 24,218₽
  95 x 5.45x39mm US gs   💵 Prapor 1 9,120₽

[Body armor] 6B13 assault armor (Flora) Default   💵 Ragman 2 64,269₽

[Headwear] BNTI LShZ-2DTM helmet (Black)   💵 Flea market 63,493₽
 [Gear] LShZ-2DTM face shield   💵 Ragman 3 (barter) 29,805₽

[Backpack] WARTECH Berkut BB-102 backpack (A-TACS FG)   💵 Ragman 2 24,509₽
 Iskra ration pack   💵 Jaeger 2 24,392₽
 Bottle of water (0.6L)   💵 Therapist 1 (barter) 11,473₽

[Pockets] Morphine injector   💵 Flea market 17,421₽
[Pockets] Vaseline balm   💵 Flea market 27,714₽
[Pockets] RGD-5 hand grenade   💵 Prapor 3 11,822₽
[Pockets] 60 x 5.45x39mm US gs   💵 Prapor 1 5,760₽

[Eyewear] ESS Crossbow tactical glasses   💵 Ragman 2 3,885₽

[Face cover] Atomic Defense CQCM up armored ballistic mask (Black)   💵 No merchant

Interactive version with full statistics
http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk



Game mode : PvP

Configured merchants
Flea market 99   Jaeger 4️⃣   Mechanic 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   Therapist 4️⃣

Created with Totov Builder`

const expectedString1Fr = `Build 1

↕️ Recul vertical 66   ↔️ Recul horizontal 216   ✋ Ergonomie 31 (-19,5%)
🛡️ Classe d'armure 4   🏃 Vitesse -7%   🔄 Vitesse de rotation -12%
💵 Prix 361 226₽   ⚓ Poids 26,153 kg

[En bandouillère] RPK-16 5.45x39 light machine gun Default   💵 Marché 43 345₽
 [Magazine] RPK-16 5.45x39 95-round drum magazine   💵 Prapor 3 (échange) 24 218₽
  95 x 5.45x39mm US gs   💵 Prapor 1 9 120₽

[Pare-balles] 6B13 assault armor (Flora) Default   💵 Ragman 2 64 269₽

[Couvre-chef] BNTI LShZ-2DTM helmet (Black)   💵 Marché 63 493₽
 [Gear] LShZ-2DTM face shield   💵 Ragman 3 (échange) 29 805₽

[Sac à dos] WARTECH Berkut BB-102 backpack (A-TACS FG)   💵 Ragman 2 24 509₽
 Iskra ration pack   💵 Jaeger 2 24 392₽
 Bottle of water (0.6L)   💵 La Toubib 1 (échange) 11 473₽

[Poches] Morphine injector   💵 Marché 17 421₽
[Poches] Vaseline balm   💵 Marché 27 714₽
[Poches] RGD-5 hand grenade   💵 Prapor 3 11 822₽
[Poches] 60 x 5.45x39mm US gs   💵 Prapor 1 5 760₽

[Lunettes] ESS Crossbow tactical glasses   💵 Ragman 2 3 885₽

[Masque] Atomic Defense CQCM up armored ballistic mask (Black)   💵 Pas de marchand

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAK-BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOlgCxqLt8Bov5LviowT5gxPqUUzeDaLzDzLaoAVAimfU2eM0ebn_kDScJs1Coc_tRX7eeU4vprbG30Wkwga8ulvpfzqjd1XZMDQFlND7jMx9APhnRsB88DDfYX-w6ZYNumcfZdA8CMec4SQyp1uROA_2gTxlnvp71wDrwj8NaUc_bdnKg9eWtRvDgpoK_EGHtGgNcqTqjaKeEa0hiUApsM7wYSITJ5fHEpLmKJOScYLP_vfWGkk



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`

const expectedString2 = `Build 2

↕️ Recul vertical 362   ↔️ Recul horizontal 249   ✋ Ergonomie 52 (-3%)
🛡️ Classe d'armure 4   🏃 Vitesse -3%   🔄 Vitesse de rotation -1%
💵 Prix 187 902₽ et 444$ (= 251 397₽)   ⚓ Poids 9,236 kg

[Holster] Beretta M9A3 9x19 pistol Default   💵 Peacekeeper 1 107$ (= 15 337₽)
 [Barrel]
  [Muzzle] SIG Sauer SRD9 9x19 sound suppressor   💵 Peacekeeper 2 242$ (= 34 606₽)
 [Magazine]
  17 x 9x19mm Green Tracer   💵 Le Mécano 1 1 241₽
 [Tactical] SureFire X400 Ultra tactical flashlight with laser   💵 Peacekeeper 2 95$ (= 13 552₽)

[Gilet tactique] Shellback Tactical Banshee plate carrier (A-TACS AU)   💵 Marché 33 950₽
 [Plaque frontale] Monoclete level III PE ballistic plate   💵 Peacekeeper 3 (échange) 31 503₽
 [Plaque dorsale] Monoclete level III PE ballistic plate   💵 Peacekeeper 3 (échange) 31 503₽
 Salewa first aid kit   💵 La Toubib 1 (échange) 21 923₽
 35 x 9x19mm Green Tracer   💵 Le Mécano 1 2 555₽

[Dispositif audio] Walker's Razor Digital headset   💵 Marché 64 132₽

[Pochette] Secure container Alpha
 15 x 9x19mm Green Tracer   💵 Le Mécano 1 1 095₽

[Fourreau] 6Kh5 Bayonet

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAI_AwAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGsl4dNmidYYtG_dKZDAEXpv0OXo_ACd3rHXVSb7164luG7uqSFJX9gUKvM7w65AqVMEnHltm-pmNer4wgY-3Ie8EDEab8kMzo-hY7JD4zK2s55lopW4QgGNOXdi6ElV07V5v-3Ju9j_IjHjp3KX9WFqDdQAys8nXJho-iIuSwFnbGbawYaht_op0H-SCv9Bj38A



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`

const expectedString3 = `Build with armor only

✋ Ergonomie -2,5%
🛡️ Classe d'armure 4   🏃 Vitesse -6%   🔄 Vitesse de rotation -1%
💵 Prix 64 269₽   ⚓ Poids 10,600 kg

[Pare-balles] 6B13 assault armor (Flora) Default   💵 Ragman 2 64 269₽

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAKkAAAAAAAAAABBKEnLUiJ9Ha4afnegDxWD05WKxGsZJsgWhKhOKNccaw3ZYUhII89YeYBEADewHwT4SGNj7DB88SCLjMqubc8aJnAxII091CJSM4SdhD3Qa9S2y0Vz5NwKfe7JWo68FWPa4TwknuMgjK_pWAhF3oXl3tBC8fxmQ6DU1JvAQhu_xIOgBiIycu6J3DYNVgf20v_7OcoA



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`

const expectedString4 = `Build with backpack only and every currency

✋ Ergonomie -3%
🏃 Vitesse -2%   🔄 Vitesse de rotation -1%
💵 Prix 67 446₽, 95€ et 157$ (= 104 936₽)   ⚓ Poids 1,307 kg

[Sac à dos] Oakley Mechanism heavy duty backpack (Black)   💵 Ragman 2 67 446₽
 MS2000 Marker   💵 Ragman 1 95€ (= 15 105₽)
 AR-15 B5 Systems Collapsible Precision Stock   💵 Peacekeeper 4 157$ (= 22 385₽)

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAKZAAAAAAAAAABBKEnNkWPZwxLGD5AbqDRCABlUfHwjFlOcCKJCZtnY_G5Iw3yl8ARRMk-8vspnH0kfziAl5_AEWuLGxK4m_HrE19pZnFe2Mnv-2lo_MvFl_2QXgBgRDw5_ZiTl1OB6KjSSCgtwlxM5CvykrSWukYlKP_xOWFPMroTf86mmjAF-y9Dp-SQibkX8Ap5A



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`

const expectedString5 = `Build with weapon on back only

↕️ Recul vertical 112   ↔️ Recul horizontal 333   ✋ Ergonomie 45
💵 Prix 43 345₽   ⚓ Poids 1,500 kg

[Dans le dos] RPK-16 5.45x39 light machine gun Default   💵 Marché 43 345₽

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAJOAAAAAAAAAABBKEnL4iJ9Ha4afnegDxWQTLsQzwkpgEEZ5P17Rk0UiykRW0ApjpaFQ6TR_AWFoFNHfz758PAigkjDNzljvK7CyqK5Q3NR5CNalmBcKYWWwRr_692wAA



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`

const expectedString6 = `Build with missing price

⚓ Poids 0,600 kg

[Poches] 60 x 5.45x39mm BP gs   💵 Pas de marchand

Version interactive avec statistiques complètes
http://localhost:3000/s/XQAAAAJMAAAAAAAAAABBKEnLgiJ9Ha4afnegDxWD1AyOSjT9n_TYdhCtEy9EU1vXI1gHKo_6AMbgo9kFz-nmBlk3iys6khYTodWFDluyJb2ICHD2ow222Wddpp99A___y7mAAA



Mode de jeu : JcJ

Marchands configurés
Marché 99   Jaeger 4️⃣   Le Mécano 4️⃣
Peacekeeper 4️⃣   Prapor 4️⃣   Ragman 4️⃣
Ref 4️⃣   Skier 4️⃣   La Toubib 4️⃣

Créé avec Totov Builder`