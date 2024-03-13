import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
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
        ergonomics: 34.39,
        exported: true,
        horizontalRecoil: 226.44,
        id: 'build_1',
        name: 'Build 1',
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
        },
        shoppingList: [
          {
            item: {
              ...berkut,
              prices: berkutPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ca20d5986f774331e7c9602',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 24509,
              valueInMainCurrency: 24509
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ca20d5986f774331e7c9602',
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
              itemId: '590c5d4b86f774784e1b9c45',
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
              itemId: '590c5d4b86f774784e1b9c45',
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
              itemId: '5448fee04bdc2dbc018b4567',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '5448fee04bdc2dbc018b4567',
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
              itemId: '59e361e886f774176c10a2a5',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 11891,
              valueInMainCurrency: 11891
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '59e361e886f774176c10a2a5',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 11891,
              valueInMainCurrency: 11891
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
              itemId: '65765f39526e320fbe0357b1',
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
              itemId: '65765f39526e320fbe0357b1',
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
              ...crossbow,
              prices: crossbowPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d5fca1ea4b93635fd598c07',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 3885,
              valueInMainCurrency: 3885
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d5fca1ea4b93635fd598c07',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 3885,
              valueInMainCurrency: 3885
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
              itemId: '5ab8f39486f7745cd93a1cca',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 4793,
              valueInMainCurrency: 4793
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ab8f39486f7745cd93a1cca',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: undefined,
              value: 4793,
              valueInMainCurrency: 4793
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
              itemId: '5d6d3716a4b9361bc8618872',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 62035,
              valueInMainCurrency: 62035
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d6d3716a4b9361bc8618872',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 62035,
              valueInMainCurrency: 62035
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
              itemId: '5d6d3829a4b9361bc8618943',
              merchant: 'ragman',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '5d6d3829a4b9361bc8618943',
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
              itemId: '59e366c186f7741778269d85',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 29805,
              valueInMainCurrency: 29805
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '59e366c186f7741778269d85',
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
              itemId: '544fb3f34bdc2d03748b456a',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 16998,
              valueInMainCurrency: 16998
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '544fb3f34bdc2d03748b456a',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 16998,
              valueInMainCurrency: 16998
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
              itemId: '5755383e24597772cb798966',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 20709,
              valueInMainCurrency: 20709
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5755383e24597772cb798966',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 20709,
              valueInMainCurrency: 20709
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
              itemId: '5448be9a4bdc2dfd2f8b456a',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 11822,
              valueInMainCurrency: 11822
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5448be9a4bdc2dfd2f8b456a',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 11822,
              valueInMainCurrency: 11822
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
              itemId: '56dff4ecd2720b5f5a8b4568',
              merchant: 'prapor',
              merchantLevel: 1,
              quest: undefined,
              value: 14880,
              valueInMainCurrency: 14880
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '56dff4ecd2720b5f5a8b4568',
              merchant: 'prapor',
              merchantLevel: 1,
              quest: undefined,
              value: 96,
              valueInMainCurrency: 96
            }
          },
          {
            item: {
              ...rpk16Default,
              prices: rpk16DefaultPrices
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c0d1ec986f77439512a1a72',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 39415,
              valueInMainCurrency: 39415
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c0d1ec986f77439512a1a72',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 39415,
              valueInMainCurrency: 39415
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
              itemId: '5bed625c0db834001c062946',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '5bed625c0db834001c062946',
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
              itemId: '59faf98186f774067b6be103',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 25912,
              valueInMainCurrency: 25912
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '59faf98186f774067b6be103',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 12956,
              valueInMainCurrency: 12956
            }
          }
        ],
        verticalRecoil: 76.16,
        wearableModifiers: {
          ergonomicsPercentageModifier: 0,
          ergonomicsPercentageModifierWithMods: -0.095,
          movementSpeedPercentageModifier: 0,
          movementSpeedPercentageModifierWithMods: -0.060000000000000005,
          turningSpeedPercentageModifier: 0,
          turningSpeedPercentageModifierWithMods: -0.09
        },
        weight: 24.153
      } as IBuildSummary
    ],
    [
      build2,
      {
        ergonomics: 52.38,
        exported: true,
        horizontalRecoil: 254.8,
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
          priceWithContentInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 237151,
            valueInMainCurrency: 237151
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
              value: 208103,
              valueInMainCurrency: 208103
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
        },
        shoppingList: [
          {
            item: {
              ...razor,
              prices: [...razorPrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5e4d34ca86f774264f758330',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 55864,
              valueInMainCurrency: 55864
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5e4d34ca86f774264f758330',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 55864,
              valueInMainCurrency: 55864
            }
          },
          {
            item: {
              ...m9a3Default,
              prices: [...m9a3DefaultPrices]
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '5d3f0bc986f7743cb332abdc',
              merchant: 'peacekeeper',
              merchantLevel: 1,
              quest: undefined,
              value: 106,
              valueInMainCurrency: 15422
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '5d3f0bc986f7743cb332abdc',
              merchant: 'peacekeeper',
              merchantLevel: 1,
              quest: undefined,
              value: 106,
              valueInMainCurrency: 15422
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
              currencyName: 'RUB',
              itemId: '5c6165902e22160010261b28',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 32468,
              valueInMainCurrency: 32468
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c6165902e22160010261b28',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 32468,
              valueInMainCurrency: 32468
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
              itemId: '5c3df7d588a4501f290594e5',
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: undefined,
              value: 1241,
              valueInMainCurrency: 1241
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c3df7d588a4501f290594e5',
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
              itemId: '56def37dd2720bec348b456a',
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 93,
              valueInMainCurrency: 13626
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '56def37dd2720bec348b456a',
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 93,
              valueInMainCurrency: 13626
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
              itemId: '639343fce101f4caa40a4ef3',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 33950,
              valueInMainCurrency: 33950
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '639343fce101f4caa40a4ef3',
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
              itemId: '656fad8c498d1b7e3e071da0',
              merchant: 'peacekeeper',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '656fad8c498d1b7e3e071da0',
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
              itemId: '62a09cb7a04c0c5c6e0a84f8',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 63006,
              valueInMainCurrency: 63006
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '62a09cb7a04c0c5c6e0a84f8',
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
              itemId: '544fb45d4bdc2dee738b4568',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '544fb45d4bdc2dee738b4568',
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
              itemId: '60098b1705871270cd5352a1',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 21574,
              valueInMainCurrency: 21574
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '60098b1705871270cd5352a1',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: undefined,
              value: 21574,
              valueInMainCurrency: 21574
            }
          }
        ],
        verticalRecoil: 367.64,
        wearableModifiers: {
          ergonomicsPercentageModifier: 0,
          ergonomicsPercentageModifierWithMods: -0.03,
          movementSpeedPercentageModifier: 0,
          movementSpeedPercentageModifierWithMods: -0.03,
          turningSpeedPercentageModifier: 0,
          turningSpeedPercentageModifierWithMods: -0.01
        },
        weight: 8.936
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
        ergonomics: undefined,
        exported: true,
        horizontalRecoil: undefined,
        id: 'emptyBuild',
        name: 'Empty build',
        lastExported: new Date(2),
        lastUpdated: new Date(1),
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
        },
        shoppingList: [],
        verticalRecoil: undefined,
        wearableModifiers: {
          ergonomicsPercentageModifier: 0,
          ergonomicsPercentageModifierWithMods: 0,
          movementSpeedPercentageModifier: 0,
          movementSpeedPercentageModifierWithMods: 0,
          turningSpeedPercentageModifier: 0,
          turningSpeedPercentageModifierWithMods: 0
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