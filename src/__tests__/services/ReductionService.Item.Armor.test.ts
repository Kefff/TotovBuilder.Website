import { describe, expect, it } from 'vitest'
import { IArmor } from '../../models/item/IArmor'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'c': 'armor',
        'ic': 'https://assets.tarkov.dev/unknown-icon.jpg',
        'i': 'unknown',
        'im': 'https://assets.tarkov.dev/unknown-image.jpg',
        'm': 'https://tarkov.dev/item/unknown',
        'n': 'Unknown',
        's': 'Unknown',
        'w': 0.2,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Unknown'
      },
      {
        armorClass: 0,
        armoredAreas: [],
        baseItemId: undefined,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsModifierPercentage: 0,
        material: '',
        categoryId: 'armor',
        iconLink: 'https://assets.tarkov.dev/unknown-icon.jpg',
        id: 'unknown',
        imageLink: 'https://assets.tarkov.dev/unknown-image.jpg',
        marketLink: 'https://tarkov.dev/item/unknown',
        maxStackableAmount: 1,
        modSlots: [],
        movementSpeedModifierPercentage: 0,
        name: 'Unknown',
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: 'Unknown',
        turningSpeedModifierPercentage: 0,
        weight: 0.2,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Unknown'
      } as IArmor
    ],
    [
      {
        'ac': 6,
        'aa': [
          'FRPLATE',
          'BCKPLATE',
          'LPLATE',
          'RPLATE',
          'Stomach',
          'Chest',
          'ThoraxUpperBack',
          'StomachLowerBack',
          'StomachLeftSide',
          'StomachRightSide',
          'HeadThroat',
          'HeadNeck',
          'LeftArmShoulder',
          'RightArmShoulder',
          'StomachGroin'
        ],
        'dp': '65766adc234b9f6e050a431a',
        'e': -0.1,
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
          },
          {
            'i': [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            'n': 'left_side_plate'
          },
          {
            'i': [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            'n': 'right_side_plate'
          }
        ],
        'ms': -0.115,
        't': -0.055,
        'c': 'armor',
        'ic': 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.webp',
        'i': '545cdb794bdc2d3a198b456a',
        'im': 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-image.webp',
        'm': 'https://tarkov.dev/item/6b43-zabralo-sh-body-armor-digital-flora',
        'n': '6B43 Zabralo-Sh body armor (Digital Flora)',
        's': '6B43',
        'w': 10.8,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/6B43_Zabralo-Sh_body_armor_(Digital_Flora)'
      },
      {
        armorClass: 6,
        armoredAreas: [
          'FRPLATE',
          'BCKPLATE',
          'LPLATE',
          'RPLATE',
          'Stomach',
          'Chest',
          'ThoraxUpperBack',
          'StomachLowerBack',
          'StomachLeftSide',
          'StomachRightSide',
          'HeadThroat',
          'HeadNeck',
          'LeftArmShoulder',
          'RightArmShoulder',
          'StomachGroin'
        ],
        categoryId: 'armor',
        baseItemId: undefined,
        conflictingItemIds: [],
        defaultPresetId: '65766adc234b9f6e050a431a',
        durability: 0,
        ergonomicsModifierPercentage: -0.1,
        iconLink: 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.webp',
        id: '545cdb794bdc2d3a198b456a',
        imageLink: 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-image.webp',
        marketLink: 'https://tarkov.dev/item/6b43-zabralo-sh-body-armor-digital-flora',
        material: 'Aramid',
        maxStackableAmount: 1,
        movementSpeedModifierPercentage: -0.115,
        name: '6B43 Zabralo-Sh body armor (Digital Flora)',
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
          },
          {
            compatibleItemIds: [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            maxStackableAmount: 1,
            name: 'left_side_plate',
            required: false
          },
          {
            compatibleItemIds: [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            maxStackableAmount: 1,
            name: 'right_side_plate',
            required: false
          }
        ],
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: '6B43',
        turningSpeedModifierPercentage: -0.055,
        weight: 10.8,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B43_Zabralo-Sh_body_armor_(Digital_Flora)'
      } as IArmor
    ],
    [
      {
        'ac': 6,
        'aa': [
          'FRPLATE',
          'BCKPLATE',
          'LPLATE',
          'RPLATE',
          'Stomach',
          'Chest',
          'ThoraxUpperBack',
          'StomachLowerBack',
          'StomachLeftSide',
          'StomachRightSide',
          'HeadThroat',
          'HeadNeck',
          'LeftArmShoulder',
          'RightArmShoulder',
          'StomachGroin'
        ],
        'bi': '545cdb794bdc2d3a198b456a',
        'e': -0.1,
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
          },
          {
            'i': [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            'n': 'left_side_plate'
          },
          {
            'i': [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            'n': 'right_side_plate'
          }
        ],
        'ms': -0.115,
        't': -0.055,
        'c': 'armor',
        'ic': 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.webp',
        'i': '65766adc234b9f6e050a431a',
        'im': 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-image.webp',
        'm': 'https://tarkov.dev/item/6b43-zabralo-sh-body-armor-digital-flora-default',
        'n': '6B43 Zabralo-Sh body armor (Digital Flora) Default',
        's': '6B43 Default',
        'w': 10.8,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/6B43_Zabralo-Sh_body_armor_(Digital_Flora)'
      },
      {
        armorClass: 6,
        armoredAreas: [
          'FRPLATE',
          'BCKPLATE',
          'LPLATE',
          'RPLATE',
          'Stomach',
          'Chest',
          'ThoraxUpperBack',
          'StomachLowerBack',
          'StomachLeftSide',
          'StomachRightSide',
          'HeadThroat',
          'HeadNeck',
          'LeftArmShoulder',
          'RightArmShoulder',
          'StomachGroin'
        ],
        categoryId: 'armor',
        baseItemId: '545cdb794bdc2d3a198b456a',
        conflictingItemIds: [],
        defaultPresetId: undefined,
        durability: 0,
        ergonomicsModifierPercentage: -0.1,
        iconLink: 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.webp',
        id: '65766adc234b9f6e050a431a',
        imageLink: 'https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-image.webp',
        marketLink: 'https://tarkov.dev/item/6b43-zabralo-sh-body-armor-digital-flora-default',
        material: 'Aramid',
        maxStackableAmount: 1,
        movementSpeedModifierPercentage: -0.115,
        name: '6B43 Zabralo-Sh body armor (Digital Flora) Default',
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
          },
          {
            compatibleItemIds: [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            maxStackableAmount: 1,
            name: 'left_side_plate',
            required: false
          },
          {
            compatibleItemIds: [
              '654a4f8bc721968a4404ef18',
              '6557458f83942d705f0c4962',
              '64afdb577bb3bfe8fe03fd1d',
              '64afd81707e2cf40e903a316'
            ],
            maxStackableAmount: 1,
            name: 'right_side_plate',
            required: false
          }
        ],
        presetArmorModifiers: undefined,
        presetWearableModifiers: undefined,
        prices: [],
        shortName: '6B43 Default',
        turningSpeedModifierPercentage: -0.055,
        weight: 10.8,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B43_Zabralo-Sh_body_armor_(Digital_Flora)'
      } as IArmor
    ]
  ])('should parse a reduced armor', (reducedArmor: Record<string, unknown>, expected: IArmor) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const armor = service.parseReducedItem(reducedArmor)

    // Assert
    expect(armor).toStrictEqual(expected)
  })
})