import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IAmmunitionCount } from '../../models/utils/IAmmunitionCount'
import { IErgonomics } from '../../models/utils/IErgonomics'
import { IErgonomicsPercentageModifier } from '../../models/utils/IErgonomicsPercentageModifier'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import { IRecoil } from '../../models/utils/IRecoil'
import { IRecoilPercentageModifier } from '../../models/utils/IRecoilPercentageModifier'
import { IWeight } from '../../models/utils/IWeight'
import { InventoryItemService } from '../../services/InventoryItemService'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import Services from '../../services/repository/Services'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

const inventoryItem: IInventoryItem = {
  content: [
    {
      content: [],
      ignorePrice: false,
      itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
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
          item: undefined,
          modSlotName: 'mod_stock'
        },
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '5648ac824bdc2ded0b8b457d', // AK Zenit RP-1 charging handle
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_charge'
        }
      ],
      quantity: 1
    },
    {
      content: [],
      ignorePrice: false,
      itemId: '56d59d3ad2720bdb418b4577', // 9x19mm Pst gzh
      modSlots: [],
      quantity: 50
    }
  ],
  ignorePrice: false,
  itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
  modSlots: [],
  quantity: 1
}

const invalidInventoryItem1: IInventoryItem = {
  content: [],
  ignorePrice: false,
  itemId: 'invalid',
  modSlots: [],
  quantity: 1
}

const invalidInventoryItem2: IInventoryItem = {
  content: [],
  ignorePrice: false,
  itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
  modSlots: [
    {
      item: {
        content: [],
        ignorePrice: false,
        itemId: 'invalid',
        modSlots: [],
        quantity: 1
      },
      modSlotName: 'mod_pistol_grip'
    }
  ],
  quantity: 1
}

const invalidInventoryItem3: IInventoryItem = {
  content: [
    {
      content: [],
      ignorePrice: false,
      itemId: 'invalid',
      modSlots: [],
      quantity: 1
    }
  ],
  ignorePrice: false,
  itemId: '5ca20d5986f774331e7c9602',
  modSlots: [],
  quantity: 1
}

describe('getAmmunitionCounts()', () => {
  it.each([
    [
      {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
            modSlots: [],
            quantity: 50
          },
          {
            content: [],
            ignorePrice: false,
            itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
            modSlots: [],
            quantity: 10
          },
          {
            content: [],
            ignorePrice: false,
            itemId: '5cadc190ae921500103bb3b6', // Beretta M9A3 9x19 pistol
            modSlots: [
              {
                item: {
                  content: [
                    {
                      content: [],
                      ignorePrice: false,
                      itemId: '5737201124597760fc4431f1', // 9x18 mm PM Pst gzh
                      modSlots: [],
                      quantity: 17
                    }
                  ],
                  ignorePrice: false,
                  itemId: '5cadc2e0ae9215051e1c21e7', // M9A3 9x19 17-round magazine
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_magazine'
              }
            ],
            quantity: 1
          },
          {
            content: [
              {
                content: [],
                ignorePrice: false,
                itemId: '56dff026d2720bb8668b4567', // 5.45x39 mm BS. Testing the hypothetic case of an object having the same ammunition in its content and its modslots.
                modSlots: [],
                quantity: 1
              }
            ],
            ignorePrice: false,
            itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
            modSlots: [
              {
                item: {
                  content: [
                    {
                      content: [],
                      ignorePrice: false,
                      itemId: '56dff026d2720bb8668b4567', // 5.45x39 mm BS
                      modSlots: [],
                      quantity: 45
                    }
                  ],
                  ignorePrice: false,
                  itemId: '564ca9df4bdc2d35148b4569', // AK-74 5.45x39 6L18 45-round magazine
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_magazine'
              },
              {
                item: undefined,
                modSlotName: 'mod_charge'
              }
            ],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: '5ca20d5986f774331e7c9602',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      [
        {
          id: '5c0d5e4486f77478390952fe', // 5.45x39 mm 7N39 \"Igolnik\"
          count: 60
        },
        {
          id: '5737201124597760fc4431f1', // 9x18 mm PM Pst gzh
          count: 17
        },
        {
          id: '56dff026d2720bb8668b4567', // 5.45x39 mm BS
          count: 46
        }
      ] as IAmmunitionCount[]
    ]
  ])(
    'should get the ammunition counts of an inventory item',
    async (inventoryItem: IInventoryItem, expected: IAmmunitionCount[]) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const ammunitionCounts = await service.getAmmunitionCounts(inventoryItem)

      // Assert
      expect(ammunitionCounts.success).toBe(true)
      expect(ammunitionCounts.value[0].id).toBe(expected[0].id)
      expect(ammunitionCounts.value[0].count).toBe(expected[0].count)
      expect(ammunitionCounts.value[1].id).toBe(expected[1].id)
      expect(ammunitionCounts.value[1].count).toBe(expected[1].count)
    }
  )

  it.each([
    [invalidInventoryItem1],
    [invalidInventoryItem2],
    [invalidInventoryItem3]
  ])(
    'should fail if an item cannot be found',
    async (inventoryItem: IInventoryItem) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const price = await service.getAmmunitionCounts(inventoryItem)

      // Assert
      expect(price.success).toBe(false)
      expect(price.failureMessage).toBe('Item "invalid" not found.')
    }
  )
})

describe('getErgonomics()', () => {
  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5f6341043ada5942720e2dc5', // AK Aeroknox Scorpius pistol grip
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_pistol_grip'
          },
          {
            item: undefined,
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              itemId: '5648ac824bdc2ded0b8b457d', // AK Zenit RP-1 charging handle
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_charge'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        ergonomics: 44,
        ergonomicsWithMods: 57
      } as IErgonomics
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '56d59d3ad2720bdb418b4577', // 9x19mm Pst gzh
        modSlots: [],
        quantity: 50
      } as IInventoryItem,
      {
        ergonomics: 0,
        ergonomicsWithMods: 0
      } as IErgonomics
    ],
    [
      invalidInventoryItem3,
      {
        ergonomics: 0,
        ergonomicsWithMods: 0
      } as IErgonomics
    ]
  ])(
    'should get the ergonomics of an inventory item',
    async (inventoryItem: IInventoryItem, expected: IErgonomics) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const ergonomics = await service.getErgonomics(inventoryItem)

      // Assert
      expect(ergonomics.success).toBe(true)
      expect(ergonomics.value.ergonomics).toBe(expected.ergonomics)
      expect(ergonomics.value.ergonomicsWithMods).toBe(expected.ergonomicsWithMods)
    }
  )

  it.each([[invalidInventoryItem1], [invalidInventoryItem2]])(
    'should fail if an item cannot be found',
    async (inventoryItem: IInventoryItem) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const ergonomics = await service.getErgonomics(inventoryItem)

      // Assert
      expect(ergonomics.success).toBe(false)
      expect(ergonomics.failureMessage).toBe('Item "invalid" not found.')
    }
  )
})

describe('getErgonomicsPercentageModifier()', () => {
  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '544fb45d4bdc2dee738b4568', // Salewa FIRST AID KIT (400/400)
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        ergonomicsPercentageModifier: 0,
        ergonomicsPercentageModifierWithContent: 0
      } as IErgonomicsPercentageModifier
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c0e541586f7747fa54205c9', // 6B13 M assault armor (tan)
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        ergonomicsPercentageModifier: -0.05,
        ergonomicsPercentageModifierWithContent: -0.05
      } as IErgonomicsPercentageModifier
    ]/*,
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c0e6a1586f77404597b4965', // Belt-A + Belt-B gear rig
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        ergonomicsPercentageModifier: -0.05,
        ergonomicsPercentageModifierWithContent: -0.05
      } as IErgonomicsPercentageModifier
    ]*/,
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c0e874186f7745dc7616606', // Maska-1Shch bulletproof helmet (Killa)
        modSlots: [
          {
            item: {
              content: [],
              itemId: '5c0e842486f77443a74d2976', // Maska 1Sch face shield (Killa)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_equipment'
          },
          {
            item: undefined,
            modSlotName: 'mod_equipment'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        ergonomicsPercentageModifier: -0.16,
        ergonomicsPercentageModifierWithContent: -0.35
      } as IErgonomicsPercentageModifier
    ]
  ])(
    'should get the ergonomics percentage modifier of an inventory item',
    async (
      inventoryItem: IInventoryItem,
      expected: IErgonomicsPercentageModifier
    ) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const ergonomicsPercentageModifier = await service.getErgonomicsPercentageModifier(
        inventoryItem
      )

      // Assert
      expect(ergonomicsPercentageModifier.success).toBe(true)
      expect(
        ergonomicsPercentageModifier.value.ergonomicsPercentageModifier
      ).toBe(expected.ergonomicsPercentageModifier)
      expect(
        ergonomicsPercentageModifier.value
          .ergonomicsPercentageModifierWithContent
      ).toBe(expected.ergonomicsPercentageModifierWithContent)
    }
  )

  it.each([
    [invalidInventoryItem1],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c0e874186f7745dc7616606',
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_equipment'
          }
        ],
        quantity: 1
      } as IInventoryItem
    ]
  ])(
    'should fail if an item cannot be found',
    async (inventoryItem: IInventoryItem) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const ergonomicsPercentageModifier = await service.getErgonomicsPercentageModifier(
        inventoryItem
      )

      // Assert
      expect(ergonomicsPercentageModifier.success).toBe(false)
      expect(ergonomicsPercentageModifier.failureMessage).toBe('Item "invalid" not found.')
    }
  )
})

describe('getPresetModSlotContainingItem', () => {
  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5a6f5d528dc32e00094b97d9', // Glock rear sight
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster_0/item:5b1fa9b25acfc40018633c01/mod:mod_reciever/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear',
      {
        item: {
          content: [],
          ignorePrice: false,
          itemId: '5a6f5d528dc32e00094b97d9',
          modSlots: [],
          quantity: 1
        },
        modSlotName: 'mod_sight_rear'
      } as IInventoryModSlot
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster_0/item:5b1fa9b25acfc40018633c01/mod:invalid/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear',
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5a6f5d528dc32e00094b97d9',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster/item:invalid/mod:mod_sight_rear/item:5b1faa0f5acfc40dc528aeb5/mod:mod_sight_rear',
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5a6f5d528dc32e00094b97d9',
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      'build:1234-4568-9011/slot:holster_0/item:5b1fa9b25acfc40018633c01',
      undefined
    ]
  ])('should get the preset mod slot that contains an item', async (item: IInventoryItem, path: string, expected: IInventoryModSlot | undefined) => {
    // Arrange
    useItemServiceMock()
    const service = new InventoryItemService()

    // Act
    const result = await service.getPresetModSlotContainingItem(item.itemId, path)

    // Assert
    expect(result).toStrictEqual(expected)
  })
})

describe('getPrice()', () => {
  it.each([
    [
      inventoryItem,
      true,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ca20d5986f774331e7c9602',
          merchant: 'ragman',
          merchantLevel: 1,
          questId: '',
          value: 23444,
          valueInMainCurrency: 23444
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 61108,
            valueInMainCurrency: 61108
          }
        ],
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 61108,
          valueInMainCurrency: 61108
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ca20d5986f774331e7c9602',
          merchant: 'ragman',
          merchantLevel: 1,
          questId: '',
          value: 23444,
          valueInMainCurrency: 23444
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '56d59d3ad2720bdb418b4577', // 9x19mm Pst gzh
        modSlots: [],
        quantity: 50
      } as IInventoryItem,
      true,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '56d59d3ad2720bdb418b4577',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 3500,
          valueInMainCurrency: 3500
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 3500,
            valueInMainCurrency: 3500
          }
        ],
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 3500,
          valueInMainCurrency: 3500
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '56d59d3ad2720bdb418b4577',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 70,
          valueInMainCurrency: 70
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
            modSlots: [
              {
                item: {
                  content: [
                    {
                      content: [],
                      ignorePrice: false,
                      itemId: '56dff061d2720bb5668b4567', // 5.45x39mm BT gs
                      modSlots: [],
                      quantity: 45
                    }
                  ],
                  ignorePrice: false,
                  itemId: '564ca9df4bdc2d35148b4569', // AK-74 5.45x39 6L18 45-round magazine
                  modSlots: [],
                  quantity: 1
                },
                modSlotName: 'mod_magazine'
              }
            ],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: '5c093ca986f7740a1867ab12', // Secure container Kappa
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      false,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 67337,
            valueInMainCurrency: 67337
          }
        ],
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 67337,
          valueInMainCurrency: 67337
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notLootable
      } as IInventoryPrice
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c07c60e0db834002330051f',
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '59db3b0886f77429d72fb895',
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_pistol_grip'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      true,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5c07c60e0db834002330051f',
          merchant: 'flea-market',
          merchantLevel: 0,
          questId: '',
          value: 41998,
          valueInMainCurrency: 41998
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 47608,
          valueInMainCurrency: 47608
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 41998,
            valueInMainCurrency: 41998
          },
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 51,
            valueInMainCurrency: 5610
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5c07c60e0db834002330051f',
          merchant: 'flea-market',
          merchantLevel: 0,
          questId: '',
          value: 41998,
          valueInMainCurrency: 41998
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [
          {
            content: [
              {
                content: [],
                ignorePrice: true,
                itemId: '590c5d4b86f774784e1b9c45', // Iskra ration pack
                modSlots: [],
                quantity: 1
              }
            ],
            ignorePrice: false,
            itemId: '5e4abc1f86f774069619fbaa', // Spiritus Systems Bank Robber chest rig
            modSlots: [],
            quantity: 1
          }
        ],
        ignorePrice: true,
        itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      true,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 10013,
          valueInMainCurrency: 10013
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 10013,
            valueInMainCurrency: 10013
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.manuallyIgnored
      } as IInventoryPrice
    ]
  ])(
    'should get the price of an inventory item',
    async (inventoryItem: IInventoryItem, canBeLooted: boolean, expected: IInventoryPrice) => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(MerchantFilterService)
      const service = new InventoryItemService()

      // Act
      const price = await service.getPrice(inventoryItem, undefined, canBeLooted)

      // Assert
      expect(price.success).toBe(true)
      expect(price.value).toStrictEqual(expected)
    })

  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5ac66cb05acfc40198510a10', // AK-101 5.56x45 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '59c6633186f7740cf0493bb9', // AK-74 Gas tube
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '5648b1504bdc2d9d488b4584', // Polymer AK-74 foregrip (6P20 Sb.9)
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ac66cb05acfc40198510a10',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 42938,
            valueInMainCurrency: 42938
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ac66cb05acfc40198510a10',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5ac66cb05acfc40198510a10', // AK-101 5.56x45 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '59c6633186f7740cf0493bb9', // AK-74 Gas tube
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '5efaf417aeb21837e749c7f2', // B-30 foregrip and rail mount B-31С
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ac66cb05acfc40198510a10',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 64015,
            valueInMainCurrency: 64015
          }
        ],
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 64015,
          valueInMainCurrency: 64015
        },
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ac66cb05acfc40198510a10',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5ac66cb05acfc40198510a10', // AK-101 5.56x45 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '59e649f986f77411d949b246', // Molot AKM type gas tube
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '5648b1504bdc2d9d488b4584', // Polymer AK-74 foregrip (6P20 Sb.9)
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_handguard'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_gas_block'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ac66cb05acfc40198510a10',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 77938,
          valueInMainCurrency: 77938
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 77938,
            valueInMainCurrency: 77938
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ac66cb05acfc40198510a10',
          merchant: 'mechanic',
          merchantLevel: 2,
          questId: '',
          value: 42938,
          valueInMainCurrency: 42938
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5ac66cb05acfc40198510a10', // AK-101 5.56x45 assault rifle
            modSlots: [
              {
                item: {
                  content: [],
                  ignorePrice: false,
                  itemId: '59e649f986f77411d949b246', // Molot AKM type gas tube
                  modSlots: [
                    {
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '5648b1504bdc2d9d488b4584', // Polymer AK-74 foregrip (6P20 Sb.9)
                        modSlots: [],
                        quantity: 1
                      },
                      modSlotName: 'mod_handguard'
                    }
                  ],
                  quantity: 1
                },
                modSlotName: 'mod_gas_block'
              }
            ],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: '5c0e805e86f774683f3dd637', // 3V G Paratus 3-Day Operator's Tactical Backpack
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'USD',
          itemId: '5c0e805e86f774683f3dd637',
          merchant: 'peacekeeper',
          merchantLevel: 4,
          questId: '',
          value: 674,
          valueInMainCurrency: 74140
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 152078,
          valueInMainCurrency: 152078
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'USD',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 674,
            valueInMainCurrency: 74140
          },
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 77938,
            valueInMainCurrency: 77938
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'USD',
          itemId: '5c0e805e86f774683f3dd637',
          merchant: 'peacekeeper',
          merchantLevel: 4,
          questId: '',
          value: 674,
          valueInMainCurrency: 74140
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ]
  ])('should get the price of an inventory item and ignore items present in the item preset',
    async (inventoryItem: IInventoryItem, expected: IInventoryPrice) => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(MerchantFilterService)

      const service = new InventoryItemService()

      // Act
      const price = await service.getPrice(inventoryItem, undefined, true)

      // Assert
      expect(price.success).toBe(true)
      expect(price.value).toStrictEqual(expected)
    })

  it('should get the price of an inventory item ignoring the prices of deactivated merchants', async () => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(MerchantFilterService)

    const inventoryItemService = new InventoryItemService()
    const merchantFilterService = Services.get(MerchantFilterService)
    merchantFilterService.save([
      {
        enabled: false,
        merchant: 'jaeger',
        merchantLevel: 1
      },
      {
        enabled: true,
        merchant: 'skier',
        merchantLevel: 1
      },
      {
        enabled: false,
        merchant: 'flea-market',
        merchantLevel: 0
      }
    ])

    // Act
    const priceResult = await inventoryItemService.getPrice({
      content: [],
      ignorePrice: false,
      itemId: '5a38e6bac4a2826c6e06d79b', // TOZ-106 20ga bolt-action shotgun
      modSlots: [],
      quantity: 1
    })

    // Assert
    expect(priceResult.success).toBe(true)
    expect(priceResult.value).toStrictEqual({
      missingPrice: false,
      price: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '5a38e6bac4a2826c6e06d79b',
        merchant: 'skier',
        merchantLevel: 1,
        questId: '',
        value: 8917,
        valueInMainCurrency: 8917
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        questId: '',
        value: 8917,
        valueInMainCurrency: 8917
      },
      pricesWithContent: [
        {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 8917,
          valueInMainCurrency: 8917
        }
      ],
      unitPrice: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '5a38e6bac4a2826c6e06d79b',
        merchant: 'skier',
        merchantLevel: 1,
        questId: '',
        value: 8917,
        valueInMainCurrency: 8917
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    })

    // Clean
    localStorage.clear()
  })

  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5de8e67c4a9f347bc92edbd7', // MP9-N 9x19 upper receiver
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: true,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
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
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [
          {
            content: [],
            ignorePrice: false,
            itemId: '5de8e67c4a9f347bc92edbd7', // MP9-N 9x19 upper receiver
            modSlots: [],
            quantity: 1
          }
        ],
        ignorePrice: false,
        itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: true,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ca20d5986f774331e7c9602',
          merchant: 'ragman',
          merchantLevel: 1,
          questId: '',
          value: 23444,
          valueInMainCurrency: 23444
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 23444,
          valueInMainCurrency: 23444
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 23444,
            valueInMainCurrency: 23444
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5ca20d5986f774331e7c9602',
          merchant: 'ragman',
          merchantLevel: 1,
          questId: '',
          value: 23444,
          valueInMainCurrency: 23444
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5e00903ae9dc277128008b87', // B&T MP9 9x19 submachine gun
        modSlots: [
          {
            modSlotName: 'mod_reciever',
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5de8e67c4a9f347bc92edbd7', // MP9-N 9x19 upper receiver
              modSlots: [],
              quantity: 1
            }
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        missingPrice: true,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5e00903ae9dc277128008b87',
          merchant: 'flea-market',
          merchantLevel: 0,
          questId: '',
          value: 24624,
          valueInMainCurrency: 24624
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 24624,
          valueInMainCurrency: 24624
        },
        pricesWithContent: [
          {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            questId: '',
            value: 24624,
            valueInMainCurrency: 24624
          }
        ],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5e00903ae9dc277128008b87',
          merchant: 'flea-market',
          merchantLevel: 0,
          questId: '',
          value: 24624,
          valueInMainCurrency: 24624
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      } as IInventoryPrice
    ]
  ])('should have a missing price when no merchants sell the item', async (inventoryItem: IInventoryItem, expected: IInventoryPrice) => {
    // Arrange
    useItemServiceMock()
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(MerchantFilterService)

    const service = new InventoryItemService()

    // Act
    const price = await service.getPrice(inventoryItem, undefined, true)

    // Assert
    expect(price.success).toBe(true)
    expect(price.value).toStrictEqual(expected)
  })

  it('should fail if the main currency cannot be found', async () => {
    // Arrange
    useItemServiceMock(false)
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()
    Services.configure(MerchantFilterService)
    const service = new InventoryItemService()

    // Act
    const price = await service.getPrice(inventoryItem)

    // Assert
    expect(price.success).toBe(false)
    expect(price.failureMessage).toBe('Main currency not found.')
  })

  it.each([
    [invalidInventoryItem1],
    [invalidInventoryItem2],
    [invalidInventoryItem3]
  ])(
    'should fail if an item cannot be found',
    async (inventoryItem: IInventoryItem) => {
      // Arrange
      useItemServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()
      Services.configure(MerchantFilterService)
      const service = new InventoryItemService()

      // Act
      const price = await service.getPrice(inventoryItem)

      // Assert
      expect(price.success).toBe(false)
      expect(price.failureMessage).toBe('Item "invalid" not found.')
    }
  )
})

describe('getRecoil()', () => {
  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '544fb45d4bdc2dee738b4568', // Salewa FIRST AID KIT (400/400)
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        horizontalRecoil: 0,
        horizontalRecoilWithMods: 0,
        verticalRecoil: 0,
        verticalRecoilWithMods: 0
      } as IRecoil
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        horizontalRecoil: 445,
        horizontalRecoilWithMods: 445,
        verticalRecoil: 141,
        verticalRecoilWithMods: 141
      } as IRecoil
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5ab626e4d8ce87272e4c6e43', // AKS-74 metal skeletonized stock (6P21 Sb.5)
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '5a0c59791526d8dba737bba7', // AK GP-25 accessory kit recoil pad
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_stock'
                }
              ],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5ac72e945acfc43f3b691116', // AK-105 5.45x39 muzzle brake-compensator (6P44 0-20)
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '56dff4ecd2720b5f5a8b4568', // 5.45x39 mm US gs
                  modSlots: [],
                  quantity: 45
                }
              ],
              itemId: '564ca9df4bdc2d35148b4569', // AK-74 5.45x39 6L18 45-round magazine
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5c0d5e4486f77478390952fe', // 5.45x39mm PPBS gs "Igolnik"
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'chamber0'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        horizontalRecoil: 445,
        horizontalRecoilWithMods: 292,
        verticalRecoil: 141,
        verticalRecoilWithMods: 92
      } as IRecoil
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5ea03f7400685063ec28bfa8', // Submachinegun PPSH-41 7.62x25
        modSlots: [
          {
            item: undefined,
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [{
                content: [],
                ignorePrice: false,
                itemId: '5735fdcd2459776445391d61', // 7.62x25mm TT AKBS
                modSlots: [],
                quantity: 71
              }],
              ignorePrice: false,
              itemId: '5ea034f65aad6446a939737e', // 71-round 7.62x25 magazine for PPSH-41
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        horizontalRecoil: 324,
        horizontalRecoilWithMods: 275,
        verticalRecoil: 69,
        verticalRecoilWithMods: 59
      } as IRecoil
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5ea03f7400685063ec28bfa8', // Submachinegun PPSH-41 7.62x25
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5ea03e9400685063ec28bfa4', // PPSH-41 stock
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: undefined,
            modSlotName: 'mod_magazine'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        horizontalRecoil: 324,
        horizontalRecoilWithMods: 230,
        verticalRecoil: 69,
        verticalRecoilWithMods: 49
      } as IRecoil
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5ea03f7400685063ec28bfa8', // Submachinegun PPSH-41 7.62x25
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5ea03e9400685063ec28bfa4', // PPSH-41 stock
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_stock'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '5ea034eb5aad6446a939737b', // 35-round 7.62x25 magazine for PPSH-41
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_magazine'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        horizontalRecoil: 324,
        horizontalRecoilWithMods: 230,
        verticalRecoil: 69,
        verticalRecoilWithMods: 49
      } as IRecoil
    ],
    [
      {
        'content': [],
        'ignorePrice': false,
        'itemId': '60db29ce99594040e04c4a27', // MTs-255-12 12ga shotgun
        'modSlots': [
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '60dc519adf4c47305f6d410d', // MTs-255-12 cylinder
              'modSlots': [
                {
                  'modSlotName': 'camora_000'
                },
                {
                  'item': {
                    'content': [],
                    'ignorePrice': false,
                    'itemId': '5d6e6806a4b936088465b17e', // 12/70 8.5mm Magnum buckshot
                    'modSlots': [

                    ],
                    'quantity': 1
                  },
                  'modSlotName': 'camora_001'
                },
                {
                  'modSlotName': 'camora_002'
                },
                {
                  'modSlotName': 'camora_003'
                },
                {
                  'modSlotName': 'camora_004'
                }
              ],
              'quantity': 1
            },
            'modSlotName': 'mod_magazine'
          },
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '612368f58b401f4f51239b33', // МTs-255-12 12ga 755mm barrel with rib
              'modSlots': [
                {
                  'item': {
                    'content': [],
                    'ignorePrice': false,
                    'itemId': '619d36da53b4d42ee724fae4', // MTs-255-12 12ga choke
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_muzzle'
                }
              ],
              'quantity': 1
            },
            'modSlotName': 'mod_barrel'
          },
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '612781056f3d944a17348d60', // MTs-255-12 wooden stock
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_stock'
          },
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '6123649463849f3d843da7c4', // MTs-255-12 beechwood forestock
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_handguard'
          }
        ],
        'quantity': 1
      } as IInventoryItem,
      {
        horizontalRecoil: 650,
        horizontalRecoilWithMods: 396,
        verticalRecoil: 520,
        verticalRecoilWithMods: 317
      } as IRecoil
    ],
    [
      {
        'content': [],
        'ignorePrice': false,
        'itemId': '60db29ce99594040e04c4a27', // MTs-255-12 12ga shotgun
        'modSlots': [
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '60dc519adf4c47305f6d410d', // MTs-255-12 cylinder
              'modSlots': [
                {
                  'modSlotName': 'camora_000'
                },
                {
                  'modSlotName': 'camora_001'
                },
                {
                  'modSlotName': 'camora_002'
                },
                {
                  'modSlotName': 'camora_003'
                },
                {
                  'modSlotName': 'camora_004'
                }
              ],
              'quantity': 1
            },
            'modSlotName': 'mod_magazine'
          },
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '612368f58b401f4f51239b33', // МTs-255-12 12ga 755mm barrel with rib
              'modSlots': [
                {
                  'item': {
                    'content': [],
                    'ignorePrice': false,
                    'itemId': '619d36da53b4d42ee724fae4', // MTs-255-12 12ga choke
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_muzzle'
                }
              ],
              'quantity': 1
            },
            'modSlotName': 'mod_barrel'
          },
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '612781056f3d944a17348d60', // MTs-255-12 wooden stock
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_stock'
          },
          {
            'item': {
              'content': [],
              'ignorePrice': false,
              'itemId': '6123649463849f3d843da7c4', // MTs-255-12 beechwood forestock
              'modSlots': [],
              'quantity': 1
            },
            'modSlotName': 'mod_handguard'
          }
        ],
        'quantity': 1
      } as IInventoryItem,
      {
        horizontalRecoil: 650,
        horizontalRecoilWithMods: 345,
        verticalRecoil: 520,
        verticalRecoilWithMods: 276
      } as IRecoil
    ]
  ])('should get the recoil of an inventory item', async (inventoryItem: IInventoryItem, expected: IRecoil) => {
    // Arrange
    useItemServiceMock()
    Services.configure(ItemPropertiesService)
    const service = new InventoryItemService()

    // Act
    const recoil = await service.getRecoil(inventoryItem)

    // Assert
    expect(recoil.success).toBe(true)
    expect(recoil.value.horizontalRecoil).toBe(expected.horizontalRecoil)
    expect(recoil.value.horizontalRecoilWithMods).toBe(expected.horizontalRecoilWithMods)
    expect(recoil.value.verticalRecoil).toBe(expected.verticalRecoil)
    expect(recoil.value.verticalRecoilWithMods).toBe(expected.verticalRecoilWithMods)
  })

  it.each([
    [invalidInventoryItem1],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_pistol_grip'
          }
        ],
        quantity: 1
      } as IInventoryItem
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'chamber0'
          }
        ],
        quantity: 1
      } as IInventoryItem
    ]
  ])('should fail if an item cannot be found', async (inventoryItem: IInventoryItem) => {
    // Arrange
    useItemServiceMock()
    Services.configure(ItemPropertiesService)
    const service = new InventoryItemService()

    // Act
    const recoil = await service.getRecoil(inventoryItem)

    // Assert
    expect(recoil.success).toBe(false)
    expect(recoil.failureMessage).toBe('Item "invalid" not found.')
  })
})

describe('getRecoilPercentageModifier()', () => {
  it.each([
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '544fb45d4bdc2dee738b4568', // Salewa FIRST AID KIT (400/400)
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        recoilPercentageModifier: 0,
        recoilPercentageModifierWithMods: 0
      } as IRecoilPercentageModifier
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '58949dea86f77409483e16a8', // A2 9x19 Flash hider for MPX
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      {
        recoilPercentageModifier: -0.07,
        recoilPercentageModifierWithMods: -0.07
      } as IRecoilPercentageModifier
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c6d710d2e22165df16b81e7', // Surefire WarComp 5.56x45 Flash hider for AR-15
        modSlots: [
          {
            item: {
              content: [],
              itemId: '55d6190f4bdc2d87028b4567', // Surefire SOCOM556-MINI MONSTER 5.56x45 Silencer
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: undefined,
            modSlotName: 'mod_test'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        recoilPercentageModifier: -0.07,
        recoilPercentageModifierWithMods: -0.14
      } as IRecoilPercentageModifier
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '59d790f486f77403cb06aec6', // Armytek Predator Pro v3 XHP35 HI Flashlight. Testing the hypothetic case of a mod that on which a mod with recoil reduction could be mounted
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: '55d6190f4bdc2d87028b4567', // Surefire SOCOM556-MINI MONSTER 5.56x45 Silencer
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          },
          {
            item: undefined,
            modSlotName: 'mod_test'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        recoilPercentageModifier: 0,
        recoilPercentageModifierWithMods: -0.07
      } as IRecoilPercentageModifier
    ]
  ])('should get the recoil percentage modifier of an inventory item', async (inventoryItem: IInventoryItem, expected: IRecoilPercentageModifier) => {
    // Arrange
    useItemServiceMock()
    Services.configure(ItemPropertiesService)
    const service = new InventoryItemService()

    // Act
    const recoilPercentageModifier = await service.getRecoilPercentageModifier(inventoryItem)

    // Assert
    expect(recoilPercentageModifier.success).toBe(true)
    expect(recoilPercentageModifier.value.recoilPercentageModifier).toBe(expected.recoilPercentageModifier)
    expect(recoilPercentageModifier.value.recoilPercentageModifierWithMods).toBe(expected.recoilPercentageModifierWithMods)
  })

  it.each([
    [invalidInventoryItem1],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '5c6d710d2e22165df16b81e7', // Surefire WarComp 5.56x45 Flash hider for AR-15
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'mod_muzzle'
          }
        ],
        quantity: 1
      } as IInventoryItem
    ]
  ])(
    'should fail if an item cannot be found',
    async (inventoryItem: IInventoryItem) => {
      // Arrange
      useItemServiceMock()
      Services.configure(ItemPropertiesService)
      const service = new InventoryItemService()

      // Act
      const recoilPercentageModifier = await service.getRecoilPercentageModifier(
        inventoryItem
      )

      // Assert
      expect(recoilPercentageModifier.success).toBe(false)
      expect(recoilPercentageModifier.failureMessage).toBe('Item "invalid" not found.')
    }
  )
})

describe('getWeight()', () => {
  it.each([
    [
      inventoryItem,
      {
        weight: 0.96,
        weightWithContent: 3.176,
        unitWeight: 0.96
      } as IWeight
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: '56d59d3ad2720bdb418b4577', // 0.005 * 50 = 0.25
        modSlots: [],
        quantity: 50
      } as IInventoryItem,
      {
        weight: 0.25,
        weightWithContent: 0.25,
        unitWeight: 0.005
      } as IWeight
    ]
  ])(
    'should get the weight of an inventory item',
    async (inventoryItem: IInventoryItem, expected: IWeight) => {
      // Arrange
      useItemServiceMock()
      const service = new InventoryItemService()

      // Act
      const weight = await service.getWeight(inventoryItem)

      // Assert
      expect(weight.success).toBe(true)
      expect(weight.value.weight).toBe(expected.weight)
      expect(weight.value.weightWithContent).toBe(expected.weightWithContent)
      expect(weight.value.unitWeight).toBe(expected.unitWeight)
    }
  )

  it.each([
    [invalidInventoryItem1],
    [invalidInventoryItem2],
    [invalidInventoryItem3]
  ])(
    'should fail if an item cannot be found',
    async (inventoryItem: IInventoryItem) => {
      // Arrange
      useItemServiceMock()
      const service = new InventoryItemService()

      // Act
      const weight = await service.getWeight(inventoryItem)

      // Assert
      expect(weight.success).toBe(false)
      expect(weight.failureMessage).toBe('Item "invalid" not found.')
    }
  )
})