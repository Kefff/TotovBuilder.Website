import { IPrice } from '../../models/item/IPrice'
import { PriceUtils } from '../../utils/PriceUtils'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { describe, expect, it } from 'vitest'

describe('sortByCurrency()', () => {
  it.each([
    [
      [
        {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5449016a4bdc2d6f028b456f',
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 10000,
          valueInMainCurrency: 10000
        },
        {
          barterItems: [
            {
              itemId: '5e32f56fcb6d5863cc5e5ee4',
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: '',
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          barterItems: [],
          currencyName: 'USD',
          itemId: '5696686a4bdc2da3298b456a',
          merchant: 'peacekeeper',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 1200
        },
        {
          barterItems: [],
          currencyName: 'EUR',
          itemId: '569668774bdc2da2298b4568',
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 2400
        }
      ],
      [
        {
          barterItems: [
            {
              itemId: '5e32f56fcb6d5863cc5e5ee4',
              quantity: 1
            }
          ],
          currencyName: 'barter',
          itemId: '',
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 0,
          valueInMainCurrency: 0
        },
        {
          barterItems: [],
          currencyName: 'EUR',
          itemId: '569668774bdc2da2298b4568',
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 2400
        },
        {
          barterItems: [],
          currencyName: 'USD',
          itemId: '5696686a4bdc2da3298b456a',
          merchant: 'peacekeeper',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 1200
        },
        {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '5449016a4bdc2d6f028b456f',
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 10000,
          valueInMainCurrency: 10000
        }
      ]
    ],
    [
      [
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: '569668774bdc2da2298b4568',
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 20
        },
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: '5696686a4bdc2da3298b456a',
          merchant: 'peacekeeper',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 10
        }
      ],
      [
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: '569668774bdc2da2298b4568',
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 20
        },
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: '5696686a4bdc2da3298b456a',
          merchant: 'peacekeeper',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 10
        }
      ]
    ]
  ])('should sort prices by currency', (prices: IPrice[], expected: IPrice[]) => {
    // Arrange
    useTarkovValuesServiceMock()

    // Act
    prices = PriceUtils.sortByCurrency(prices)

    // Assert
    expect(prices).toStrictEqual(expected)
  })
})