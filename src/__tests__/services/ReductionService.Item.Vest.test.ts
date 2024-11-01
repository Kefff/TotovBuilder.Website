import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'ac': 4,
        'aa': [
          'Chest',
          'Stomach',
          'ThoraxUpperBack',
          'StomachLowerBack',
          'StomachGroin',
          'StomachButtocks'
        ],
        'e': -0.07,
        'ma': 'Titan',
        'ms': -0.05,
        't': -0.01,
        'ca': 12,
        'c': 'vest',
        'ic': 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-icon.webp',
        'i': '5d5d646386f7742797261fd9',
        'im': 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-image.webp',
        'm': 'https://tarkov.dev/item/6b3tm-01-armored-rig-khaki',
        'n': '6B3TM-01 armored rig (Khaki)',
        's': '6B3TM-01',
        'w': 8.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/6B3TM-01_armored_rig_(Khaki)'
      },
      {
        armorClass: 4,
        armoredAreas: [
          'Chest',
          'Stomach',
          'ThoraxUpperBack',
          'StomachLowerBack',
          'StomachGroin',
          'StomachButtocks'
        ],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0,
        capacity: 12,
        categoryId: ItemCategoryId.vest,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsModifierPercentage: -0.07,
        iconLink: 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-icon.webp',
        id: '5d5d646386f7742797261fd9',
        imageLink: 'https://assets.tarkov.dev/5d5d646386f7742797261fd9-image.webp',
        marketLink: 'https://tarkov.dev/item/6b3tm-01-armored-rig-khaki',
        material: 'Titan',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedModifierPercentage: -0.05,
        name: '6B3TM-01 armored rig (Khaki)',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: '6B3TM-01',
        turningSpeedModifierPercentage: -0.01,
        weight: 8.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B3TM-01_armored_rig_(Khaki)'
      } as IVest
    ],
    [
      {
        'ac': 5,
        'aa': [
          'FRPLATE',
          'BCKPLATE'
        ],
        'dp': '65766527303700411c0242a6',
        'ma': 'Aramid',
        'mo': [
          {
            'i': [
              '654a4dea7c17dec2f50cc86a',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656f57dc27aed95beb08f628',
              '656f603f94b480b8a500c0d6',
              '656f611f94b480b8a500c0db',
              '656f63c027aed95beb08f62c',
              '656f664200d62bcd2e024077',
              '656f66b5c6baea13cd07e108',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            'n': 'front_plate'
          },
          {
            'i': [
              '654a4a964b446df1ad03f192',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656efaf54772930db4031ff5',
              '656efd66034e8e01c407f35c',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '657b22485f444d6dff0c6c2f',
              '657b2797c3dbcb01d60c35ea',
              '657b28d25f444d6dff0c6c77',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            'n': 'back_plate'
          }
        ],
        'ms': -0.01,
        'ca': 18,
        'c': 'vest',
        'ic': 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-icon.webp',
        'i': '5b44cad286f77402a54ae7e5',
        'im': 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-image.webp',
        'm': 'https://tarkov.dev/item/511-tactical-tactec-plate-carrier-ranger-green',
        'n': '5.11 Tactical TacTec plate carrier (Ranger Green)',
        's': 'TacTec',
        'w': 2.35,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/5.11_Tactical_TacTec_plate_carrier_(Ranger_Green)'
      },
      {
        armorClass: 5,
        armoredAreas: [
          'FRPLATE',
          'BCKPLATE'
        ],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0,
        capacity: 18,
        categoryId: ItemCategoryId.vest,
        conflictingItemIds: [],
        defaultPresetId: '65766527303700411c0242a6',
        durability: 0,
        ergonomicsModifierPercentage: 0,
        iconLink: 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-icon.webp',
        id: '5b44cad286f77402a54ae7e5',
        imageLink: 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-image.webp',
        marketLink: 'https://tarkov.dev/item/511-tactical-tactec-plate-carrier-ranger-green',
        material: 'Aramid',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '654a4dea7c17dec2f50cc86a',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656f57dc27aed95beb08f628',
              '656f603f94b480b8a500c0d6',
              '656f611f94b480b8a500c0db',
              '656f63c027aed95beb08f62c',
              '656f664200d62bcd2e024077',
              '656f66b5c6baea13cd07e108',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            maxStackableAmount: 1,
            name: 'front_plate',
            required: false
          },
          {
            compatibleItemIds: [
              '654a4a964b446df1ad03f192',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656efaf54772930db4031ff5',
              '656efd66034e8e01c407f35c',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '657b22485f444d6dff0c6c2f',
              '657b2797c3dbcb01d60c35ea',
              '657b28d25f444d6dff0c6c77',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            maxStackableAmount: 1,
            name: 'back_plate',
            required: false
          }
        ],
        movementSpeedModifierPercentage: -0.01,
        name: '5.11 Tactical TacTec plate carrier (Ranger Green)',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'TacTec',
        turningSpeedModifierPercentage: 0,
        weight: 2.35,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.11_Tactical_TacTec_plate_carrier_(Ranger_Green)'
      } as IVest
    ],
    [
      {
        'ac': 5,
        'aa': [
          'FRPLATE',
          'BCKPLATE'
        ],
        'bi': '5b44cad286f77402a54ae7e5',
        'ma': 'Aramid',
        'mo': [
          {
            'i': [
              '654a4dea7c17dec2f50cc86a',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656f57dc27aed95beb08f628',
              '656f603f94b480b8a500c0d6',
              '656f611f94b480b8a500c0db',
              '656f63c027aed95beb08f62c',
              '656f664200d62bcd2e024077',
              '656f66b5c6baea13cd07e108',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            'n': 'front_plate'
          },
          {
            'i': [
              '654a4a964b446df1ad03f192',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656efaf54772930db4031ff5',
              '656efd66034e8e01c407f35c',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '657b22485f444d6dff0c6c2f',
              '657b2797c3dbcb01d60c35ea',
              '657b28d25f444d6dff0c6c77',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            'n': 'back_plate'
          }
        ],
        'ms': -0.01,
        'ca': 18,
        'c': 'vest',
        'ic': 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-icon.webp',
        'i': '65766527303700411c0242a6',
        'im': 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-image.webp',
        'm': 'https://tarkov.dev/item/511-tactical-tactec-plate-carrier-ranger-green-default',
        'n': '5.11 Tactical TacTec plate carrier (Ranger Green) Default',
        's': 'TacTec Default',
        'w': 2.35,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/5.11_Tactical_TacTec_plate_carrier_(Ranger_Green)'
      },
      {
        armorClass: 5,
        armoredAreas: [
          'FRPLATE',
          'BCKPLATE'
        ],
        baseItemId: '5b44cad286f77402a54ae7e5',
        blindnessProtectionPercentage: 0,
        capacity: 18,
        categoryId: ItemCategoryId.vest,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsModifierPercentage: 0,
        iconLink: 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-icon.webp',
        id: '65766527303700411c0242a6',
        imageLink: 'https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-image.webp',
        marketLink: 'https://tarkov.dev/item/511-tactical-tactec-plate-carrier-ranger-green-default',
        material: 'Aramid',
        maxStackableAmount: 1,
        modSlots: [
          {
            compatibleItemIds: [
              '654a4dea7c17dec2f50cc86a',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656f57dc27aed95beb08f628',
              '656f603f94b480b8a500c0d6',
              '656f611f94b480b8a500c0db',
              '656f63c027aed95beb08f62c',
              '656f664200d62bcd2e024077',
              '656f66b5c6baea13cd07e108',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            maxStackableAmount: 1,
            name: 'front_plate',
            required: false
          },
          {
            compatibleItemIds: [
              '654a4a964b446df1ad03f192',
              '65573fa5655447403702a816',
              '655746010177119f4a097ff7',
              '656efaf54772930db4031ff5',
              '656efd66034e8e01c407f35c',
              '656f9d5900d62bcd2e02407c',
              '656f9fa0498d1b7e3e071d98',
              '656fa0fb498d1b7e3e071d9c',
              '656fa25e94b480b8a500c0e0',
              '656fa53d94b480b8a500c0e4',
              '656fa61e94b480b8a500c0e8',
              '656fa76500d62bcd2e024080',
              '656fa8d700d62bcd2e024084',
              '656fa99800d62bcd2e024088',
              '656fac30c6baea13cd07e10c',
              '656fad8c498d1b7e3e071da0',
              '656fae5f7c2d57afe200c0d7',
              '656faf0ca0dce000a2020f77',
              '656fafe3498d1b7e3e071da4',
              '656fb0bd7c2d57afe200c0dc',
              '656fb21fa0dce000a2020f7c',
              '657b22485f444d6dff0c6c2f',
              '657b2797c3dbcb01d60c35ea',
              '657b28d25f444d6dff0c6c77',
              '64afc71497cf3a403c01ff38',
              '64afdcb83efdfea28601d041'
            ],
            maxStackableAmount: 1,
            name: 'back_plate',
            required: false
          }
        ],
        movementSpeedModifierPercentage: -0.01,
        name: '5.11 Tactical TacTec plate carrier (Ranger Green) Default',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'TacTec Default',
        turningSpeedModifierPercentage: 0,
        weight: 2.35,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.11_Tactical_TacTec_plate_carrier_(Ranger_Green)'
      } as IVest as IVest
    ],
    [
      {
        'ca': 6,
        'c': 'vest',
        'ic': 'https://assets.tarkov.dev/572b7adb24597762ae139821-icon.webp',
        'i': '572b7adb24597762ae139821',
        'im': 'https://assets.tarkov.dev/572b7adb24597762ae139821-image.webp',
        'm': 'https://tarkov.dev/item/scav-vest',
        'n': 'Scav Vest',
        's': 'Scav Vest',
        'w': 0.4,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Scav_Vest'
      },
      {
        armorClass: 0,
        armoredAreas: [],
        baseItemId: undefined,
        blindnessProtectionPercentage: 0,
        capacity: 6,
        categoryId: ItemCategoryId.vest,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsModifierPercentage: 0,
        iconLink: 'https://assets.tarkov.dev/572b7adb24597762ae139821-icon.webp',
        id: '572b7adb24597762ae139821',
        imageLink: 'https://assets.tarkov.dev/572b7adb24597762ae139821-image.webp',
        marketLink: 'https://tarkov.dev/item/scav-vest',
        material: '',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedModifierPercentage: 0,
        name: 'Scav Vest',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'Scav Vest',
        turningSpeedModifierPercentage: 0,
        weight: 0.4,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Scav_Vest'
      } as IVest
    ]
  ])('should parse a reduced vest', (reducedVest: Record<string, unknown>, expected: IVest) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const vest = service.parseReducedItem(reducedVest)

    // Assert
    expect(vest).toStrictEqual(expected)
  })
})