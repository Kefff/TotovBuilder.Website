import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import { build1, build2 } from '../__data__/buildMocks'
import { alkali, ammo545us, ammo9mmGT, armor6b13FlDefault, banshee, berkut, cf, crossbow, ewr, h2o2, iskra, lshZ2dtm, lshZ2dtmFs, m9a3Default, monocletePe, morphine, pass, plexiglass, razor, rgd5, rpk16Default, rpk16Drum, salewa, srd9, vaseline, water, x400 } from '../__data__/itemMocks'
import { alkaliPrices, ammo545usPrices, ammo9mmGTPrices, armor6b13FlDefaultPrices, bansheePrices, berkutPrices, cfPrices, crossbowPrices, ewrPrices, h2o2Prices, iskraPrices, lshZ2dtmFsPrices, lshZ2dtmPrices, m9a3DefaultPrices, monocletePePrices, morphinePrices, passPrices, plexiglassPrices, razorPrices, rgd5Prices, rpk16DefaultPrices, rpk16DrumPrices, salewaPrices, srd9Prices, vaselinePrices, waterPrices, x400Prices } from '../__data__/priceMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getSummary()', () => {
  it.each([
    [
      build1,
      {
        armorModifiers: {
          armorClass: 0,
          durability: 0
        },
        ergonomics: 34.39,
        exported: true,
        horizontalRecoil: 226.44,
        id: 'build_1',
        name: 'Build 1',
        lastExported: new Date(2024, 2, 17),
        lastUpdated: new Date(2024, 2, 17),
        price: {
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
        },
        recoil: {
          horizontalRecoil: 226.44,
          verticalRecoil: 76.16
        },
        shoppingList: [
          {
            item: {
              ...rpk16Default,
              prices: rpk16DefaultPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: rpk16Default.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 43345,
              valueInMainCurrency: 43345
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: rpk16Default.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 43345,
              valueInMainCurrency: 43345
            }
          },
          {
            item: {
              ...rpk16Drum,
              prices: rpk16DrumPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: rpk16Drum.id,
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: rpk16Drum.id,
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              ...alkali,
              prices: alkaliPrices
            },
            quantity: 2,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: alkali.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 24218,
              valueInMainCurrency: 24218
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: alkali.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 12109,
              valueInMainCurrency: 12109
            }
          },
          {
            item: {
              ...ammo545us,
              prices: ammo545usPrices
            },
            quantity: 155,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo545us.id,
              merchant: 'prapor',
              merchantLevel: 1,
              quest: undefined,
              value: 14880,
              valueInMainCurrency: 14880
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo545us.id,
              merchant: 'prapor',
              merchantLevel: 1,
              quest: undefined,
              value: 96,
              valueInMainCurrency: 96
            }
          },
          {
            item: {
              ...armor6b13FlDefault,
              prices: armor6b13FlDefaultPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: armor6b13FlDefault.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: {
                id: '638fcd23dc65553116701d33',
                name: 'Audit',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Audit'
              },
              value: 64269,
              valueInMainCurrency: 64269
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: armor6b13FlDefault.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: {
                id: '638fcd23dc65553116701d33',
                name: 'Audit',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Audit'
              },
              value: 64269,
              valueInMainCurrency: 64269
            }
          },
          {
            item: {
              ...lshZ2dtm,
              prices: lshZ2dtmPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: lshZ2dtm.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 63493,
              valueInMainCurrency: 63493
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: lshZ2dtm.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 63493,
              valueInMainCurrency: 63493
            }
          },
          {
            item: {
              ...lshZ2dtmFs,
              prices: lshZ2dtmFsPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: lshZ2dtmFs.id,
              merchant: 'ragman',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: lshZ2dtmFs.id,
              merchant: 'ragman',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              ...plexiglass,
              prices: plexiglassPrices
            },
            quantity: 3,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: plexiglass.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 29805,
              valueInMainCurrency: 29805
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: plexiglass.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 9935,
              valueInMainCurrency: 9935
            }
          },
          {
            item: {
              ...morphine,
              prices: morphinePrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: morphine.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 17421,
              valueInMainCurrency: 17421
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: morphine.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 17421,
              valueInMainCurrency: 17421
            }
          },
          {
            item: {
              ...vaseline,
              prices: vaselinePrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: vaseline.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 27714,
              valueInMainCurrency: 27714
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: vaseline.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 27714,
              valueInMainCurrency: 27714
            }
          },
          {
            item: {
              ...rgd5,
              prices: rgd5Prices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: rgd5.id,
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 11822,
              valueInMainCurrency: 11822
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: rgd5.id,
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 11822,
              valueInMainCurrency: 11822
            }
          },
          {
            item: {
              ...berkut,
              prices: berkutPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: berkut.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 24509,
              valueInMainCurrency: 24509
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: berkut.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 24509,
              valueInMainCurrency: 24509
            }
          },
          {
            item: {
              ...iskra,
              prices: iskraPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: iskra.id,
              merchant: 'jaeger',
              merchantLevel: 2,
              quest: {
                id: '5d25b6be86f77444001e1b89',
                name: 'The Survivalist Path - Thrifty',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty'
              },
              value: 24392,
              valueInMainCurrency: 24392
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: iskra.id,
              merchant: 'jaeger',
              merchantLevel: 2,
              quest: {
                id: '5d25b6be86f77444001e1b89',
                name: 'The Survivalist Path - Thrifty',
                wikiLink: 'https://escapefromtarkov.fandom.com/wiki/The_Survivalist_Path_-_Thrifty'
              },
              value: 24392,
              valueInMainCurrency: 24392
            }
          },
          {
            item: {
              ...water,
              prices: waterPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: water.id,
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: water.id,
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              ...h2o2,
              prices: h2o2Prices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: h2o2.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 11473,
              valueInMainCurrency: 11473
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: h2o2.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 11473,
              valueInMainCurrency: 11473
            }
          },
          {
            item: {
              ...cf,
              prices: cfPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: cf.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 4793,
              valueInMainCurrency: 4793
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: cf.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 4793,
              valueInMainCurrency: 4793
            }
          },
          {
            item: {
              ...crossbow,
              prices: crossbowPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: crossbow.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 3885,
              valueInMainCurrency: 3885
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: crossbow.id,
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 3885,
              valueInMainCurrency: 3885
            }
          }
        ],
        wearableModifiers: {
          ergonomicsPercentageModifier: 0,
          movementSpeedPercentageModifier: 0,
          turningSpeedPercentageModifier: 0
        },
        weight: 24.153
      } as IBuildSummary
    ],
    [
      build2,
      {
        armorModifiers: {
          armorClass: 0,
          durability: 0
        },
        ergonomics: 52.38,
        exported: true,
        id: 'build_2',
        name: 'Build 2',
        lastExported: undefined,
        lastUpdated: undefined,
        price: {
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
        },
        recoil: {
          horizontalRecoil: 254.8,
          verticalRecoil: 367.64
        },
        shoppingList: [
          {
            item: {
              ...m9a3Default,
              prices: [...m9a3DefaultPrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'USD',
              itemId: m9a3Default.id,
              merchant: 'peacekeeper',
              merchantLevel: 1,
              quest: undefined,
              value: 107,
              valueInMainCurrency: 15337
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: m9a3Default.id,
              merchant: 'peacekeeper',
              merchantLevel: 1,
              quest: undefined,
              value: 107,
              valueInMainCurrency: 15337
            }
          },
          {
            item: {
              ...srd9,
              prices: [...srd9Prices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'USD',
              itemId: srd9.id,
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 242,
              valueInMainCurrency: 34606
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: srd9.id,
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 242,
              valueInMainCurrency: 34606
            }
          },
          {
            item: {
              ...ammo9mmGT,
              prices: [...ammo9mmGTPrices]
            },
            quantity: 17,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo9mmGT.id,
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: undefined,
              value: 1241,
              valueInMainCurrency: 1241
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo9mmGT.id,
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: undefined,
              value: 73,
              valueInMainCurrency: 73
            }
          },
          {
            item: {
              ...x400,
              prices: [...x400Prices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'USD',
              itemId: x400.id,
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 95,
              valueInMainCurrency: 13552
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: x400.id,
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 95,
              valueInMainCurrency: 13552
            }
          },
          {
            item: {
              ...banshee,
              prices: [...bansheePrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: banshee.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 33950,
              valueInMainCurrency: 33950
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: banshee.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 33950,
              valueInMainCurrency: 33950
            }
          },
          {
            item: {
              ...monocletePe,
              prices: [...monocletePePrices]
            },
            quantity: 2,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: monocletePe.id,
              merchant: 'peacekeeper',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: monocletePe.id,
              merchant: 'peacekeeper',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              ...pass,
              prices: [...passPrices]
            },
            quantity: 2,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: pass.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 63006,
              valueInMainCurrency: 63006
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: pass.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 31503,
              valueInMainCurrency: 31503
            }
          },
          {
            item: {
              ...salewa,
              prices: [...salewaPrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: salewa.id,
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: salewa.id,
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              ...ewr,
              prices: [...ewrPrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ewr.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 21923,
              valueInMainCurrency: 21923
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ewr.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 21923,
              valueInMainCurrency: 21923
            }
          },
          {
            item: {
              ...razor,
              prices: [...razorPrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: razor.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 64132,
              valueInMainCurrency: 64132
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: razor.id,
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 64132,
              valueInMainCurrency: 64132
            }
          }
        ],
        wearableModifiers: {
          ergonomicsPercentageModifier: 0,
          ergonomicsPercentageModifierWithMods: -0.03,
          movementSpeedPercentageModifier: 0,
          movementSpeedPercentageModifierWithMods: -0.03,
          turningSpeedPercentageModifier: 0,
          turningSpeedPercentageModifierWithMods: -0.01
        },
        weight: 8.936000000000002
      } as IBuildSummary
    ],
    [
      {
        id: 'emptyBuild',
        inventorySlots: [],
        lastExported: new Date(2),
        lastUpdated: new Date(1),
        lastWebsiteVersion: undefined,
        name: 'Empty build'
      } as IBuild,
      {
        armorModifiers: {
          armorClass: 0,
          durability: 0
        },
        ergonomics: 0,
        exported: true,
        id: 'emptyBuild',
        name: 'Empty build',
        lastExported: new Date(2),
        lastUpdated: new Date(1),
        price: {
          missingPrice: false,
          priceInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          priceByCurrency: []
        },
        recoil: {
          horizontalRecoil: 0,
          verticalRecoil: 0
        },
        shoppingList: [],
        wearableModifiers: {
          ergonomicsPercentageModifier: 0,
          movementSpeedPercentageModifier: 0,
          turningSpeedPercentageModifier: 0
        },
        weight: 0
      } as IBuildSummary
    ]
  ])(
    'should get the summary of a build',
    async (build: IBuild, expected: IBuildSummary) => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventoryItemService)
      Services.configure(ItemPropertiesService)
      Services.configure(GlobalFilterService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary(build)

      // Assert
      expect(summary).toStrictEqual(expected)
    }
  )
})