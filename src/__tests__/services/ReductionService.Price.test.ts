import { describe, expect, it } from 'vitest'
import { IPrice } from '../../models/item/IPrice'
import { ReductionService } from '../../services/ReductionService'

describe('parseReducedPrice', () => {
  it.each([
    [
      {
        'i': '5447a9cd4bdc2dbd208b4567',
        'v': 89934,
        'vm': 89934
      },
      {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '5447a9cd4bdc2dbd208b4567',
        merchant: 'flea-market',
        merchantLevel: 0,
        quest: null,
        value: 89934,
        valueInMainCurrency: 89934
      }
    ],
    [
      {
        'b': [
          {
            'i': '590c595c86f7747884343ad7'
          },
          {
            'i': '5e2aedd986f7746d404f3aa4',
            'q': 2
          }
        ],
        'c': 'barter',
        'i': '59c1383d86f774290a37e0ca',
        'm': 'peacekeeper',
        'ml': 3,
        'q': {
          'i': '5a27bbf886f774333a418eeb',
          'n': 'Wet Job - Part 2',
          'w': 'https://escapefromtarkov.fandom.com/wiki/Wet_Job_-_Part_2'
        }
      },
      {
        barterItems: [
          {
            itemId: '590c595c86f7747884343ad7',
            quantity: 1
          },
          {
            itemId: '5e2aedd986f7746d404f3aa4',
            quantity: 2
          }
        ],
        currencyName: 'barter',
        itemId: '59c1383d86f774290a37e0ca',
        merchant: 'peacekeeper',
        merchantLevel: 3,
        quest: {
          id: '5a27bbf886f774333a418eeb',
          name: 'Wet Job - Part 2',
          wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Wet_Job_-_Part_2'
        },
        value: 0.0,
        valueInMainCurrency: 0.0
      }
    ]
  ])('should parse a reduced price', (reducedPrice: Record<string, unknown>, expected: IPrice) => {
    // Arrange
    const service = new ReductionService()

    // Act
    const price = service.parseReducedPrice(reducedPrice)

    // Assert
    expect(price).toStrictEqual(expected)
  })
})