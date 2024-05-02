import { describe, expect, it } from 'vitest'
import { IArmorMod } from '../../models/item/IArmorMod'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 6,
        'aa': [
          'HeadTopOfTheHead',
          'HeadNape'
        ],
        'd': 40,
        'e': -0.05,
        'ma': 'Ceramic',
        'mo': [
          {
            'i': [
              '5c0558060db834001b735271',
              '5a16b8a9fcdbcb00165aa6ca'
            ],
            'n': 'mod_nvg'
          }
        ],
        't': -0.06,
        'c': 'armorMod',
        'co': [
          '5a16ba61fcdbcb098008728a',
          '5a16b672fcdbcb001912fa83',
          '5a16b7e1fcdbcb00165aa6c9',
          '5aa7e3abe5b5b000171d064d',
          '5c0e66e2d174af02a96252f4',
          '5e00cdd986f7747473332240'
        ],
        'ic': 'https://assets.tarkov.dev/5ea18c84ecf1982c7712d9a2-icon.webp',
        'i': '5ea18c84ecf1982c7712d9a2',
        'im': 'https://assets.tarkov.dev/5ea18c84ecf1982c7712d9a2-image.webp',
        'm': 'https://tarkov.dev/item/diamond-age-bastion-helmet-armor-plate',
        'n': 'Diamond Age Bastion helmet armor plate',
        's': 'Bastion plate',
        'w': 0.99,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Diamond_Age_Bastion_helmet_armor_plate'
      },
      {
        armorClass: 6,
        armoredAreas: [
          'HeadTopOfTheHead',
          'HeadNape'
        ],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0,
        conflictingItemIds: [
          '5a16ba61fcdbcb098008728a',
          '5a16b672fcdbcb001912fa83',
          '5a16b7e1fcdbcb00165aa6c9',
          '5aa7e3abe5b5b000171d064d',
          '5c0e66e2d174af02a96252f4',
          '5e00cdd986f7747473332240'
        ],
        categoryId: 'armorMod',
        defaultPresetId: undefined,
        durability: 40,
        ergonomicsModifierPercentage: -0.05,
        iconLink: 'https://assets.tarkov.dev/5ea18c84ecf1982c7712d9a2-icon.webp',
        id: '5ea18c84ecf1982c7712d9a2',
        imageLink: 'https://assets.tarkov.dev/5ea18c84ecf1982c7712d9a2-image.webp',
        marketLink: 'https://tarkov.dev/item/diamond-age-bastion-helmet-armor-plate',
        material: 'Ceramic',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '5c0558060db834001b735271',
              '5a16b8a9fcdbcb00165aa6ca'
            ],
            maxStackableAmount: 1,
            name: 'mod_nvg',
            required: false
          }
        ],
        movementSpeedModifierPercentage: 0,
        name: 'Diamond Age Bastion helmet armor plate',
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'Bastion plate',
        turningSpeedModifierPercentage: -0.06,
        weight: 0.99,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Diamond_Age_Bastion_helmet_armor_plate'
      } as IArmorMod
    ],
    [
      {
        'ac': 3,
        'aa': [
          'HeadFace',
          'HeadEyes',
          'HeadJaws'
        ],
        'bp': 0.1,
        'd': 40,
        'e': -0.04,
        'ma': 'Glass',
        't': -0.08,
        'c': 'armorMod',
        'co': [
          '5c0e66e2d174af02a96252f4',
          '5c0696830db834001d23f5da',
          '5c066e3a0db834001b7353f0',
          '5c0558060db834001b735271',
          '57235b6f24597759bf5a30f1',
          '5c110624d174af029e69734c',
          '5a16b8a9fcdbcb00165aa6ca',
          '5a398b75c4a282000a51a266',
          '5a398ab9c4a282000c5a9842'
        ],
        'ic': 'https://assets.tarkov.dev/5a16b7e1fcdbcb00165aa6c9-icon.webp',
        'i': '5a16b7e1fcdbcb00165aa6c9',
        'im': 'https://assets.tarkov.dev/5a16b7e1fcdbcb00165aa6c9-image.webp',
        'm': 'https://tarkov.dev/item/ops-core-fast-multi-hit-ballistic-face-shield',
        'n': 'Ops-Core FAST multi-hit ballistic face shield',
        's': 'FAST FS',
        'w': 1.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Ops-Core_FAST_multi-hit_ballistic_face_shield'
      },
      {
        armorClass: 3,
        armoredAreas: [
          'HeadFace',
          'HeadEyes',
          'HeadJaws'
        ],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0.1,
        categoryId: 'armorMod',
        conflictingItemIds: [
          '5c0e66e2d174af02a96252f4',
          '5c0696830db834001d23f5da',
          '5c066e3a0db834001b7353f0',
          '5c0558060db834001b735271',
          '57235b6f24597759bf5a30f1',
          '5c110624d174af029e69734c',
          '5a16b8a9fcdbcb00165aa6ca',
          '5a398b75c4a282000a51a266',
          '5a398ab9c4a282000c5a9842'
        ],
        defaultPresetId: undefined,
        durability: 40,
        ergonomicsModifierPercentage: -0.04,
        iconLink: 'https://assets.tarkov.dev/5a16b7e1fcdbcb00165aa6c9-icon.webp',
        id: '5a16b7e1fcdbcb00165aa6c9',
        imageLink: 'https://assets.tarkov.dev/5a16b7e1fcdbcb00165aa6c9-image.webp',
        marketLink: 'https://tarkov.dev/item/ops-core-fast-multi-hit-ballistic-face-shield',
        material: 'Glass',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedModifierPercentage: 0,
        name: 'Ops-Core FAST multi-hit ballistic face shield',
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'FAST FS',
        turningSpeedModifierPercentage: -0.08,
        weight: 1.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Ops-Core_FAST_multi-hit_ballistic_face_shield'
      } as IArmorMod
    ]
  ])('should parse a reduced armor mod', (reducedArmorMod: Record<string, unknown>, expected: IArmorMod) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const armorMod = service.parseReducedItem(reducedArmorMod)

    // Assert
    expect(armorMod).toStrictEqual(expected)
  })
})