import { describe, expect, it } from 'vitest'
import { ReductionService } from '../../services/ReductionService'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': -0.01,
        'e': -5,
        'r': -0.15,
        'c': 'rangedWeaponMod',
        'ic': 'https://assets.tarkov.dev/58aeac1b86f77457c419f475-icon.jpg',
        'i': '58aeac1b86f77457c419f475',
        'im': 'https://assets.tarkov.dev/58aeac1b86f77457c419f475-image.jpg',
        'm': 'https://tarkov.dev/item/mpx-sd-9x19-integrated-sound-suppressor',
        'n': 'MPX-SD 9x19 integrated sound suppressor',
        's': 'MPX-SD',
        'w': 0.6,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/MPX-SD_9x19_integrated_sound_suppressor'
      },
      {
        accuracyPercentageModifier: -0.01,
        baseItemId: undefined,
        categoryId: 'rangedWeaponMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: -5,
        iconLink: 'https://assets.tarkov.dev/58aeac1b86f77457c419f475-icon.jpg',
        id: '58aeac1b86f77457c419f475',
        imageLink: 'https://assets.tarkov.dev/58aeac1b86f77457c419f475-image.jpg',
        marketLink: 'https://tarkov.dev/item/mpx-sd-9x19-integrated-sound-suppressor',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'MPX-SD 9x19 integrated sound suppressor',
        presetErgonomicsModifier: undefined,
        presetRecoilPercentageModifier: undefined,
        prices: [],
        recoilPercentageModifier: -0.15,
        shortName: 'MPX-SD',
        weight: 0.6,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MPX-SD_9x19_integrated_sound_suppressor'
      } as IRangedWeaponMod
    ],
    [
      {
        'mo': [
          {
            'i': [
              '5d15ce51d7ad1a1eff619092',
              '5a957c3fa2750c00137fa5f7',
              '57dc32dc245977596d4ef3d3',
              '57ffa9f4245977728561e844'
            ],
            'n': 'mod_handguard'
          }
        ],
        'c': 'rangedWeaponMod',
        'ic': 'https://assets.tarkov.dev/59d36a0086f7747e673f3946-icon.jpg',
        'i': '59d36a0086f7747e673f3946',
        'im': 'https://assets.tarkov.dev/59d36a0086f7747e673f3946-image.jpg',
        'm': 'https://tarkov.dev/item/aks-74u-gas-tube-6p26-sb1-2',
        'n': 'AKS-74U gas tube (6P26 Sb.1-2)',
        's': '6P26 Sb.1-2',
        'w': 0.03,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/AKS-74U_gas_tube_(6P26_Sb.1-2)'
      },
      {
        accuracyPercentageModifier: 0,
        baseItemId: undefined,
        categoryId: 'rangedWeaponMod',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomicsModifier: 0,
        iconLink: 'https://assets.tarkov.dev/59d36a0086f7747e673f3946-icon.jpg',
        id: '59d36a0086f7747e673f3946',
        imageLink: 'https://assets.tarkov.dev/59d36a0086f7747e673f3946-image.jpg',
        marketLink: 'https://tarkov.dev/item/aks-74u-gas-tube-6p26-sb1-2',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '5d15ce51d7ad1a1eff619092',
              '5a957c3fa2750c00137fa5f7',
              '57dc32dc245977596d4ef3d3',
              '57ffa9f4245977728561e844'
            ],
            maxStackableAmount: 1,
            name: 'mod_handguard',
            required: false
          }
        ],
        name: 'AKS-74U gas tube (6P26 Sb.1-2)',
        presetErgonomicsModifier: undefined,
        presetRecoilPercentageModifier: undefined,
        prices: [],
        recoilPercentageModifier: 0,
        shortName: '6P26 Sb.1-2',
        weight: 0.03,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AKS-74U_gas_tube_(6P26_Sb.1-2)'
      } as IRangedWeaponMod
    ]
  ])('should parse a reduced ranged weapon mod', (reducedRangedWeaponMod: Record<string, unknown>, expected: IRangedWeaponMod) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const rangedWeaponMod = service.parseReducedItem(reducedRangedWeaponMod)

    // Assert
    expect(rangedWeaponMod).toStrictEqual(expected)
  })
})