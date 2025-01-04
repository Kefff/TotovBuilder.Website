import { describe, expect, it } from 'vitest'
import { IPrice } from '../../models/item/IPrice'
import { PriceUtils } from '../../utils/PriceUtils'
import { eur, rgd5, rub, usd } from '../__data__/itemMocks'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'

describe('sortByCurrency()', () => {
  it.each([
    [
      [
        {
          barterItems: [],
          currencyName: 'RUB',
          itemId: rub.id,
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 10000,
          valueInMainCurrency: 10000
        },
        {
          barterItems: [
            {
              itemId: rgd5.id,
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
          itemId: usd.id,
          merchant: 'peacekeeper',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 1200
        },
        {
          barterItems: [],
          currencyName: 'EUR',
          itemId: eur.id,
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
              itemId: rgd5.id,
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
          currencyName: 'RUB',
          itemId: rub.id,
          merchant: 'prapor',
          merchantLevel: 1,
          quest: undefined,
          value: 10000,
          valueInMainCurrency: 10000
        },
        {
          barterItems: [],
          currencyName: 'EUR',
          itemId: eur.id,
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 2400
        },
        {
          barterItems: [],
          currencyName: 'USD',
          itemId: usd.id,
          merchant: 'peacekeeper',
          merchantLevel: 1,
          quest: undefined,
          value: 10,
          valueInMainCurrency: 1200
        }
      ]
    ],
    [
      [
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: eur.id,
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 20
        },
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: usd.id,
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
          itemId: eur.id,
          merchant: 'mechanic',
          merchantLevel: 1,
          quest: undefined,
          value: 20,
          valueInMainCurrency: 20
        },
        {
          barterItems: [],
          currencyName: 'Invalid',
          itemId: usd.id,
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