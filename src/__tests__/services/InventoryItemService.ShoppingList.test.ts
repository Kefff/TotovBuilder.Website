import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { ItemCategoryId } from '../../models/item/IItem'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
          inventorySlotId: undefined,
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
        }
      ] as IShoppingListItem[]
    ],
    [
      build1.inventorySlots[7].items[0]!,
      [
        {
          ignorePrice: IgnoredUnitPrice.notIgnored,
          inventorySlotId: undefined,
          item: {
            ...berkut,
            prices: berkutPrices
          },
          missingPrice: false,
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
          quantity: 1,
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
          inventorySlotId: undefined,
          item: {
            ...iskra,
            prices: iskraPrices
          },
          missingPrice: false,
          price: {
            barterItems: [
              {
                itemId: syringe.id,
                quantity: 1
              }
            ],
            currencyName: 'barter',
            itemId: iskra.id,
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
                itemId: syringe.id,
                quantity: 1
              }
            ],
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
          inventorySlotId: undefined,
          item: {
            ...syringe,
            prices: syringePrices
          },
          missingPrice: false,
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
          quantity: 1,
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
          ignorePrice: IgnoredUnitPrice.notIgnored,
          inventorySlotId: undefined,
          item: {
            ...berkut,
            prices: berkutPrices
          },
          missingPrice: false,
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
          quantity: 1,
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
          quantity: 2,
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
            value: 48436,
            valueInMainCurrency: 48436
          },
          quantity: 4,
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
            ...rpk16RsBase,
            prices: rpk16RsBasePrices
          },
          missingPrice: false,
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
          quantity: 1,
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

  it('should indicate the inventory slot in which an item is found', async () => {
    // Arrange
    useItemServiceMock()
    usePresetServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(GlobalFilterService)

    const inventoryItemService = new InventoryItemService()

    const inventoryItem: IInventoryItem = {
      content: [],
      ignorePrice: false,
      itemId: rpk16Default.id,
      modSlots: [],
      quantity: 1
    }

    // Act
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem, true, undefined, 'onSling')

    // Assert
    expect(shoppingListResult).toStrictEqual([
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
      }
    ] as IShoppingListItem[])
  })

  it('should ignore the price of items that are manually ignored', async () => {
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
        ignorePrice: IgnoredUnitPrice.manuallyIgnored,
        inventorySlotId: undefined,
        item: {
          capacity: 4,
          categoryId: ItemCategoryId.securedContainer,
          conflictingItemIds: [],
          iconLink: 'https://assets.tarkov.dev/544a11ac4bdc2d470e8b456a-icon.webp',
          id: '544a11ac4bdc2d470e8b456a',
          imageLink: 'https://assets.tarkov.dev/544a11ac4bdc2d470e8b456a-image.webp',
          marketLink: 'https://tarkov.dev/item/secure-container-alpha',
          maxStackableAmount: 1,
          name: 'Secure container Alpha',
          prices: [
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '544a11ac4bdc2d470e8b456a',
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 7158,
              valueInMainCurrency: 1023660
            }
          ],
          shortName: 'Alpha',
          weight: 0.6,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Secure_container_Alpha'
        },
        missingPrice: false,
        quantity: 1
      },
      {
        ignorePrice: IgnoredUnitPrice.notIgnored,
        inventorySlotId: undefined,
        item: {
          ...ammo9mmGT,
          prices: ammo9mmGTPrices
        },
        missingPrice: false,
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
        quantity: 2,
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

  it('should include items that cannot be looted', async () => {
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
    const shoppingListResult = await inventoryItemService.getShoppingList(inventoryItem, false)

    // Assert
    expect(shoppingListResult).toStrictEqual([
      {
        ignorePrice: IgnoredUnitPrice.notLootable,
        inventorySlotId: undefined,
        item: {
          capacity: 4,
          categoryId: ItemCategoryId.securedContainer,
          conflictingItemIds: [],
          iconLink: 'https://assets.tarkov.dev/544a11ac4bdc2d470e8b456a-icon.webp',
          id: '544a11ac4bdc2d470e8b456a',
          imageLink: 'https://assets.tarkov.dev/544a11ac4bdc2d470e8b456a-image.webp',
          marketLink: 'https://tarkov.dev/item/secure-container-alpha',
          maxStackableAmount: 1,
          name: 'Secure container Alpha',
          prices: [
            {
              barterItems: [],
              currencyName: 'USD',
              itemId: '544a11ac4bdc2d470e8b456a',
              merchant: 'peacekeeper',
              merchantLevel: 2,
              quest: undefined,
              value: 7158,
              valueInMainCurrency: 1023660
            }
          ],
          shortName: 'Alpha',
          weight: 0.6,
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Secure_container_Alpha'
        },
        missingPrice: false,
        quantity: 1
      },
      {
        ignorePrice: IgnoredUnitPrice.notIgnored,
        inventorySlotId: undefined,
        item: {
          ...ammo9mmGT,
          prices: ammo9mmGTPrices
        },
        missingPrice: false,
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
        quantity: 2,
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
        ignorePrice: IgnoredUnitPrice.notIgnored,
        inventorySlotId: undefined,
        item: {
          categoryId: ItemCategoryId.notFound,
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
        missingPrice: true,
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
    ] as IShoppingListItem[])
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
        ignorePrice: IgnoredUnitPrice.notIgnored,
        inventorySlotId: undefined,
        item: ammo545bp,
        missingPrice: true,
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
    ] as IShoppingListItem[])
  })
})