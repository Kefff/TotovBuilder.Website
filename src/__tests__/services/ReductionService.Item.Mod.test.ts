import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'e': -2,
        'c': 'mod',
        'ic': 'https://assets.tarkov.dev/59d790f486f77403cb06aec6-icon.jpg',
        'i': '59d790f486f77403cb06aec6',
        'im': 'https://assets.tarkov.dev/59d790f486f77403cb06aec6-image.jpg',
        'm': 'https://tarkov.dev/item/armytek-predator-pro-v3-xhp35-hi-flashlight',
        'n': 'Armytek Predator Pro v3 XHP35 HI flashlight',
        's': 'XHP35',
        'w': 0.12,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Armytek_Predator_Pro_v3_XHP35_HI_flashlight'
      },
      {
        baseItemId: undefined,
        categoryId: ItemCategoryId.mod,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: -2,
        iconLink: 'https://assets.tarkov.dev/59d790f486f77403cb06aec6-icon.jpg',
        id: '59d790f486f77403cb06aec6',
        imageLink: 'https://assets.tarkov.dev/59d790f486f77403cb06aec6-image.jpg',
        marketLink: 'https://tarkov.dev/item/armytek-predator-pro-v3-xhp35-hi-flashlight',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Armytek Predator Pro v3 XHP35 HI flashlight',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'XHP35',
        weight: 0.12,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Armytek_Predator_Pro_v3_XHP35_HI_flashlight'
      } as IMod
    ],
    [
      {
        'mo': [
          {
            'i': [
              '5a800961159bd4315e3a1657',
              '57fd23e32459772d0805bcf1',
              '544909bb4bdc2d6f028b4577',
              '5c06595c0db834001a66af6c',
              '5cc9c20cd7f00c001336c65d',
              '5d2369418abbc306c62e0c80',
              '5b07dd285acfc4001754240d',
              '56def37dd2720bec348b456a',
              '5a7b483fe899ef0016170d15',
              '61605d88ffa6e502ac5e7eeb',
              '5a5f1ce64f39f90b401987bc',
              '560d657b4bdc2da74d8b4572',
              '5b3a337e5acfc4704b4a19a0',
              '5c5952732e2216398b5abda2',
              '57d17e212459775a1179a0f5',
              '6267c6396b642f77f56f5c1c',
              '6272370ee4013c5d7e31f418',
              '6272379924e29f06af4d5ecb',
              '626becf9582c3e319310b837'
            ],
            'n': 'mod_tactical'
          }
        ],
        'c': 'mod',
        'ic': 'https://assets.tarkov.dev/58a56f8d86f774651579314c-icon.jpg',
        'i': '58a56f8d86f774651579314c',
        'im': 'https://assets.tarkov.dev/58a56f8d86f774651579314c-image.jpg',
        'm': 'https://tarkov.dev/item/mpx-gen1-handguard-2-inch-rail',
        'n': 'MPX GEN1 handguard 2 inch rail',
        's': 'MPX 2\u0022',
        'w': 0.07,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/MPX_GEN1_handguard_2_inch_rail'
      },
      {
        baseItemId: undefined,
        categoryId: ItemCategoryId.mod,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 0,
        iconLink: 'https://assets.tarkov.dev/58a56f8d86f774651579314c-icon.jpg',
        id: '58a56f8d86f774651579314c',
        imageLink: 'https://assets.tarkov.dev/58a56f8d86f774651579314c-image.jpg',
        marketLink: 'https://tarkov.dev/item/mpx-gen1-handguard-2-inch-rail',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '5a800961159bd4315e3a1657',
              '57fd23e32459772d0805bcf1',
              '544909bb4bdc2d6f028b4577',
              '5c06595c0db834001a66af6c',
              '5cc9c20cd7f00c001336c65d',
              '5d2369418abbc306c62e0c80',
              '5b07dd285acfc4001754240d',
              '56def37dd2720bec348b456a',
              '5a7b483fe899ef0016170d15',
              '61605d88ffa6e502ac5e7eeb',
              '5a5f1ce64f39f90b401987bc',
              '560d657b4bdc2da74d8b4572',
              '5b3a337e5acfc4704b4a19a0',
              '5c5952732e2216398b5abda2',
              '57d17e212459775a1179a0f5',
              '6267c6396b642f77f56f5c1c',
              '6272370ee4013c5d7e31f418',
              '6272379924e29f06af4d5ecb',
              '626becf9582c3e319310b837'
            ],
            maxStackableAmount: 1,
            name: 'mod_tactical',
            required: false
          }
        ],
        name: 'MPX GEN1 handguard 2 inch rail',
        presetErgonomicsModifier: undefined,
        prices: [],
        shortName: 'MPX 2"',
        weight: 0.07,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MPX_GEN1_handguard_2_inch_rail'
      } as IMod
    ]
  ])('should parse a reduced mod', (reducedMod: Record<string, unknown>, expected: IMod) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const mod = service.parseReducedItem(reducedMod)

    // Assert
    expect(mod).toStrictEqual(expected)
  })
})