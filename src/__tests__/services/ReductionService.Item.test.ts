import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IItem } from '../../models/item/IItem'

describe('parseReducedItem', () => {
  it.each([
    [
      {},
      {
        categoryId: 'currency',
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/569668774bdc2da2298b4568-icon.jpg',
        id: '569668774bdc2da2298b4568',
        imageLink: 'https://assets.tarkov.dev/569668774bdc2da2298b4568-image.jpg',
        marketLink: 'https://tarkov.dev/item/euros',
        maxStackableAmount: 50000,
        shortName: 'EUR',
        name: 'Euros',
        prices: [],
        weight: 0,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Euros'
      } as IItem
    ],
    [
      {},
      {
        categoryId: 'headphones',
        conflictingItemIds: ['5aa7e276e5b5b000171d0647'],
        iconLink: 'https://assets.tarkov.dev/628e4e576d783146b124c64d-icon.jpg',
        id: '628e4e576d783146b124c64d',
        imageLink: 'https://assets.tarkov.dev/628e4e576d783146b124c64d-image.jpg',
        marketLink: 'https://tarkov.dev/item/peltor-comtac-4-hybrid-headset',
        maxStackableAmount: 1,
        name: 'Peltor ComTac 4 Hybrid headset',
        shortName: 'ComTac 4',
        prices: [],
        weight: 0.6,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Peltor_ComTac_4_Hybrid_headset'
      } as IItem
    ]
  ])('should parse a reduced item', (reducedItem: Record<string, unknown>, expected: IItem) => {
    // Arrange
    const service = new ReductionService()

    // Act
    const itemResult = service.parseReducedItem(reducedItem)

    // Assert
    expect(itemResult.success).toBe(true)
    expect(itemResult.value).toStrictEqual(expected)
  })
})