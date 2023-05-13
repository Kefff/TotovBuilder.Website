import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import Services from '../../services/repository/Services'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { build1, build2 } from './BuildPropertiesService.test'
import { usePresetServiceMock } from '../../__mocks__/PresetPropertiesServiceMock'

describe('getSummary()', () => {
  it.each([
    [
      build1,
      {
        ergonomics: 34.9,
        ergonomicsPercentageModifier: -0.07,
        exported: false,
        horizontalRecoil: 200,
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
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 479365,
            valueInMainCurrency: 479365
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: null,
              value: 479365,
              valueInMainCurrency: 479365
            }
          ],
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        },
        shoppingList: [
          {
            item: {
              capacity: 20,
              categoryId: 'backpack',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-icon.webp',
              id: '5ca20d5986f774331e7c9602',
              imageLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-image.webp',
              marketLink: 'https://tarkov.dev/item/wartech-berkut-bb-102-backpack',
              maxStackableAmount: 1,
              name: 'WARTECH Berkut BB-102 backpack',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5ca20d5986f774331e7c9602',
                  merchant: 'ragman',
                  merchantLevel: 1,
                  quest: null,
                  value: 23444,
                  valueInMainCurrency: 23444
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5ca20d5986f774331e7c9602',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 24046,
                  valueInMainCurrency: 24046
                },
                {
                  barterItems: [
                    {
                      itemId: '5c0d2727d174af02a012cf58',
                      quantity: 1
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '5ca20d5986f774331e7c9602',
                  merchant: 'ragman',
                  merchantLevel: 1,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'Berkut',
              weight: 0.96,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/WARTECH_Berkut_BB-102_backpack'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ca20d5986f774331e7c9602',
              merchant: 'ragman',
              merchantLevel: 1,
              quest: null,
              value: 23444,
              valueInMainCurrency: 23444
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ca20d5986f774331e7c9602',
              merchant: 'ragman',
              merchantLevel: 1,
              quest: null,
              value: 23444,
              valueInMainCurrency: 23444
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/590c5d4b86f774784e1b9c45-icon.webp',
              id: '590c5d4b86f774784e1b9c45',
              imageLink: 'https://assets.tarkov.dev/590c5d4b86f774784e1b9c45-image.webp',
              marketLink: 'https://tarkov.dev/item/iskra-ration-pack',
              maxStackableAmount: 1,
              name: 'Iskra ration pack',
              prices: [
                {
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
                  value: 23178,
                  valueInMainCurrency: 23178
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '590c5d4b86f774784e1b9c45',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 21870,
                  valueInMainCurrency: 21870
                },
                {
                  barterItems: [
                    {
                      itemId: '5d1b3f2d86f774253763b735',
                      quantity: 1
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '590c5d4b86f774784e1b9c45',
                  merchant: 'therapist',
                  merchantLevel: 1,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'Iskra',
              weight: 1.75,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Iskra_ration_pack'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '590c5d4b86f774784e1b9c45',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '590c5d4b86f774784e1b9c45',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/5d1b3f2d86f774253763b735-icon.webp',
              id: '5d1b3f2d86f774253763b735',
              imageLink: 'https://assets.tarkov.dev/5d1b3f2d86f774253763b735-image.webp',
              marketLink: 'https://tarkov.dev/item/disposable-syringe',
              maxStackableAmount: 1,
              name: 'Disposable syringe',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d1b3f2d86f774253763b735',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 21792,
                  valueInMainCurrency: 21792
                }
              ],
              shortName: 'Syringe',
              weight: 0.06,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Disposable_syringe'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d1b3f2d86f774253763b735',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 21792,
              valueInMainCurrency: 21792
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d1b3f2d86f774253763b735',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 21792,
              valueInMainCurrency: 21792
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-icon.webp',
              id: '5448fee04bdc2dbc018b4567',
              imageLink: 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-image.webp',
              marketLink: 'https://tarkov.dev/item/bottle-of-water-06l',
              maxStackableAmount: 1,
              name: 'Bottle of water (0.6L)',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5448fee04bdc2dbc018b4567',
                  merchant: 'therapist',
                  merchantLevel: 1,
                  quest: null,
                  value: 12401,
                  valueInMainCurrency: 12401
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5448fee04bdc2dbc018b4567',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 18179,
                  valueInMainCurrency: 18179
                },
                {
                  barterItems: [
                    {
                      itemId: '59e361e886f774176c10a2a5',
                      quantity: 1
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '5448fee04bdc2dbc018b4567',
                  merchant: 'therapist',
                  merchantLevel: 1,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'Water',
              weight: 0.65,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Bottle_of_water_(0.6L)'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5448fee04bdc2dbc018b4567',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: null,
              value: 12401,
              valueInMainCurrency: 12401
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5448fee04bdc2dbc018b4567',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: null,
              value: 12401,
              valueInMainCurrency: 12401
            }
          },
          {
            item: {
              armorClass: 4,
              armoredAreas: [
                'Thorax',
                'Stomach'
              ],
              categoryId: 'armor',
              conflictingItemIds: [],
              durability: 47,
              ergonomicsPercentageModifier: -0.02,
              iconLink: 'https://assets.tarkov.dev/5c0e51be86f774598e797894-icon.webp',
              id: '5c0e51be86f774598e797894',
              imageLink: 'https://assets.tarkov.dev/5c0e51be86f774598e797894-image.webp',
              marketLink: 'https://tarkov.dev/item/6b13-assault-armor-flora',
              material: 'Ceramic',
              maxStackableAmount: 1,
              movementSpeedPercentageModifier: -0.06,
              name: '6B13 assault armor (Flora)',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c0e51be86f774598e797894',
                  merchant: 'ragman',
                  merchantLevel: 2,
                  quest: null,
                  value: 77995,
                  valueInMainCurrency: 77995
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c0e51be86f774598e797894',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 67745,
                  valueInMainCurrency: 67745
                }
              ],
              ricochetChance: '',
              shortName: '6B13 FL',
              turningSpeedPercentageModifier: -0.01,
              weight: 10.5,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B13_assault_armor'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c0e51be86f774598e797894',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 67745,
              valueInMainCurrency: 67745
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c0e51be86f774598e797894',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 67745,
              valueInMainCurrency: 67745
            }
          },
          {
            item: {
              blindnessProtectionPercentage: 0.3,
              categoryId: 'eyewear',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/5d5fca1ea4b93635fd598c07-icon.webp',
              id: '5d5fca1ea4b93635fd598c07',
              imageLink: 'https://assets.tarkov.dev/5d5fca1ea4b93635fd598c07-image.webp',
              marketLink: 'https://tarkov.dev/item/crossbow-tactical-glasses',
              maxStackableAmount: 1,
              name: 'Crossbow tactical glasses',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d5fca1ea4b93635fd598c07',
                  merchant: 'ragman',
                  merchantLevel: 2,
                  quest: null,
                  value: 3885,
                  valueInMainCurrency: 3885
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d5fca1ea4b93635fd598c07',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 12832,
                  valueInMainCurrency: 12832
                }
              ],
              shortName: 'Crossbow',
              weight: 0.03,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Crossbow_tactical_glasses'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d5fca1ea4b93635fd598c07',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: null,
              value: 3885,
              valueInMainCurrency: 3885
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d5fca1ea4b93635fd598c07',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: null,
              value: 3885,
              valueInMainCurrency: 3885
            }
          },
          {
            item: {
              categoryId: 'faceCover',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/5ab8f39486f7745cd93a1cca-icon.webp',
              id: '5ab8f39486f7745cd93a1cca',
              imageLink: 'https://assets.tarkov.dev/5ab8f39486f7745cd93a1cca-image.webp',
              marketLink: 'https://tarkov.dev/item/cold-fear-infrared-balaclava',
              maxStackableAmount: 1,
              name: 'Cold Fear infrared balaclava',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5ab8f39486f7745cd93a1cca',
                  merchant: 'ragman',
                  merchantLevel: 2,
                  quest: null,
                  value: 4793,
                  valueInMainCurrency: 4793
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5ab8f39486f7745cd93a1cca',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 13766,
                  valueInMainCurrency: 13766
                }
              ],
              shortName: 'CF',
              weight: 0.1,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Cold_Fear_infrared_balaclava'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ab8f39486f7745cd93a1cca',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: null,
              value: 4793,
              valueInMainCurrency: 4793
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5ab8f39486f7745cd93a1cca',
              merchant: 'ragman',
              merchantLevel: 2,
              quest: null,
              value: 4793,
              valueInMainCurrency: 4793
            }
          },
          {
            item: {
              armorClass: 4,
              armoredAreas: [
                'TopOfTheHead',
                'Nape',
                'Ears'
              ],
              baseItemId: null,
              blocksHeadphones: true,
              categoryId: 'headwear',
              conflictingItemIds: [],
              deafening: 'High',
              defaultPresetId: null,
              durability: 55,
              ergonomicsPercentageModifier: -0.03,
              iconLink: 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-icon.webp',
              id: '5d6d3716a4b9361bc8618872',
              imageLink: 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-image.webp',
              marketLink: 'https://tarkov.dev/item/bnti-lshz-2dtm-helmet',
              material: 'CombinedMaterials',
              maxStackableAmount: 1,
              modSlots: [
                {
                  compatibleItemIds: [
                    '5d6d3829a4b9361bc8618943'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_equipment_000',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5c0558060db834001b735271',
                    '5a16b8a9fcdbcb00165aa6ca'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_nvg',
                  required: false
                },
                {
                  compatibleItemIds: [],
                  maxStackableAmount: 1,
                  name: 'mod_mount',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5d6d3be5a4b9361bc73bc763'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_equipment_001',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5d6d3943a4b9360dbc46d0cc'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_equipment_002',
                  required: false
                }
              ],
              movementSpeedPercentageModifier: 0,
              name: 'BNTI LShZ-2DTM helmet',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d6d3716a4b9361bc8618872',
                  merchant: 'ragman',
                  merchantLevel: 3,
                  quest: null,
                  value: 163075,
                  valueInMainCurrency: 163075
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d6d3716a4b9361bc8618872',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 79805,
                  valueInMainCurrency: 79805
                }
              ],
              ricochetChance: 'High',
              shortName: 'LShZ-2DTM',
              turningSpeedPercentageModifier: -0.03,
              weight: 3.4,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/BNTI_LShZ-2DTM_helmet'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d6d3716a4b9361bc8618872',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 79805,
              valueInMainCurrency: 79805
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d6d3716a4b9361bc8618872',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 79805,
              valueInMainCurrency: 79805
            }
          },
          {
            item: {
              armorClass: 4,
              armoredAreas: [
                'Eyes',
                'Jaws'
              ],
              baseItemId: null,
              blindnessProtectionPercentage: 0.1,
              categoryId: 'armorMod',
              conflictingItemIds: [
                '5c0696830db834001d23f5da',
                '5c066e3a0db834001b7353f0',
                '5c0558060db834001b735271',
                '57235b6f24597759bf5a30f1',
                '5c110624d174af029e69734c'
              ],
              defaultPresetId: null,
              durability: 50,
              ergonomicsPercentageModifier: -0.02,
              iconLink: 'https://assets.tarkov.dev/5d6d3829a4b9361bc8618943-icon.webp',
              id: '5d6d3829a4b9361bc8618943',
              imageLink: 'https://assets.tarkov.dev/5d6d3829a4b9361bc8618943-image.webp',
              marketLink: 'https://tarkov.dev/item/lshz-2dtm-face-shield',
              material: 'Glass',
              maxStackableAmount: 1,
              modSlots: [],
              movementSpeedPercentageModifier: 0,
              name: 'LShZ-2DTM face shield',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d6d3829a4b9361bc8618943',
                  merchant: 'ragman',
                  merchantLevel: 4,
                  quest: null,
                  value: 37019,
                  valueInMainCurrency: 37019
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d6d3829a4b9361bc8618943',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 68225,
                  valueInMainCurrency: 68225
                },
                {
                  barterItems: [
                    {
                      itemId: '59e366c186f7741778269d85',
                      quantity: 3
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '5d6d3829a4b9361bc8618943',
                  merchant: 'ragman',
                  merchantLevel: 3,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              ricochetChance: '',
              shortName: '2DTM FS',
              turningSpeedPercentageModifier: -0.05,
              weight: 1,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/LShZ-2DTM_face_shield'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d6d3829a4b9361bc8618943',
              merchant: 'ragman',
              merchantLevel: 4,
              quest: null,
              value: 37019,
              valueInMainCurrency: 37019
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5d6d3829a4b9361bc8618943',
              merchant: 'ragman',
              merchantLevel: 4,
              quest: null,
              value: 37019,
              valueInMainCurrency: 37019
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/544fb3f34bdc2d03748b456a-icon.webp',
              id: '544fb3f34bdc2d03748b456a',
              imageLink: 'https://assets.tarkov.dev/544fb3f34bdc2d03748b456a-image.webp',
              marketLink: 'https://tarkov.dev/item/morphine-injector',
              maxStackableAmount: 1,
              name: 'Morphine injector',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '544fb3f34bdc2d03748b456a',
                  merchant: 'therapist',
                  merchantLevel: 4,
                  quest: {
                    id: '5a68665c86f774255929b4c7',
                    name: 'Health Care Privacy - Part 3',
                    wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Health_Care_Privacy_-_Part_3'
                  },
                  value: 42133,
                  valueInMainCurrency: 42133
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '544fb3f34bdc2d03748b456a',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 18810,
                  valueInMainCurrency: 18810
                }
              ],
              shortName: 'Morphine',
              weight: 0.05,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Morphine_injector'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '544fb3f34bdc2d03748b456a',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 18810,
              valueInMainCurrency: 18810
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '544fb3f34bdc2d03748b456a',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 18810,
              valueInMainCurrency: 18810
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/5755383e24597772cb798966-icon.webp',
              id: '5755383e24597772cb798966',
              imageLink: 'https://assets.tarkov.dev/5755383e24597772cb798966-image.webp',
              marketLink: 'https://tarkov.dev/item/vaseline-balm',
              maxStackableAmount: 1,
              name: 'Vaseline balm',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5755383e24597772cb798966',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 37155,
                  valueInMainCurrency: 37155
                }
              ],
              shortName: 'Vaseline',
              weight: 0.016,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Vaseline_balm'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5755383e24597772cb798966',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 37155,
              valueInMainCurrency: 37155
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5755383e24597772cb798966',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 37155,
              valueInMainCurrency: 37155
            }
          },
          {
            item: {
              categoryId: 'grenade',
              conflictingItemIds: [],
              explosionDelay: 3.5,
              fragmentsAmount: 70,
              iconLink: 'https://assets.tarkov.dev/5448be9a4bdc2dfd2f8b456a-icon.webp',
              id: '5448be9a4bdc2dfd2f8b456a',
              imageLink: 'https://assets.tarkov.dev/5448be9a4bdc2dfd2f8b456a-image.webp',
              marketLink: 'https://tarkov.dev/item/rgd-5-hand-grenade',
              maxStackableAmount: 1,
              maximumExplosionRange: 7,
              minimumExplosionRange: 3,
              name: 'RGD-5 hand grenade',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5448be9a4bdc2dfd2f8b456a',
                  merchant: 'prapor',
                  merchantLevel: 3,
                  quest: null,
                  value: 11822,
                  valueInMainCurrency: 11822
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5448be9a4bdc2dfd2f8b456a',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 15928,
                  valueInMainCurrency: 15928
                },
                {
                  barterItems: [
                    {
                      itemId: '590a3cd386f77436f20848cb',
                      quantity: 2
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '5448be9a4bdc2dfd2f8b456a',
                  merchant: 'prapor',
                  merchantLevel: 2,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'RGD-5',
              type: 'Grenade',
              weight: 0.31,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RGD-5_hand_grenade'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5448be9a4bdc2dfd2f8b456a',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: null,
              value: 11822,
              valueInMainCurrency: 11822
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5448be9a4bdc2dfd2f8b456a',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: null,
              value: 11822,
              valueInMainCurrency: 11822
            }
          },
          {
            item: {
              accuracyPercentageModifier: 0,
              armorDamagePercentage: 0.41,
              armorPenetrations: [
                6,
                6,
                6,
                4,
                3,
                1
              ],
              blinding: false,
              caliber: 'Caliber545x39',
              categoryId: 'ammunition',
              conflictingItemIds: [],
              durabilityBurnPercentageModifier: 0.35,
              fleshDamage: 45,
              fragmentationChancePercentage: 0.16,
              heavyBleedingPercentageChance: 0,
              iconLink: 'https://assets.tarkov.dev/56dfef82d2720bbd668b4567-icon.webp',
              id: '56dfef82d2720bbd668b4567',
              imageLink: 'https://assets.tarkov.dev/56dfef82d2720bbd668b4567-image.webp',
              lightBleedingPercentageChance: 0,
              marketLink: 'https://tarkov.dev/item/545x39mm-bp-gs',
              maxStackableAmount: 60,
              name: '5.45x39mm BP gs',
              penetrationPower: 37,
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '56dfef82d2720bbd668b4567',
                  merchant: 'prapor',
                  merchantLevel: 3,
                  quest: null,
                  value: 443,
                  valueInMainCurrency: 443
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '56dfef82d2720bbd668b4567',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 683,
                  valueInMainCurrency: 683
                }
              ],
              projectiles: 1,
              recoilPercentageModifier: 0,
              shortName: 'BP',
              subsonic: false,
              tracer: false,
              velocity: 890,
              weight: 0.01,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_BP_gs'
            },
            quantity: 156,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '56dfef82d2720bbd668b4567',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: null,
              value: 69108,
              valueInMainCurrency: 69108
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '56dfef82d2720bbd668b4567',
              merchant: 'prapor',
              merchantLevel: 3,
              quest: null,
              value: 443,
              valueInMainCurrency: 443
            }
          },
          {
            item: {
              baseItemId: '5beed0f50db834001c062b12',
              caliber: 'Caliber545x39',
              categoryId: 'mainWeapon',
              conflictingItemIds: [],
              defaultPresetId: null,
              ergonomics: 45,
              fireModes: [
                'SingleFire',
                'FullAuto'
              ],
              fireRate: 650,
              horizontalRecoil: 370,
              iconLink: 'https://assets.tarkov.dev/5c0d1ec986f77439512a1a72-icon.webp',
              id: '5c0d1ec986f77439512a1a72',
              imageLink: 'https://assets.tarkov.dev/5c0d1ec986f77439512a1a72-image.webp',
              marketLink: 'https://tarkov.dev/item/rpk-16-545x39-light-machine-gun-default',
              maxStackableAmount: 1,
              minuteOfAngle: 3.03,
              modSlots: [
                {
                  compatibleItemIds: [
                    '5c0d5e4486f77478390952fe',
                    '61962b617c6c7b169525f168',
                    '56dfef82d2720bbd668b4567',
                    '56dff026d2720bb8668b4567',
                    '56dff061d2720bb5668b4567',
                    '56dff0bed2720bb0668b4567',
                    '56dff216d2720bbd668b4568',
                    '56dff2ced2720bb4668b4567',
                    '56dff338d2720bbd668b4569',
                    '56dff3afd2720bba668b4567',
                    '56dff421d2720b5f5a8b4567',
                    '56dff4a2d2720bbd668b456a',
                    '56dff4ecd2720b5f5a8b4568'
                  ],
                  maxStackableAmount: 1,
                  name: 'chamber0',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5beec8ea0db834001a6f9dbf',
                    '5649ad3f4bdc2df8348b4585',
                    '5649ade84bdc2d1b2b8b4587',
                    '59e62cc886f77440d40b52a1',
                    '5a0071d486f77404e23a12b2',
                    '57e3dba62459770f0c32322b',
                    '5cf54404d7f00c108840b2ef',
                    '5b30ac585acfc433000eb79c',
                    '59e6318286f77444dd62c4cc',
                    '5cf50850d7f00c056e24104c',
                    '5cf508bfd7f00c056e24104e',
                    '5947f92f86f77427344a76b1',
                    '5947fa2486f77425b47c1a9b',
                    '5c6bf4aa2e2216001219b0ae',
                    '5649ae4a4bdc2d1b2b8b4588',
                    '5998517986f7746017232f7e',
                    '623c3be0484b5003161840dc',
                    '628a664bccaab13006640e47',
                    '628c9ab845c59e5b80768a81',
                    '5e2192a498a36665e8337386',
                    '6087e663132d4d12c81fd96b',
                    '5f6341043ada5942720e2dc5'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_pistol_grip',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5beec91a0db834001961942d'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_reciever',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '564ca9df4bdc2d35148b4569',
                    '564ca99c4bdc2d16268b4589',
                    '55d480c04bdc2d1d4e8b456a',
                    '5cbdaf89ae9215000e5b9c94',
                    '55d481904bdc2d8c2f8b456a',
                    '55d482194bdc2d1d4e8b456b',
                    '55d4837c4bdc2d1d4e8b456c',
                    '5aaa4194e5b5b055d06310a5',
                    '5bed61680db834001d2c45ab',
                    '5bed625c0db834001c062946'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_magazine',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '6130ca3fd92c473c77020dbd',
                    '5648ac824bdc2ded0b8b457d'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_charge',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5beec8b20db834001961942a'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_stock_001',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5beec3e30db8340019619424'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_handguard',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5beec1bd0db834001e6006f3',
                    '5beec2820db834001b095426'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_barrel',
                  required: false
                }
              ],
              name: 'RPK-16 5.45x39 light machine gun Default',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c0d1ec986f77439512a1a72',
                  merchant: 'prapor',
                  merchantLevel: 4,
                  quest: null,
                  value: 68452,
                  valueInMainCurrency: 68452
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c0d1ec986f77439512a1a72',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 60572,
                  valueInMainCurrency: 60572
                },
                {
                  barterItems: [
                    {
                      itemId: '5c06782b86f77426df5407d2',
                      quantity: 8
                    },
                    {
                      itemId: '5d1c819a86f774771b0acd6c',
                      quantity: 2
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '5c0d1ec986f77439512a1a72',
                  merchant: 'mechanic',
                  merchantLevel: 3,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'RPK-16 Default',
              verticalRecoil: 131,
              weight: 1.5,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_light_machine_gun'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c0d1ec986f77439512a1a72',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 60572,
              valueInMainCurrency: 60572
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c0d1ec986f77439512a1a72',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 60572,
              valueInMainCurrency: 60572
            }
          },
          {
            item: {
              acceptedAmmunitionIds: [
                '5c0d5e4486f77478390952fe',
                '61962b617c6c7b169525f168',
                '56dfef82d2720bbd668b4567',
                '56dff026d2720bb8668b4567',
                '56dff061d2720bb5668b4567',
                '56dff0bed2720bb0668b4567',
                '56dff216d2720bbd668b4568',
                '56dff2ced2720bb4668b4567',
                '56dff338d2720bbd668b4569',
                '56dff3afd2720bba668b4567',
                '56dff421d2720b5f5a8b4567',
                '56dff4a2d2720bbd668b456a',
                '56dff4ecd2720b5f5a8b4568'
              ],
              baseItemId: null,
              capacity: 95,
              categoryId: 'magazine',
              checkSpeedPercentageModifier: 0.25,
              conflictingItemIds: [],
              defaultPresetId: null,
              ergonomicsModifier: -24,
              iconLink: 'https://assets.tarkov.dev/5bed625c0db834001c062946-icon.webp',
              id: '5bed625c0db834001c062946',
              imageLink: 'https://assets.tarkov.dev/5bed625c0db834001c062946-image.webp',
              loadSpeedPercentageModifier: 0.9,
              malfunctionPercentage: 0.394,
              marketLink: 'https://tarkov.dev/item/rpk-16-545x39-95-round-drum-magazine',
              maxStackableAmount: 1,
              modSlots: [],
              name: 'RPK-16 5.45x39 95-round drum magazine',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5bed625c0db834001c062946',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 31014,
                  valueInMainCurrency: 31014
                },
                {
                  barterItems: [
                    {
                      itemId: '59faf98186f774067b6be103',
                      quantity: 2
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '5bed625c0db834001c062946',
                  merchant: 'prapor',
                  merchantLevel: 3,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'RPK-16 drum',
              weight: 0.68,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_95-round_drum_magazine'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5bed625c0db834001c062946',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 31014,
              valueInMainCurrency: 31014
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5bed625c0db834001c062946',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 31014,
              valueInMainCurrency: 31014
            }
          }
        ],
        verticalRecoil: 71,
        weight: 24.148
      } as IBuildSummary
    ],
    [
      build2,
      {
        ergonomics: 54,
        ergonomicsPercentageModifier: 0,
        exported: false,
        horizontalRecoil: 234,
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
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 138648,
            valueInMainCurrency: 138648
          },
          pricesWithContent: [
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: null,
              value: 246,
              valueInMainCurrency: 27552
            },
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: null,
              value: 111096,
              valueInMainCurrency: 111096
            }
          ],
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        },
        shoppingList: [
          {
            item: {
              categoryId: 'headphones',
              conflictingItemIds: [
                '5a16b9fffcdbcb0176308b34'
              ],
              iconLink: 'https://assets.tarkov.dev/5e4d34ca86f774264f758330-icon.webp',
              id: '5e4d34ca86f774264f758330',
              imageLink: 'https://assets.tarkov.dev/5e4d34ca86f774264f758330-image.webp',
              marketLink: 'https://tarkov.dev/item/walkers-razor-digital-headset',
              maxStackableAmount: 1,
              name: 'Walker\'s Razor Digital headset',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5e4d34ca86f774264f758330',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 36195,
                  valueInMainCurrency: 36195
                }
              ],
              shortName: 'Razor',
              weight: 0.43,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Walker%27s_Razor_Digital_headset'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5e4d34ca86f774264f758330',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 36195,
              valueInMainCurrency: 36195
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5e4d34ca86f774264f758330',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 36195,
              valueInMainCurrency: 36195
            }
          },
          {
            item: {
              baseItemId: '5cadc190ae921500103bb3b6',
              caliber: 'Caliber9x19PARA',
              categoryId: 'secondaryWeapon',
              conflictingItemIds: [],
              defaultPresetId: null,
              ergonomics: 70,
              fireModes: [
                'SingleFire'
              ],
              fireRate: 30,
              horizontalRecoil: 280,
              iconLink: 'https://assets.tarkov.dev/5d3f0bc986f7743cb332abdc-icon.webp',
              id: '5d3f0bc986f7743cb332abdc',
              imageLink: 'https://assets.tarkov.dev/5d3f0bc986f7743cb332abdc-image.webp',
              marketLink: 'https://tarkov.dev/item/beretta-m9a3-9x19-pistol-default',
              maxStackableAmount: 1,
              minuteOfAngle: 9.97,
              modSlots: [
                {
                  compatibleItemIds: [
                    '5efb0da7a29a85116f6ea05f',
                    '5c3df7d588a4501f290594e5',
                    '58864a4f2459770fcc257101',
                    '56d59d3ad2720bdb418b4577',
                    '5c925fa22e221601da359b7b',
                    '5a3c16fe86f77452b62de32a',
                    '5efb0e16aeb21837e749c7ff',
                    '5c0d56a986f774449d5de529'
                  ],
                  maxStackableAmount: 1,
                  name: 'chamber0',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5cadc1c6ae9215000f2775a4'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_barrel',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5cadc431ae921500113bb8d5'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_pistol_grip',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5cadc55cae921500103bb3be'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_reciever',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5cadc2e0ae9215051e1c21e7'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_magazine',
                  required: false
                },
                {
                  compatibleItemIds: [
                    '5a800961159bd4315e3a1657',
                    '5cc9c20cd7f00c001336c65d',
                    '5d2369418abbc306c62e0c80',
                    '5b07dd285acfc4001754240d',
                    '56def37dd2720bec348b456a',
                    '5a7b483fe899ef0016170d15',
                    '5a5f1ce64f39f90b401987bc',
                    '560d657b4bdc2da74d8b4572',
                    '5a7b4900e899ef197b331a2a',
                    '5b3a08b25acfc4001754880c',
                    '6272370ee4013c5d7e31f418',
                    '6272379924e29f06af4d5ecb'
                  ],
                  maxStackableAmount: 1,
                  name: 'mod_tactical',
                  required: false
                }
              ],
              name: 'Beretta M9A3 9x19 pistol Default',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'USD',
                  itemId: '5d3f0bc986f7743cb332abdc',
                  merchant: 'peacekeeper',
                  merchantLevel: 1,
                  quest: null,
                  value: 124,
                  valueInMainCurrency: 13888
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5d3f0bc986f7743cb332abdc',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 14253,
                  valueInMainCurrency: 14253
                }
              ],
              shortName: 'M9A3 Default',
              verticalRecoil: 475,
              weight: 0.231,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Beretta_M9A3_9x19_pistol'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '5d3f0bc986f7743cb332abdc',
              merchant: 'peacekeeper',
              merchantLevel: 1,
              quest: null,
              value: 124,
              valueInMainCurrency: 13888
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '5d3f0bc986f7743cb332abdc',
              merchant: 'peacekeeper',
              merchantLevel: 1,
              quest: null,
              value: 124,
              valueInMainCurrency: 13888
            }
          },
          {
            item: {
              accuracyPercentageModifier: 0.01,
              baseItemId: null,
              categoryId: 'rangedWeaponMod',
              conflictingItemIds: [],
              defaultPresetId: null,
              ergonomicsModifier: -15,
              iconLink: 'https://assets.tarkov.dev/5c6165902e22160010261b28-icon.webp',
              id: '5c6165902e22160010261b28',
              imageLink: 'https://assets.tarkov.dev/5c6165902e22160010261b28-image.webp',
              marketLink: 'https://tarkov.dev/item/sig-sauer-srd9-9x19-sound-suppressor',
              maxStackableAmount: 1,
              modSlots: [],
              name: 'SIG Sauer SRD9 9x19 sound suppressor',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'USD',
                  itemId: '5c6165902e22160010261b28',
                  merchant: 'peacekeeper',
                  merchantLevel: 2,
                  quest: null,
                  value: 310,
                  valueInMainCurrency: 34720
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c6165902e22160010261b28',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 29957,
                  valueInMainCurrency: 29957
                }
              ],
              recoilPercentageModifier: -0.08,
              shortName: 'SRD9',
              weight: 0.255,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/SIG_Sauer_SRD9_9x19_sound_suppressor'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c6165902e22160010261b28',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 29957,
              valueInMainCurrency: 29957
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c6165902e22160010261b28',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 29957,
              valueInMainCurrency: 29957
            }
          },
          {
            item: {
              accuracyPercentageModifier: -0.05,
              armorDamagePercentage: 0.33,
              armorPenetrations: [
                6,
                3,
                1,
                0,
                0,
                0
              ],
              blinding: false,
              caliber: 'Caliber9x19PARA',
              categoryId: 'ammunition',
              conflictingItemIds: [],
              durabilityBurnPercentageModifier: 0.15,
              fleshDamage: 58,
              fragmentationChancePercentage: 0.15,
              heavyBleedingPercentageChance: 0,
              iconLink: 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-icon.webp',
              id: '5c3df7d588a4501f290594e5',
              imageLink: 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-image.webp',
              lightBleedingPercentageChance: 0,
              marketLink: 'https://tarkov.dev/item/9x19mm-green-tracer',
              maxStackableAmount: 50,
              name: '9x19mm Green Tracer',
              penetrationPower: 14,
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c3df7d588a4501f290594e5',
                  merchant: 'mechanic',
                  merchantLevel: 1,
                  quest: null,
                  value: 73,
                  valueInMainCurrency: 73
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '5c3df7d588a4501f290594e5',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 134,
                  valueInMainCurrency: 134
                }
              ],
              projectiles: 1,
              recoilPercentageModifier: -0.06,
              shortName: 'GT',
              subsonic: false,
              tracer: true,
              velocity: 365,
              weight: 0.006,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/9x19mm_Green_Tracer'
            },
            quantity: 18,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c3df7d588a4501f290594e5',
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: null,
              value: 1314,
              valueInMainCurrency: 1314
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '5c3df7d588a4501f290594e5',
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: null,
              value: 73,
              valueInMainCurrency: 73
            }
          },
          {
            item: {
              accuracyPercentageModifier: 0,
              baseItemId: null,
              categoryId: 'rangedWeaponMod',
              conflictingItemIds: [],
              defaultPresetId: null,
              ergonomicsModifier: -1,
              iconLink: 'https://assets.tarkov.dev/56def37dd2720bec348b456a-icon.webp',
              id: '56def37dd2720bec348b456a',
              imageLink: 'https://assets.tarkov.dev/56def37dd2720bec348b456a-image.webp',
              marketLink: 'https://tarkov.dev/item/surefire-x400-ultra-tactical-flashlight-with-laser',
              maxStackableAmount: 1,
              modSlots: [],
              name: 'SureFire X400 Ultra tactical flashlight with laser',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'USD',
                  itemId: '56def37dd2720bec348b456a',
                  merchant: 'peacekeeper',
                  merchantLevel: 2,
                  quest: null,
                  value: 122,
                  valueInMainCurrency: 13664
                },
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '56def37dd2720bec348b456a',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 14797,
                  valueInMainCurrency: 14797
                }
              ],
              recoilPercentageModifier: 0,
              shortName: 'X400',
              weight: 0.138,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/SureFire_X400_Ultra_tactical_flashlight_with_laser'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '56def37dd2720bec348b456a',
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: null,
              value: 122,
              valueInMainCurrency: 13664
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'USD',
              itemId: '56def37dd2720bec348b456a',
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: null,
              value: 122,
              valueInMainCurrency: 13664
            }
          },
          {
            item: {
              armorClass: 0,
              armoredAreas: [],
              capacity: 6,
              categoryId: 'vest',
              conflictingItemIds: [],
              durability: 0,
              ergonomicsPercentageModifier: 0,
              iconLink: 'https://assets.tarkov.dev/572b7adb24597762ae139821-icon.webp',
              id: '572b7adb24597762ae139821',
              imageLink: 'https://assets.tarkov.dev/572b7adb24597762ae139821-image.webp',
              marketLink: 'https://tarkov.dev/item/scav-vest',
              material: '',
              maxStackableAmount: 1,
              movementSpeedPercentageModifier: 0,
              name: 'Scav Vest',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '572b7adb24597762ae139821',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 20504,
                  valueInMainCurrency: 20504
                },
                {
                  barterItems: [
                    {
                      itemId: '544fb6cc4bdc2d34748b456e',
                      quantity: 1
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '572b7adb24597762ae139821',
                  merchant: 'jaeger',
                  merchantLevel: 1,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              ricochetChance: '',
              shortName: 'Scav Vest',
              turningSpeedPercentageModifier: 0,
              weight: 0.4,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Scav_Vest'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '572b7adb24597762ae139821',
              merchant: 'jaeger',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '572b7adb24597762ae139821',
              merchant: 'jaeger',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/544fb6cc4bdc2d34748b456e-icon.webp',
              id: '544fb6cc4bdc2d34748b456e',
              imageLink: 'https://assets.tarkov.dev/544fb6cc4bdc2d34748b456e-image.webp',
              marketLink: 'https://tarkov.dev/item/slickers-chocolate-bar',
              maxStackableAmount: 1,
              name: 'Slickers chocolate bar',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '544fb6cc4bdc2d34748b456e',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 10893,
                  valueInMainCurrency: 10893
                },
                {
                  barterItems: [
                    {
                      itemId: '57513fcc24597720a31c09a6',
                      quantity: 1
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '544fb6cc4bdc2d34748b456e',
                  merchant: 'therapist',
                  merchantLevel: 1,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'Slickers',
              weight: 0.048,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Slickers_chocolate_bar'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '544fb6cc4bdc2d34748b456e',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 10893,
              valueInMainCurrency: 10893
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '544fb6cc4bdc2d34748b456e',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 10893,
              valueInMainCurrency: 10893
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/544fb45d4bdc2dee738b4568-icon.webp',
              id: '544fb45d4bdc2dee738b4568',
              imageLink: 'https://assets.tarkov.dev/544fb45d4bdc2dee738b4568-image.webp',
              marketLink: 'https://tarkov.dev/item/salewa-first-aid-kit',
              maxStackableAmount: 1,
              name: 'Salewa first aid kit',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '544fb45d4bdc2dee738b4568',
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
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '544fb45d4bdc2dee738b4568',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 33428,
                  valueInMainCurrency: 33428
                },
                {
                  barterItems: [
                    {
                      itemId: '59e3596386f774176c10a2a2',
                      quantity: 1
                    }
                  ],
                  currencyName: 'barter',
                  itemId: '544fb45d4bdc2dee738b4568',
                  merchant: 'therapist',
                  merchantLevel: 1,
                  quest: null,
                  value: 0,
                  valueInMainCurrency: 0
                }
              ],
              shortName: 'Salewa',
              weight: 0.6,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Salewa_first_aid_kit'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '544fb45d4bdc2dee738b4568',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'barter',
              itemId: '544fb45d4bdc2dee738b4568',
              merchant: 'therapist',
              merchantLevel: 1,
              quest: null,
              value: 0,
              valueInMainCurrency: 0
            }
          },
          {
            item: {
              categoryId: 'other',
              conflictingItemIds: [],
              iconLink: 'https://assets.tarkov.dev/59e3596386f774176c10a2a2-icon.webp',
              id: '59e3596386f774176c10a2a2',
              imageLink: 'https://assets.tarkov.dev/59e3596386f774176c10a2a2-image.webp',
              marketLink: 'https://tarkov.dev/item/paid-antiroach-spray',
              maxStackableAmount: 1,
              name: 'PAID AntiRoach spray',
              prices: [
                {
                  barterItems: [],
                  currencyName: 'RUB',
                  itemId: '59e3596386f774176c10a2a2',
                  merchant: 'flea-market',
                  merchantLevel: 0,
                  quest: null,
                  value: 32737,
                  valueInMainCurrency: 32737
                }
              ],
              shortName: 'PAID',
              weight: 0.5,
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/PAID_AntiRoach_spray'
            },
            quantity: 1,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '59e3596386f774176c10a2a2',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 32737,
              valueInMainCurrency: 32737
            },
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '59e3596386f774176c10a2a2',
              merchant: 'flea-market',
              merchantLevel: 0,
              quest: null,
              value: 32737,
              valueInMainCurrency: 32737
            }
          }
        ],
        verticalRecoil: 397,
        weight: 3.562
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
        ergonomicsPercentageModifier: 0,
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
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
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
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        },
        shoppingList: [],
        verticalRecoil: undefined,
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
      expect(summary?.success).toBe(true)
      expect(summary?.value).toStrictEqual(expected)
    }
  )

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    useItemServiceMock(false)
    const service = new BuildPropertiesService()

    // Act
    const summary = await service.getSummary(build1)

    // Assert
    expect(summary.success).toBe(false)
    expect(summary.failureMessage).toBe('Main currency not found.')
  })

  it('should get a shopping list containing barter items to buy', async () => {
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
    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.setMerchantFilters([
      {
        enabled: true,
        merchant: 'flea-market',
        merchantLevel: 0
      },
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      }
    ])

    const build: IBuild = {
      id: '1',
      inventorySlots: [
        {
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '584147732459775a2b6d9f12', // AKS-74U 5.45x39 assault rifle Default
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5f6341043ada5942720e2dc5', // AK Aeroknox Scorpius pistol grip
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'mod_pistol_grip'
                    },
                    {
                      item: {
                        content: [
                          {
                            content: [],
                            ignorePrice: false,
                            itemId: '56dff3afd2720bba668b4567', // 5.45x39mm PS gs
                            modSlots: [],
                            quantity: 30
                          }
                        ],
                        ignorePrice: false,
                        itemId: '564ca99c4bdc2d16268b4589', // AK-74 5.45x39 6L20 30-round magazine
                        modSlots: [],
                        quantity: 1.0
                      },
                      modSlotName: 'mod_magazine'
                    }
                  ],
                  quantity: 1
                },
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '56dff3afd2720bba668b4567', // 5.45x39mm PS gs
                  modSlots: [],
                  quantity: 60
                },
                {
                  content: [],
                  ignorePrice: true,
                  itemId: '5734795124597738002c6176', // Insulating tape
                  modSlots: [],
                  quantity: 1
                }
              ],
              ignorePrice: false,
              itemId: '5df8a4d786f77412672a1e3b', // 6Sh118 raid backpack
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'backpack'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5b3f16c486f7747c327f55f7', // Armband (White)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'armband'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'build'
    }

    // Act
    const summaryResult = await service.getSummary(build)

    // Assert
    expect(summaryResult.success).toBe(true)
    expect(summaryResult.value).toStrictEqual({
      ergonomics: undefined,
      ergonomicsPercentageModifier: 0,
      exported: false,
      horizontalRecoil: undefined,
      id: '1',
      lastExported: undefined,
      lastUpdated: undefined,
      name: 'build',
      price: {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 186445,
          valueInMainCurrency: 186445
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: null,
            value: 186445,
            valueInMainCurrency: 186445
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          quest: null,
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: 'notIgnored'
      },
      shoppingList: [
        {
          item: {
            capacity: 48,
            categoryId: 'backpack',
            conflictingItemIds: [],
            iconLink: 'https://assets.tarkov.dev/5df8a4d786f77412672a1e3b-icon.webp',
            id: '5df8a4d786f77412672a1e3b',
            imageLink: 'https://assets.tarkov.dev/5df8a4d786f77412672a1e3b-image.webp',
            marketLink: 'https://tarkov.dev/item/6sh118-raid-backpack',
            maxStackableAmount: 1,
            name: '6Sh118 raid backpack',
            prices: [
              {
                barterItems: [
                  {
                    itemId: '59f32c3b86f77472a31742f0',
                    quantity: 9
                  }
                ],
                currencyName: 'barter',
                itemId: '5df8a4d786f77412672a1e3b',
                merchant: 'prapor',
                merchantLevel: 3,
                quest: {
                  id: '6179ac7511973d018217d0b9',
                  name: 'Easy Job - Part 1',
                  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Easy_Job_-_Part_1'
                },
                value: 0,
                valueInMainCurrency: 0
              },
              {
                barterItems: [
                  {
                    itemId: '5d0375ff86f774186372f685',
                    quantity: 2
                  }
                ],
                currencyName: 'barter',
                itemId: '5df8a4d786f77412672a1e3b',
                merchant: 'prapor',
                merchantLevel: 4,
                quest: null,
                value: 0,
                valueInMainCurrency: 0
              }
            ],
            shortName: '6Sh118',
            weight: 6.36,
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6Sh118_raid_backpack'
          },
          quantity: 1,
          price: {
            barterItems: [],
            currencyName: 'barter',
            itemId: '5df8a4d786f77412672a1e3b',
            merchant: 'prapor',
            merchantLevel: 4,
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'barter',
            itemId: '5df8a4d786f77412672a1e3b',
            merchant: 'prapor',
            merchantLevel: 4,
            quest: null,
            value: 0,
            valueInMainCurrency: 0
          }
        },
        {
          item: {
            categoryId: 'other',
            conflictingItemIds: [],
            iconLink: 'https://assets.tarkov.dev/5d0375ff86f774186372f685-icon.webp',
            id: '5d0375ff86f774186372f685',
            imageLink: 'https://assets.tarkov.dev/5d0375ff86f774186372f685-image.webp',
            marketLink: 'https://tarkov.dev/item/military-cable',
            maxStackableAmount: 1,
            name: 'Military cable',
            prices: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '5d0375ff86f774186372f685',
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: null,
                value: 53432,
                valueInMainCurrency: 53432
              }
            ],
            shortName: 'MCable',
            weight: 0.65,
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Military_cable'
          },
          quantity: 2,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '5d0375ff86f774186372f685',
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: null,
            value: 106864,
            valueInMainCurrency: 106864
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '5d0375ff86f774186372f685',
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: null,
            value: 53432,
            valueInMainCurrency: 53432
          }
        },
        {
          item: {
            baseItemId: '57dc2fa62459775949412633',
            caliber: 'Caliber545x39',
            categoryId: 'mainWeapon',
            conflictingItemIds: [],
            defaultPresetId: null,
            ergonomics: 44,
            fireModes: [
              'SingleFire',
              'FullAuto'
            ],
            fireRate: 650,
            horizontalRecoil: 415,
            iconLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-icon.webp',
            id: '584147732459775a2b6d9f12',
            imageLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-image.webp',
            marketLink: 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle-default',
            maxStackableAmount: 1,
            minuteOfAngle: 3.44,
            modSlots: [
              {
                compatibleItemIds: [
                  '5c0d5e4486f77478390952fe',
                  '61962b617c6c7b169525f168',
                  '56dfef82d2720bbd668b4567',
                  '56dff026d2720bb8668b4567',
                  '56dff061d2720bb5668b4567',
                  '56dff0bed2720bb0668b4567',
                  '56dff216d2720bbd668b4568',
                  '56dff2ced2720bb4668b4567',
                  '56dff338d2720bbd668b4569',
                  '56dff3afd2720bba668b4567',
                  '56dff421d2720b5f5a8b4567',
                  '56dff4a2d2720bbd668b456a',
                  '56dff4ecd2720b5f5a8b4568'
                ],
                maxStackableAmount: 1,
                name: 'chamber0',
                required: false
              },
              {
                compatibleItemIds: [
                  '5f6341043ada5942720e2dc5',
                  '6087e663132d4d12c81fd96b',
                  '5beec8ea0db834001a6f9dbf',
                  '5649ad3f4bdc2df8348b4585',
                  '5649ade84bdc2d1b2b8b4587',
                  '59e62cc886f77440d40b52a1',
                  '5a0071d486f77404e23a12b2',
                  '57e3dba62459770f0c32322b',
                  '5cf54404d7f00c108840b2ef',
                  '5e2192a498a36665e8337386',
                  '5b30ac585acfc433000eb79c',
                  '59e6318286f77444dd62c4cc',
                  '5cf50850d7f00c056e24104c',
                  '5cf508bfd7f00c056e24104e',
                  '5947f92f86f77427344a76b1',
                  '5947fa2486f77425b47c1a9b',
                  '5c6bf4aa2e2216001219b0ae',
                  '5649ae4a4bdc2d1b2b8b4588',
                  '5998517986f7746017232f7e',
                  '623c3be0484b5003161840dc',
                  '628c9ab845c59e5b80768a81',
                  '628a664bccaab13006640e47'
                ],
                maxStackableAmount: 1,
                name: 'mod_pistol_grip',
                required: false
              },
              {
                compatibleItemIds: [
                  '59ecc28286f7746d7a68aa8c',
                  '5ab626e4d8ce87272e4c6e43',
                  '57dc347d245977596754e7a1'
                ],
                maxStackableAmount: 1,
                name: 'mod_stock',
                required: false
              },
              {
                compatibleItemIds: [
                  '6130ca3fd92c473c77020dbd',
                  '5648ac824bdc2ded0b8b457d'
                ],
                maxStackableAmount: 1,
                name: 'mod_charge',
                required: false
              },
              {
                compatibleItemIds: [
                  '564ca9df4bdc2d35148b4569',
                  '564ca99c4bdc2d16268b4589',
                  '55d480c04bdc2d1d4e8b456a',
                  '5cbdaf89ae9215000e5b9c94',
                  '55d481904bdc2d8c2f8b456a',
                  '55d482194bdc2d1d4e8b456b',
                  '55d4837c4bdc2d1d4e8b456c',
                  '5aaa4194e5b5b055d06310a5',
                  '5bed61680db834001d2c45ab',
                  '5bed625c0db834001c062946'
                ],
                maxStackableAmount: 1,
                name: 'mod_magazine',
                required: false
              },
              {
                compatibleItemIds: [
                  '5ac72e945acfc43f3b691116',
                  '5ac7655e5acfc40016339a19',
                  '5649aa744bdc2ded0b8b457e',
                  '5f633f791b231926f2329f13',
                  '5943eeeb86f77412d6384f6b',
                  '5cc9a96cd7f00c011c04e04a',
                  '615d8f5dd92c473c770212ef',
                  '5649ab884bdc2ded0b8b457f',
                  '57dc324a24597759501edc20',
                  '59bffc1f86f77435b128b872',
                  '593d493f86f7745e6b2ceb22',
                  '564caa3d4bdc2d17108b458e',
                  '57ffb0e42459777d047111c5'
                ],
                maxStackableAmount: 1,
                name: 'mod_muzzle',
                required: false
              },
              {
                compatibleItemIds: [
                  '57dc334d245977597164366f',
                  '5839a7742459773cf9693481'
                ],
                maxStackableAmount: 1,
                name: 'mod_reciever',
                required: false
              },
              {
                compatibleItemIds: [
                  '59d36a0086f7747e673f3946'
                ],
                maxStackableAmount: 1,
                name: 'mod_gas_block',
                required: false
              }
            ],
            name: 'Kalashnikov AKS-74U 5.45x39 assault rifle Default',
            prices: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '584147732459775a2b6d9f12',
                merchant: 'prapor',
                merchantLevel: 1,
                quest: {
                  id: '5936d90786f7742b1420ba5b',
                  name: 'Debut',
                  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
                },
                value: 24605,
                valueInMainCurrency: 24605
              },
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '584147732459775a2b6d9f12',
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: null,
                value: 28999,
                valueInMainCurrency: 28999
              }
            ],
            shortName: 'AKS-74U Default',
            verticalRecoil: 121,
            weight: 1.809,
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
          },
          quantity: 1,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '584147732459775a2b6d9f12',
            merchant: 'prapor',
            merchantLevel: 1.0,
            quest: {
              id: '5936d90786f7742b1420ba5b',
              name: 'Debut',
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
            },
            value: 24605.0,
            valueInMainCurrency: 24605.0
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '584147732459775a2b6d9f12',
            merchant: 'prapor',
            merchantLevel: 1.0,
            quest: {
              id: '5936d90786f7742b1420ba5b',
              name: 'Debut',
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut'
            },
            value: 24605.0,
            valueInMainCurrency: 24605.0
          }
        },
        {
          item: {
            accuracyPercentageModifier: 0,
            baseItemId: null,
            categoryId: 'rangedWeaponMod',
            conflictingItemIds: [],
            ergonomicsModifier: 12,
            defaultPresetId: null,
            iconLink: 'https://assets.tarkov.dev/5f6341043ada5942720e2dc5-icon.webp',
            id: '5f6341043ada5942720e2dc5',
            imageLink: 'https://assets.tarkov.dev/5f6341043ada5942720e2dc5-image.webp',
            marketLink: 'https://tarkov.dev/item/ak-aeroknox-scorpius-pistol-grip',
            maxStackableAmount: 1,
            modSlots: [],
            name: 'AK Aeroknox Scorpius pistol grip',
            prices: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '5f6341043ada5942720e2dc5',
                merchant: 'mechanic',
                merchantLevel: 4,
                quest: null,
                value: 6496,
                valueInMainCurrency: 6496
              },
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '5f6341043ada5942720e2dc5',
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: null,
                value: 45166,
                valueInMainCurrency: 45166
              }
            ],
            recoilPercentageModifier: 0,
            shortName: 'Scorpius',
            weight: 0.14,
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AK_Aeroknox_Scorpius_pistol_grip'
          },
          quantity: 1,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '5f6341043ada5942720e2dc5',
            merchant: 'flea-market',
            merchantLevel: 0.0,
            quest: null,
            value: 45166.0,
            valueInMainCurrency: 45166.0
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '5f6341043ada5942720e2dc5',
            merchant: 'flea-market',
            merchantLevel: 0.0,
            quest: null,
            value: 45166.0,
            valueInMainCurrency: 45166.0
          }
        },
        {
          item: {
            accuracyPercentageModifier: 0,
            armorDamagePercentage: 0.35,
            armorPenetrations: [
              6,
              6,
              5,
              2,
              0,
              0
            ],
            blinding: false,
            caliber: 'Caliber545x39',
            categoryId: 'ammunition',
            conflictingItemIds: [],
            durabilityBurnPercentageModifier: 0.1,
            fleshDamage: 48,
            fragmentationChancePercentage: 0.4,
            heavyBleedingPercentageChance: 0,
            iconLink: 'https://assets.tarkov.dev/56dff3afd2720bba668b4567-icon.webp',
            id: '56dff3afd2720bba668b4567',
            imageLink: 'https://assets.tarkov.dev/56dff3afd2720bba668b4567-image.webp',
            lightBleedingPercentageChance: 0,
            marketLink: 'https://tarkov.dev/item/545x39mm-ps-gs',
            maxStackableAmount: 60,
            name: '5.45x39mm PS gs',
            penetrationPower: 31,
            prices: [
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '56dff3afd2720bba668b4567',
                merchant: 'prapor',
                merchantLevel: 1,
                quest: {
                  id: '59674eb386f774539f14813a',
                  name: 'Delivery from the Past',
                  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Delivery_from_the_Past'
                },
                value: 109,
                valueInMainCurrency: 109
              },
              {
                barterItems: [],
                currencyName: 'RUB',
                itemId: '56dff3afd2720bba668b4567',
                merchant: 'flea-market',
                merchantLevel: 0,
                quest: null,
                value: 224,
                valueInMainCurrency: 224
              }
            ],
            projectiles: 1,
            recoilPercentageModifier: 0,
            shortName: 'PS',
            subsonic: false,
            tracer: false,
            velocity: 890,
            weight: 0.01,
            wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_PS_gs'
          },
          quantity: 90,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '56dff3afd2720bba668b4567',
            merchant: 'prapor',
            merchantLevel: 1.0,
            quest: {
              id: '59674eb386f774539f14813a',
              name: 'Delivery from the Past',
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Delivery_from_the_Past'
            },
            value: 9810,
            valueInMainCurrency: 9810
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '56dff3afd2720bba668b4567',
            merchant: 'prapor',
            merchantLevel: 1.0,
            quest: {
              id: '59674eb386f774539f14813a',
              name: 'Delivery from the Past',
              wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Delivery_from_the_Past'
            },
            value: 109,
            valueInMainCurrency: 109
          }
        }
      ],
      verticalRecoil: undefined,
      weight: 9.524
    } as IBuildSummary)
  })
})