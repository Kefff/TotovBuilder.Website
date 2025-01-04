import { describe, expect, it } from 'vitest'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'c': 'currency',
        'ic': 'https://assets.tarkov.dev/569668774bdc2da2298b4568-icon.jpg',
        'i': '569668774bdc2da2298b4568',
        'im': 'https://assets.tarkov.dev/569668774bdc2da2298b4568-image.jpg',
        'a': 50000,
        'm': 'https://tarkov.dev/item/euros',
        'n': 'Euros',
        's': 'EUR',
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Euros'
      },
      {
        categoryId: ItemCategoryId.currency,
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/569668774bdc2da2298b4568-icon.jpg',
        id: '569668774bdc2da2298b4568',
        imageLink: 'https://assets.tarkov.dev/569668774bdc2da2298b4568-image.jpg',
        marketLink: 'https://tarkov.dev/item/euros',
        maxStackableAmount: 50000,
        name: 'Euros',
        presetWeight: undefined,
        prices: [],
        shortName: 'EUR',
        weight: 0,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Euros'
      } as IItem
    ],
    [
      {
        'c': 'headphones',
        'co': [
          '5aa7e276e5b5b000171d0647'
        ],
        'ic': 'https://assets.tarkov.dev/628e4e576d783146b124c64d-icon.jpg',
        'i': '628e4e576d783146b124c64d',
        'im': 'https://assets.tarkov.dev/628e4e576d783146b124c64d-image.jpg',
        'm': 'https://tarkov.dev/item/peltor-comtac-4-hybrid-headset',
        'n': 'Peltor ComTac 4 Hybrid headset',
        's': 'ComTac 4',
        'w': 0.6,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Peltor_ComTac_4_Hybrid_headset'
      },
      {
        categoryId: ItemCategoryId.headphones,
        conflictingItemIds: ['5aa7e276e5b5b000171d0647'],
        iconLink: 'https://assets.tarkov.dev/628e4e576d783146b124c64d-icon.jpg',
        id: '628e4e576d783146b124c64d',
        imageLink: 'https://assets.tarkov.dev/628e4e576d783146b124c64d-image.jpg',
        marketLink: 'https://tarkov.dev/item/peltor-comtac-4-hybrid-headset',
        maxStackableAmount: 1,
        name: 'Peltor ComTac 4 Hybrid headset',
        prices: [],
        presetWeight: undefined,
        shortName: 'ComTac 4',
        weight: 0.6,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Peltor_ComTac_4_Hybrid_headset'
      } as IItem
    ],
    [
      {
        'ic': 'https://assets.tarkov.dev/5c1d0c5f86f7744bb2683cf0-icon.jpg',
        'i': '5c1d0c5f86f7744bb2683cf0',
        'im': 'https://assets.tarkov.dev/5c1d0c5f86f7744bb2683cf0-image.jpg',
        'm': 'https://tarkov.dev/item/terragroup-labs-keycard-blue',
        'n': 'TerraGroup Labs keycard (Blue)',
        's': 'Blue',
        'w': 0.01,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/TerraGroup_Labs_keycard_(Blue)'
      },
      {
        categoryId: ItemCategoryId.other,
        conflictingItemIds: [],
        iconLink: 'https://assets.tarkov.dev/5c1d0c5f86f7744bb2683cf0-icon.jpg',
        id: '5c1d0c5f86f7744bb2683cf0',
        imageLink: 'https://assets.tarkov.dev/5c1d0c5f86f7744bb2683cf0-image.jpg',
        marketLink: 'https://tarkov.dev/item/terragroup-labs-keycard-blue',
        maxStackableAmount: 1,
        name: 'TerraGroup Labs keycard (Blue)',
        presetWeight: undefined,
        prices: [],
        shortName: 'Blue',
        weight: 0.01,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/TerraGroup_Labs_keycard_(Blue)'
      } as IItem
    ]
  ])('should parse a reduced item', (reducedItem: Record<string, unknown>, expected: IItem) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const item = service.parseReducedItem(reducedItem)

    // Assert
    expect(item).toStrictEqual(expected)
  })
})