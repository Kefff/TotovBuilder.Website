import { describe, expect, it } from 'vitest'
import { IHeadwear } from '../../models/item/IHeadwear'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'
import { cqcm, kotton, lshZ2dtm } from '../__data__/itemMocks'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 4,
        'aa': [
          'Head, Top of the head',
          'Head, Nape',
          'Head, Ears'
        ],
        'h': 1,
        'de': 'High',
        'd': 99,
        'e': -0.03,
        'ma': 'Combined materials',
        'mo': [
          {
            'c': 'Gear',
            'i': [
              '5d6d3829a4b9361bc8618943'
            ],
            'n': 'mod_equipment_000'
          },
          {
            'c': 'Shroud',
            'i': [
              '5c0558060db834001b735271',
              '5a16b8a9fcdbcb00165aa6ca'
            ],
            'n': 'mod_nvg'
          },
          {
            'c': 'Mount',
            'i': [
              '5a800961159bd4315e3a1657',
              '57fd23e32459772d0805bcf1',
              '544909bb4bdc2d6f028b4577',
              '5d10b49bd7ad1a1a560708b0',
              '5c06595c0db834001a66af6c',
              '626becf9582c3e319310b837',
              '6272370ee4013c5d7e31f418',
              '6272379924e29f06af4d5ecb',
              '5d2369418abbc306c62e0c80',
              '5b07dd285acfc4001754240d',
              '56def37dd2720bec348b456a',
              '5a7b483fe899ef0016170d15',
              '5a5f1ce64f39f90b401987bc',
              '560d657b4bdc2da74d8b4572',
              '5b3a337e5acfc4704b4a19a0',
              '5c5952732e2216398b5abda2',
              '57d17e212459775a1179a0f5',
              '6267c6396b642f77f56f5c1c'
            ],
            'n': 'mod_mount'
          },
          {
            'c': 'Gear',
            'i': [
              '5d6d3be5a4b9361bc73bc763'
            ],
            'n': 'mod_equipment_001'
          },
          {
            'c': 'Gear',
            'i': [
              '5d6d3943a4b9360dbc46d0cc'
            ],
            'n': 'mod_equipment_002'
          }
        ],
        'r': 'High',
        't': -0.03,
        'c': 'headwear',
        'ic': 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-icon.webp',
        'i': '5d6d3716a4b9361bc8618872',
        'im': 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-image.webp',
        'm': 'https://tarkov.dev/item/bnti-lshz-2dtm-helmet-black',
        'n': 'BNTI LShZ-2DTM helmet (Black)',
        's': 'LShZ-2DTM',
        'w': 3.4,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/BNTI_LShZ-2DTM_helmet_(Black)'
      },
      lshZ2dtm
    ],
    [
      {
        'c': 'headwear',
        'co': [
          '5b432be65acfc433000ed01f',
          '59e770b986f7742cbd762754'
        ],
        'ic': 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-icon.webp',
        'i': '5bd073c986f7747f627e796c',
        'im': 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-image.webp',
        'm': 'https://tarkov.dev/item/kotton-beanie',
        'n': 'Kotton beanie',
        's': 'Kotton',
        'w': 0.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Kotton_beanie'
      },
      kotton
    ],
    [
      {
        'ac': 4,
        'd': 35,
        'e': -0.02,
        'ma': 'Ultra high molecular weight polyethylene',
        'ms': -0.01,
        'r': 'High',
        't': -0.03,
        'c': 'faceCover',
        'co': [
          '66b5f65ca7f72d197e70bcd6',
          '66b5f666cad6f002ab7214c2',
          '66b5f661af44ca0014063c05',
          '5e01ef6886f77445f643baa4',
          '5e00c1ad86f774747333222c'
        ],
        'ic': 'https://assets.tarkov.dev/657089638db3adca1009f4ca-icon.webp',
        'i': '657089638db3adca1009f4ca',
        'im': 'https://assets.tarkov.dev/657089638db3adca1009f4ca-image.webp',
        'm': 'https://tarkov.dev/item/atomic-defense-cqcm-up-armored-ballistic-mask-black',
        'n': 'Atomic Defense CQCM up armored ballistic mask (Black)',
        's': 'CQCM',
        'w': 2.1,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Atomic_Defense_CQCM_up_armored_ballistic_mask_(Black)'
      },
      cqcm
    ]
  ])('should parse a reduced headwear', (reducedHeadwear: Record<string, unknown>, expected: IHeadwear) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const headwear = service.parseReducedItem(reducedHeadwear)

    // Assert
    expect(headwear).toStrictEqual(expected)
  })
})