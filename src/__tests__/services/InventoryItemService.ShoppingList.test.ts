import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { PresetService } from '../../services/PresetService'
import Services from '../../services/repository/Services'
import { build1 } from '../__data__/buildMocks'
import { alkali, alpha, ammo545bp, ammo545us, ammo9mmGT, berkut, h2o2, iskra, rpk16Default, rpk16Drum, rpk16RsBase, syringe, water } from '../__data__/itemMocks'
import { alkaliPrices, ammo545usPrices, ammo9mmGTPrices, berkutPrices, h2o2Prices, iskraPrices, rpk16DefaultPrices, rpk16DrumPrices, rpk16RsBasePrices, syringePrices, waterPrices } from '../__data__/priceMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('getShoppingList', () => {
  it.each([
    [
      build1.inventorySlots[0].items[0]!,
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
          quantity: 95,
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
        }
      ] as IShoppingListItem[]
    ],
    [
      build1.inventorySlots[8].items[0]!,
      [
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
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 27285,
            valueInMainCurrency: 27285
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 27285,
            valueInMainCurrency: 27285
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
            currencyName: 'barter',
            itemId: iskra.id,
            merchant: 'therapist',
            merchantLevel: 1,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'barter',
            itemId: iskra.id,
            merchant: 'therapist',
            merchantLevel: 1,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          }
        },
        {
          item: {
            ...syringe,
            prices: syringePrices
          },
          quantity: 1,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: syringe.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 25320,
            valueInMainCurrency: 25320
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: syringe.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 25320,
            valueInMainCurrency: 25320
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
            itemId: '59e361e886f774176c10a2a5',
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 11473,
            valueInMainCurrency: 11473
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '59e361e886f774176c10a2a5',
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 11473,
            valueInMainCurrency: 11473
          }
        }
      ] as IShoppingListItem[]
    ],
    [
      {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: rpk16Drum.id,
            modSlots: [],
            quantity: 1
          },
          {
            content: [],
            ignorePrice: false,
            itemId: rpk16Drum.id,
            modSlots: [],
            quantity: 1
          },
          {
            content: [],
            ignorePrice: false,
            itemId: rpk16RsBase.id,
            modSlots: [
              {
                modSlotName: 'mod_sight_rear',
                item: undefined
              }
            ],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: berkut.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      [
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
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 27285,
            valueInMainCurrency: 27285
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: berkut.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 27285,
            valueInMainCurrency: 27285
          }
        },
        {
          item: {
            ...rpk16Drum,
            prices: rpk16DrumPrices
          },
          quantity: 2,
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
          quantity: 4,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: alkali.id,
            merchant: 'flea-market',
            merchantLevel: 0,
            quest: undefined,
            value: 48436,
            valueInMainCurrency: 48436
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
            ...rpk16RsBase,
            prices: rpk16RsBasePrices
          },
          quantity: 1,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16RsBase.id,
            merchant: 'prapor',
            merchantLevel: 3,
            quest: undefined,
            value: 872,
            valueInMainCurrency: 872
          },
          unitPrice: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: rpk16RsBase.id,
            merchant: 'prapor',
            merchantLevel: 3,
            quest: undefined,
            value: 872,
            valueInMainCurrency: 872
          }
        }
      ] as IShoppingListItem[]
    ]
  ])('should get a shopping list for an item and all its content, mod (except from default preset) and barter items that must be bought', async (inventoryItem: IInventoryItem, expected: IShoppingListItem[]) => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()
    const globalFilterService = Services.get(GlobalFilterService)
    globalFilterService.saveMerchantFilters([
      {
        enabled: true,
        merchant: 'flea-market',
        merchantLevel: 0
      },
      {
        enabled: true,
        merchant: 'prapor',
        merchantLevel: 4
      },
      {
        enabled: true,
        merchant: 'therapist',
        merchantLevel: 1
      }
    ])

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult).toStrictEqual(expected)
  })

  it('should ignore items that cannot be looted', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo9mmGT.id,
          modSlots: [],
          quantity: 2
        }
      ],
      ignorePrice: true,
      itemId: alpha.id,
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult).toStrictEqual([
      {
        item: {
          ...ammo9mmGT,
          prices: ammo9mmGTPrices
        },
        quantity: 2,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: ammo9mmGT.id,
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 146,
          valueInMainCurrency: 146
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
      }
    ] as IShoppingListItem[])
  })

  it('should ignore items that are manually ignored', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [
        {
          content: [],
          ignorePrice: false,
          itemId: ammo9mmGT.id,
          modSlots: [],
          quantity: 2
        }
      ],
      ignorePrice: false,
      itemId: alpha.id,
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem, undefined, false)

    // Assert
    expect(shoppingListResult).toStrictEqual([
      {
        item: {
          ...ammo9mmGT,
          prices: ammo9mmGTPrices
        },
        quantity: 2,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: ammo9mmGT.id,
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 146,
          valueInMainCurrency: 146
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
      }
    ] as IShoppingListItem[])
  })

  it('should use the not found item for items that are not found', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(PresetService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: 'invalid',
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult).toStrictEqual([
      {
        item: {
          categoryId: 'notFound',
          conflictingItemIds: [],
          iconLink: '/assets/images/unknown_item.webp',
          id: 'invalid',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          name: 'Unknown item "invalid"',
          prices: [],
          shortName: '',
          weight: 0,
          wikiLink: ''
        },
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: 'invalid',
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
          itemId: 'invalid',
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        }
      }
    ])
  })

  it('should ignore the prices of items without price', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)
    Services.configure(PresetService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: ammo545bp.id,
      modSlots: [],
      quantity: 60
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem)

    // Assert
    expect(shoppingListResult).toStrictEqual([
      {
        item: ammo545bp,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: ammo545bp.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        quantity: 60,
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: ammo545bp.id,
          merchant: '',
          merchantLevel: 0,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        }
      }
    ])
  })
})