import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
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
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { build1, build2 } from '../__data__/buildMocks'
import { alkali, ammo545bp, ammo545us, ammo9mmGT, armor6b13FlDefault, banshee, berkut, cf, crossbow, ewr, h2o2, iskra, lshZ2dtm, lshZ2dtmFs, m9a3Default, monocletePe, morphine, paca, pass, plexiglass, razor, rgd5, rpk16, rpk16Default, rpk16Drum, salewa, scavVest, srd9, vaseline, water, x400 } from '../__data__/itemMocks'
import { alkaliPrices, ammo545usPrices, ammo9mmGTPrices, armor6b13FlDefaultPrices, bansheePrices, berkutPrices, cfPrices, crossbowPrices, ewrPrices, h2o2Prices, iskraPrices, lshZ2dtmFsPrices, lshZ2dtmPrices, m9a3DefaultPrices, monocletePePrices, morphinePrices, passPrices, plexiglassPrices, razorPrices, rgd5Prices, rpk16DefaultPrices, rpk16DrumPrices, salewaPrices, srd9Prices, vaselinePrices, waterPrices, x400Prices } from '../__data__/priceMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getSummary()', () => {
  describe('Armor modifiers', () => {
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
      [build1, 34.39],
      [build2, 52.379999999999995],
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
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)
        Services.configure(PresetService)

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
          priceInMainCurrency: 366019,
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
          priceInMainCurrency: 247747,
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
          priceInMainCurrency: 0,
          priceByCurrency: []
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
        Services.configure(InventorySlotService)
        Services.configure(ItemPropertiesService)
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
      Services.configure(InventorySlotService)
      Services.configure(ItemPropertiesService)
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
        priceInMainCurrency: 24509,
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
        ]
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
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(GlobalFilterService)
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)
        Services.configure(ItemPropertiesService)
        Services.configure(PresetService)

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
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventorySlotService)
      Services.configure(ItemPropertiesService)
      Services.configure(GlobalFilterService)
      Services.configure(PresetService)

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

  describe('Shopping list', () => {
    it.each([
      [
        build1,
        [
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
        ] as IShoppingListItem[]
      ],
      [
        build2,
        [
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
        ] as IShoppingListItem[]
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
        [] as IShoppingListItem[]
      ]
    ])(
      'should get the shopping list of a build',
      async (build: IBuild, expected: IShoppingListItem[]) => {
        // Arrange
        useItemServiceMock()
        usePresetServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.shoppingList).toStrictEqual(expected)
      }
    )

    it('should ignore inventory slots with an invalid type', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(InventorySlotService)
      Services.configure(ItemPropertiesService)
      Services.configure(GlobalFilterService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummary({
        name: 'Build',
        id: 'build',
        inventorySlots: [
          {
            typeId: 'invalid',
            items: []
          },
          {
            typeId: 'backpack',
            items: [
              {
                content: [],
                ignorePrice: false,
                itemId: berkut.id,
                modSlots: [],
                quantity: 1
              }
            ]
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined
      })

      // Assert
      expect(summary.shoppingList).toStrictEqual([
        {
          item: berkut,
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
          quantity: 1,
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
        }
      ] as IShoppingListItem[])
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
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)
        Services.configure(PresetService)

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
          ergonomicsModifierPercentage: -0.09500000000000001,
          movementSpeedModifierPercentage: -0.060000000000000005,
          turningSpeedModifierPercentage: -0.09
        } as IWearableModifiers
      ],
      [
        build2,
        {
          ergonomicsModifierPercentage: -0.03,
          movementSpeedModifierPercentage: -0.03,
          turningSpeedModifierPercentage: -0.01
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
          ergonomicsModifierPercentage: 0,
          movementSpeedModifierPercentage: 0,
          turningSpeedModifierPercentage: 0
        } as IWearableModifiers
      ]
    ])(
      'should get the wearable modifiers of a build',
      async (build: IBuild, expected: IWearableModifiers) => {
        // Arrange
        useItemServiceMock()
        useTarkovValuesServiceMock()
        useWebsiteConfigurationServiceMock()
        Services.configure(InventoryItemService)
        Services.configure(InventorySlotPropertiesService)
        Services.configure(InventorySlotService)
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)
        Services.configure(PresetService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummary(build)

        // Assert
        expect(summary.wearableModifiers).toStrictEqual(expected)
      })
  })
})