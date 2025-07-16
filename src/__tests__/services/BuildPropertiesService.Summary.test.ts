import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IRecoil } from '../../models/utils/IRecoil'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { build1, build2 } from '../__data__/buildMocks'
import { alkali, alpha, ammo545bp, ammo545us, ammo9mmGT, armor6b13FlDefault, banshee, bayonet6Kh5, berkut, cqcm, crossbow, ewr, h2o2, iskra, lshZ2dtm, lshZ2dtmFs, m9a3Default, monocletePe, morphine, paca, pass, plate6b33Back, plate6b33Front, plexiglass, razor, rgd5, rpk16, rpk16Default, rpk16Drum, salewa, scavVest, srd9, vaseline, water, x400 } from '../__data__/itemMocks'
import { alkaliPrices, ammo545usPrices, ammo9mmGTPrices, armor6b13FlDefaultPrices, bansheePrices, berkutPrices, cqcmPrices, crossbowPrices, ewrPrices, h2o2Prices, iskraPrices, lshZ2dtmFsPrices, lshZ2dtmPrices, m9a3DefaultPrices, monocletePePrices, morphinePrices, passPrices, plexiglassPrices, razorPrices, rgd5Prices, rpk16DefaultPrices, rpk16DrumPrices, salewaPrices, srd9Prices, vaselinePrices, waterPrices, x400Prices } from '../__data__/priceMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getSummaryAsync', () => {
  describe('Armor modifiers', () => {
    it.each([
      [
        build1,
        {
          armorClass: plate6b33Front.armorClass,
          durability: armor6b13FlDefault.durability + plate6b33Front.durability + plate6b33Back.durability
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
              typeId: InventorySlotTypeId.bodyArmor
            }
          ],
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined
        },
        {
          armorClass: paca.armorClass,
          durability: paca.durability
        } as IArmorModifiers
      ],
      [
        build2,
        {
          armorClass: monocletePe.armorClass,
          durability: banshee.durability + monocletePe.durability + monocletePe.durability
        } as IArmorModifiers
      ],
      [
        {
          id: '',
          name: 'Build 3',
          inventorySlots: [
            {
              items: [undefined],
              typeId: InventorySlotTypeId.bodyArmor
            },
            {
              items: [undefined],
              typeId: InventorySlotTypeId.tacticalRig
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
              typeId: InventorySlotTypeId.bodyArmor
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
              typeId: InventorySlotTypeId.tacticalRig
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
              typeId: InventorySlotTypeId.bodyArmor
            },
            {
              items: [undefined],
              typeId: InventorySlotTypeId.tacticalRig
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
      Services.configure(ItemPropertiesService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummaryAsync(build)

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
      Services.configure(ItemPropertiesService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummaryAsync({
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
      [build1, 31.349999999999998],
      [build2, 52.379999999999995],
      [
        {
          id: 'build3',
          inventorySlots: [
            {
              typeId: InventorySlotTypeId.onBack,
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
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)
        Services.configure(PresetService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(build)

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
              typeId: InventorySlotTypeId.onSling,
              items: []
            },
            {
              typeId: InventorySlotTypeId.onBack,
              items: [undefined]
            },
            {
              typeId: InventorySlotTypeId.holster,
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
      Services.configure(InventorySlotPropertiesService)
      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummaryAsync(build)

      // Assert
      expect(summary.ergonomics).toBe(0)
    })
  })

  describe('Price', () => {
    it.each([
      [
        build1,
        {
          missingPrice: true,
          priceInMainCurrency: 361226,
          priceByCurrency: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 361226,
              valueInMainCurrency: 361226
            }
          ]
        } as IInventoryPrice
      ],
      [
        build2,
        {
          missingPrice: false,
          priceInMainCurrency: 251397,
          priceByCurrency: [
            {
              barterItems: [],
              currencyName: 'RUB',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 187902,
              valueInMainCurrency: 187902
            },
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '',
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 444,
              valueInMainCurrency: 63495
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
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(build)

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
            typeId: InventorySlotTypeId.backpack
          }
        ],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: ''
      }

      // Act
      const summary = await service.getSummaryAsync(build)

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
          horizontalRecoil: 216.24,
          verticalRecoil: 65.96000000000001
        } as IRecoil
      ],
      [
        build2,
        {
          horizontalRecoil: 249.34,
          verticalRecoil: 362.18
        } as IRecoil
      ],
      [
        {
          name: 'Empty build',
          id: 'EmptyBuild',
          inventorySlots: [
            {
              typeId: InventorySlotTypeId.onSling,
              items: []
            },
            {
              typeId: InventorySlotTypeId.onBack,
              items: [undefined]
            },
            {
              typeId: InventorySlotTypeId.holster,
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
        Services.configure(ItemPropertiesService)
        Services.configure(PresetService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(build)

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
      Services.configure(ItemPropertiesService)
      Services.configure(GlobalFilterService)
      Services.configure(PresetService)

      const service = new BuildPropertiesService()

      // Act
      const summary = await service.getSummaryAsync(
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
              typeId: InventorySlotTypeId.onSling
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'onSling',
            item: {
              ...rpk16Default,
              prices: rpk16DefaultPrices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...rpk16Drum,
              prices: rpk16DrumPrices
            },
            missingPrice: false,
            price: {
              barterItems: [
                {
                  itemId: alkali.id,
                  quantity: 2
                }
              ],
              currencyName: 'barter',
              itemId: rpk16Drum.id,
              merchant: 'prapor',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            quantity: 1,
            unitPrice: {
              barterItems: [
                {
                  itemId: alkali.id,
                  quantity: 2
                }
              ],
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...alkali,
              prices: alkaliPrices
            },
            missingPrice: false,
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
            quantity: 2,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...ammo545us,
              prices: ammo545usPrices
            },
            missingPrice: false,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo545us.id,
              merchant: 'prapor',
              merchantLevel: 1,
              quest: undefined,
              value: 9120,
              valueInMainCurrency: 9120
            },
            quantity: 95,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'bodyArmor',
            item: {
              ...armor6b13FlDefault,
              prices: armor6b13FlDefaultPrices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'headwear',
            item: {
              ...lshZ2dtm,
              prices: lshZ2dtmPrices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...lshZ2dtmFs,
              prices: lshZ2dtmFsPrices
            },
            missingPrice: false,
            price: {
              barterItems: [
                {
                  itemId: plexiglass.id,
                  quantity: 3
                }
              ],
              currencyName: 'barter',
              itemId: lshZ2dtmFs.id,
              merchant: 'ragman',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            quantity: 1,
            unitPrice: {
              barterItems: [
                {
                  itemId: plexiglass.id,
                  quantity: 3
                }
              ],
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...plexiglass,
              prices: plexiglassPrices
            },
            missingPrice: false,
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
            quantity: 3,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'backpack',
            item: {
              ...berkut,
              prices: berkutPrices
            },
            missingPrice: false,
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
          },
          {
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...iskra,
              prices: iskraPrices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...water,
              prices: waterPrices
            },
            missingPrice: false,
            price: {
              barterItems: [
                {
                  itemId: h2o2.id,
                  quantity: 1
                }
              ],
              currencyName: 'barter',
              itemId: water.id,
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            quantity: 1,
            unitPrice: {
              barterItems: [
                {
                  itemId: h2o2.id,
                  quantity: 1
                }
              ],
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...h2o2,
              prices: h2o2Prices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'pockets',
            item: {
              ...morphine,
              prices: morphinePrices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'pockets',
            item: {
              ...vaseline,
              prices: vaselinePrices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'pockets',
            item: {
              ...rgd5,
              prices: rgd5Prices
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'pockets',
            item: {
              ...ammo545us,
              prices: ammo545usPrices
            },
            missingPrice: false,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo545us.id,
              merchant: 'prapor',
              merchantLevel: 1,
              quest: undefined,
              value: 5760,
              valueInMainCurrency: 5760
            },
            quantity: 60,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'eyewear',
            item: {
              ...crossbow,
              prices: crossbowPrices
            },
            missingPrice: false,
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
            quantity: 1,
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
          },
          {
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'faceCover',
            item: {
              ...cqcm,
              prices: cqcmPrices
            },
            missingPrice: true,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: cqcm.id,
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            quantity: 1,
            unitPrice: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: cqcm.id,
              merchant: '',
              merchantLevel: 0,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            }
          }
        ] as IShoppingListItem[]
      ],
      [
        build2,
        [
          {
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'holster',
            item: {
              ...m9a3Default,
              prices: [...m9a3DefaultPrices]
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...srd9,
              prices: [...srd9Prices]
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...ammo9mmGT,
              prices: [...ammo9mmGTPrices]
            },
            missingPrice: false,
            price: {
              barterItems: [],
              currencyName: 'RUB',
              itemId: ammo9mmGT.id,
              merchant: 'mechanic',
              merchantLevel: 1,
              quest: undefined,
              value: 4891,
              valueInMainCurrency: 4891
            },
            quantity: 67,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...x400,
              prices: [...x400Prices]
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'tacticalRig',
            item: {
              ...banshee,
              prices: [...bansheePrices]
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...monocletePe,
              prices: [...monocletePePrices]
            },
            missingPrice: false,
            price: {
              barterItems: [
                {
                  itemId: pass.id,
                  quantity: 1
                }
              ],
              currencyName: 'barter',
              itemId: monocletePe.id,
              merchant: 'peacekeeper',
              merchantLevel: 3,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            quantity: 2,
            unitPrice: {
              barterItems: [
                {
                  itemId: pass.id,
                  quantity: 1
                }
              ],
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...pass,
              prices: [...passPrices]
            },
            missingPrice: false,
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
            quantity: 2,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...salewa,
              prices: [...salewaPrices]
            },
            missingPrice: false,
            price: {
              barterItems: [
                {
                  itemId: ewr.id,
                  quantity: 1
                }
              ],
              currencyName: 'barter',
              itemId: salewa.id,
              merchant: 'therapist',
              merchantLevel: 1,
              quest: undefined,
              value: 0,
              valueInMainCurrency: 0
            },
            quantity: 1,
            unitPrice: {
              barterItems: [
                {
                  itemId: ewr.id,
                  quantity: 1
                }
              ],
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: undefined,
            item: {
              ...ewr,
              prices: [...ewrPrices]
            },
            missingPrice: false,
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
            quantity: 1,
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
            ignorePrice: IgnoredUnitPrice.notIgnored,
            inventorySlotId: 'earpiece',
            item: {
              ...razor,
              prices: [...razorPrices]
            },
            missingPrice: false,
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
            quantity: 1,
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
          },
          {
            ignorePrice: IgnoredUnitPrice.notLootable,
            inventorySlotId: 'pouch',
            item: alpha,
            missingPrice: false,
            quantity: 1
          },
          {
            ignorePrice: IgnoredUnitPrice.notLootable,
            inventorySlotId: 'scabbard',
            item: bayonet6Kh5,
            missingPrice: false,
            quantity: 1
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
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(build)

        // Assert
        expect(summary.shoppingList).toEqual(expected)
      }
    )

    it('should throw when an inventory slots has an invalid type', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)
      Services.configure(GlobalFilterService)

      const service = new BuildPropertiesService()

      // Act
      const act = (): Promise<IBuildSummary> => service.getSummaryAsync({
        name: 'Build',
        id: 'build',
        inventorySlots: [
          {
            typeId: 'invalid' as InventorySlotTypeId,
            items: []
          },
          {
            typeId: InventorySlotTypeId.backpack,
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
      await expect(act).rejects.toThrowError('Inventory slot type "invalid" not found.')
    })
  })

  describe('Weight', () => {
    it.each([
      [
        build1,
        26.153
      ],
      [
        build2,
        9.235999999999999
      ],
      [
        {
          name: 'Empty build',
          id: 'EmptyBuild',
          inventorySlots: [
            {
              typeId: InventorySlotTypeId.onSling,
              items: []
            },
            {
              typeId: InventorySlotTypeId.onBack,
              items: [undefined]
            },
            {
              typeId: InventorySlotTypeId.holster,
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
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)
        Services.configure(PresetService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(build)

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
          ergonomicsModifierPercentage: -0.17500000000000002,
          movementSpeedModifierPercentage: -0.07,
          turningSpeedModifierPercentage: -0.12
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
        Services.configure(ItemPropertiesService)
        Services.configure(GlobalFilterService)
        Services.configure(PresetService)

        const service = new BuildPropertiesService()

        // Act
        const summary = await service.getSummaryAsync(build)

        // Assert
        expect(summary.wearableModifiers).toStrictEqual(expected)
      })
  })
})