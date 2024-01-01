import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IContainer } from '../../models/item/IContainer'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ca': 4,
        'c': 'container',
        'ic': 'https://assets.tarkov.dev/5783c43d2459774bbe137486-icon.jpg',
        'i': '5783c43d2459774bbe137486',
        'im': 'https://assets.tarkov.dev/5783c43d2459774bbe137486-image.jpg',
        'm': 'https://tarkov.dev/item/simple-wallet',
        'n': 'Simple wallet',
        's': 'Wallet',
        'w': 0.23,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Simple_wallet'
      },
      {
        capacity: 4,
        categoryId: 'container',
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/5783c43d2459774bbe137486-icon.jpg',
        id: '5783c43d2459774bbe137486',
        imageLink: 'https://assets.tarkov.dev/5783c43d2459774bbe137486-image.jpg',
        marketLink: 'https://tarkov.dev/item/simple-wallet',
        maxStackableAmount: 1,
        name: 'Simple wallet',
        prices: [],
        shortName: 'Wallet',
        weight: 0.23,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Simple_wallet'
      } as IContainer
    ],
    [
      {
        'c': 'container',
        'ic': 'https://assets.tarkov.dev/empty-container-icon.jpg',
        'i': 'empty-container',
        'im': 'https://assets.tarkov.dev/empty-container-image.jpg',
        'm': 'https://tarkov.dev/item/empty-container',
        'n': 'Empty container',
        's': 'Empty',
        'w': 0.23,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Empty_container'
      },
      {
        capacity: 0,
        categoryId: 'container',
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/empty-container-icon.jpg',
        id: 'empty-container',
        imageLink: 'https://assets.tarkov.dev/empty-container-image.jpg',
        marketLink: 'https://tarkov.dev/item/empty-container',
        maxStackableAmount: 1,
        name: 'Empty container',
        prices: [],
        shortName: 'Empty',
        weight: 0.23,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Empty_container'
      } as IContainer
    ]
  ])('should parse a reduced container', (reducedContainer: Record<string, unknown>, expected: IContainer) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const container = service.parseReducedItem(reducedContainer)

    // Assert
    expect(container).toStrictEqual(expected)
  })
})