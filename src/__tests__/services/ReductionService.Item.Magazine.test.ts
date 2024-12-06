import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'aa': [
          '5e81f423763d9f754677bf2e',
          '5efb0cabfb3e451d70735af5',
          '5efb0fc6aeb21837e749c801',
          '5efb0d4f4bc50b58e81710f3',
          '5ea2a8e200685063ec28c05a'
        ],
        'ca': 7,
        'cs': -0.2,
        'e': -1,
        'l': -0.25,
        'ma': 0.04,
        'c': 'magazine',
        'ic': 'https://assets.tarkov.dev/5e81c4ca763d9f754677befa-icon.jpg',
        'i': '5e81c4ca763d9f754677befa',
        'im': 'https://assets.tarkov.dev/5e81c4ca763d9f754677befa-image.jpg',
        'm': 'https://tarkov.dev/item/m1911a1-45-acp-7-round-magazine',
        'n': 'M1911A1 .45 ACP 7-round magazine',
        's': '1911',
        'w': 0.16,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/M1911A1_.45_ACP_7-round_magazine'
      },
      {
        acceptedAmmunitionIds: [
          '5e81f423763d9f754677bf2e',
          '5efb0cabfb3e451d70735af5',
          '5efb0fc6aeb21837e749c801',
          '5efb0d4f4bc50b58e81710f3',
          '5ea2a8e200685063ec28c05a'
        ],
        baseItemId: undefined,
        capacity: 7,
        categoryId: ItemCategoryId.magazine,
        checkSpeedModifierPercentage: -0.2,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: -1,
        iconLink: 'https://assets.tarkov.dev/5e81c4ca763d9f754677befa-icon.jpg',
        id: '5e81c4ca763d9f754677befa',
        imageLink: 'https://assets.tarkov.dev/5e81c4ca763d9f754677befa-image.jpg',
        loadSpeedModifierPercentage: -0.25,
        malfunctionPercentage: 0.04,
        marketLink: 'https://tarkov.dev/item/m1911a1-45-acp-7-round-magazine',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'M1911A1 .45 ACP 7-round magazine',
        presetErgonomicsModifier: undefined,
        presetWeight: undefined,
        prices: [],
        shortName: '1911',
        weight: 0.16,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M1911A1_.45_ACP_7-round_magazine'
      } as IMagazine
    ],
    [
      {
        'aa': [
          '5ede474b0c226a66f5402622',
          '5ede475b549eed7c6d5c18fb',
          '5ede4739e0350d05467f73e8',
          '5f0c892565703e5c461894e9',
          '5ede47405b097655935d7d16',
          '5ede475339ee016e8c534742'
        ],
        'e': -10,
        'mo': [
          {
            'i': [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            'n': 'camora_000'
          },
          {
            'i': [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            'n': 'camora_001'
          },
          {
            'i': [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            'n': 'camora_002'
          },
          {
            'i': [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            'n': 'camora_003'
          },
          {
            'i': [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            'n': 'camora_004'
          },
          {
            'i': [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            'n': 'camora_005'
          }
        ],
        'c': 'magazine',
        'ic': 'https://assets.tarkov.dev/627bce33f21bc425b06ab967-icon.webp',
        'i': '627bce33f21bc425b06ab967',
        'im': 'https://assets.tarkov.dev/627bce33f21bc425b06ab967-image.webp',
        'm': 'https://tarkov.dev/item/m32a1-40mm-cylinder',
        'n': 'M32A1 40mm cylinder',
        's': 'MSGL',
        'w': 0.8,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/M32A1_40mm_cylinder'
      },
      {
        acceptedAmmunitionIds: [
          '5ede474b0c226a66f5402622',
          '5ede475b549eed7c6d5c18fb',
          '5ede4739e0350d05467f73e8',
          '5f0c892565703e5c461894e9',
          '5ede47405b097655935d7d16',
          '5ede475339ee016e8c534742'
        ],
        baseItemId: undefined,
        capacity: 0,
        categoryId: ItemCategoryId.magazine,
        checkSpeedModifierPercentage: 0,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: -10,
        iconLink: 'https://assets.tarkov.dev/627bce33f21bc425b06ab967-icon.webp',
        id: '627bce33f21bc425b06ab967',
        imageLink: 'https://assets.tarkov.dev/627bce33f21bc425b06ab967-image.webp',
        loadSpeedModifierPercentage: 0,
        malfunctionPercentage: 0,
        marketLink: 'https://tarkov.dev/item/m32a1-40mm-cylinder',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            maxStackableAmount: 1,
            name: 'camora_000',
            required: false
          },
          {
            compatibleItemIds: [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            maxStackableAmount: 1,
            name: 'camora_001',
            required: false
          },
          {
            compatibleItemIds: [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            maxStackableAmount: 1,
            name: 'camora_002',
            required: false
          },
          {
            compatibleItemIds: [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            maxStackableAmount: 1,
            name: 'camora_003',
            required: false
          },
          {
            compatibleItemIds: [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            maxStackableAmount: 1,
            name: 'camora_004',
            required: false
          },
          {
            compatibleItemIds: [
              '5ede474b0c226a66f5402622',
              '5ede475b549eed7c6d5c18fb',
              '5ede4739e0350d05467f73e8',
              '5f0c892565703e5c461894e9',
              '5ede47405b097655935d7d16',
              '5ede475339ee016e8c534742'
            ],
            maxStackableAmount: 1,
            name: 'camora_005',
            required: false
          }
        ],
        name: 'M32A1 40mm cylinder',
        presetErgonomicsModifier: undefined,
        presetWeight: undefined,
        prices: [],
        shortName: 'MSGL',
        weight: 0.8,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M32A1_40mm_cylinder'
      } as IMagazine
    ]
  ])('should parse a reduced magazine', (reducedMagazine: Record<string, unknown>, expected: IMagazine) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const magazine = service.parseReducedItem(reducedMagazine)

    // Assert
    expect(magazine).toStrictEqual(expected)
  })
})