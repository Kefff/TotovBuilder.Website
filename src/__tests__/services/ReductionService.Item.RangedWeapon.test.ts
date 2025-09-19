import { describe, expect, it } from 'vitest'
import { ItemCategoryId } from '../../models/item/IItem'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ReductionService } from '../../services/ReductionService'
import Services from '../../services/repository/Services'

describe('parseReducedItem', () => {
  it.each([
    [
      {
        'bi': '57dc2fa62459775949412633',
        'ca': 'Caliber545x39',
        'dp': '584147732459775a2b6d9f12',
        'e': 44,
        'fm': [
          'Single fire',
          'Full auto'
        ],
        'r': 650,
        'h': 445,
        'ma': 3.44,
        'v': 141,
        'c': 'mainWeapon',
        'ic': 'https://assets.tarkov.dev/584147732459775a2b6d9f12-icon.webp',
        'i': '584147732459775a2b6d9f12',
        'im': 'https://assets.tarkov.dev/584147732459775a2b6d9f12-image.webp',
        'm': 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle-default',
        'n': 'Kalashnikov AKS-74U 5.45x39 assault rifle Default',
        's': 'AKS-74U Default',
        'w': 2.694,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
      },
      {
        baseItemId: '57dc2fa62459775949412633',
        caliber: 'Caliber545x39',
        categoryId: ItemCategoryId.mainWeapon,
        conflictingItemIds: [],
        defaultPresetId: '584147732459775a2b6d9f12',
        ergonomics: 44,
        fireModes: ['Single fire', 'Full auto'],
        fireRate: 650,
        horizontalRecoil: 445,
        iconLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-icon.webp',
        id: '584147732459775a2b6d9f12',
        imageLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-image.webp',
        marketLink: 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle-default',
        maxStackableAmount: 1,
        modSlots: [],
        name: 'Kalashnikov AKS-74U 5.45x39 assault rifle Default',
        minuteOfAngle: 3.44,
        presetRangedWeaponModifiers: undefined,
        presetWeight: undefined,
        prices: [],
        shortName: 'AKS-74U Default',
        verticalRecoil: 141,
        weight: 2.694,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
      } as IRangedWeapon
    ],
    [
      {
        'ca': 'Caliber545x39',
        'dp': '584147732459775a2b6d9f12',
        'e': 44,
        'fm': [
          'Single fire',
          'Full auto'
        ],
        'r': 650,
        'h': 445,
        'mo': [
          {
            'c': 'Pistol Grip',
            'i': [
              '5f6341043ada5942720e2dc5',
              '6087e663132d4d12c81fd96b',
              '5beec8ea0db834001a6f9dbf',
              '5649ad3f4bdc2df8348b4585',
              '5649ade84bdc2d1b2b8b4587',
              '59e62cc886f77440d40b52a1',
              '5a0071d486f77404e23a12b2',
              '57e3dba62459770f0c32322b',
              '5cf54404d7f00c108840b2ef',
              '5e2192a498a36665e8337386',
              '5b30ac585acfc433000eb79c',
              '59e6318286f77444dd62c4cc',
              '5cf50850d7f00c056e24104c',
              '5cf508bfd7f00c056e24104e',
              '5947f92f86f77427344a76b1',
              '5947fa2486f77425b47c1a9b',
              '5c6bf4aa2e2216001219b0ae',
              '5649ae4a4bdc2d1b2b8b4588',
              '5998517986f7746017232f7e',
              '623c3be0484b5003161840dc',
              '628c9ab845c59e5b80768a81',
              '628a664bccaab13006640e47'
            ],
            'n': 'mod_pistol_grip'
          },
          {
            'c': 'Stock',
            'i': [
              '59ecc28286f7746d7a68aa8c',
              '5ab626e4d8ce87272e4c6e43',
              '57dc347d245977596754e7a1'
            ],
            'n': 'mod_stock'
          },
          {
            'c': 'Ch. Handle',
            'i': [
              '6130ca3fd92c473c77020dbd',
              '5648ac824bdc2ded0b8b457d'
            ],
            'n': 'mod_charge'
          },
          {
            'c': 'Magazine',
            'i': [
              '564ca9df4bdc2d35148b4569',
              '564ca99c4bdc2d16268b4589',
              '55d480c04bdc2d1d4e8b456a',
              '5cbdaf89ae9215000e5b9c94',
              '55d481904bdc2d8c2f8b456a',
              '55d482194bdc2d1d4e8b456b',
              '55d4837c4bdc2d1d4e8b456c',
              '5aaa4194e5b5b055d06310a5',
              '5bed61680db834001d2c45ab',
              '5bed625c0db834001c062946'
            ],
            'n': 'mod_magazine'
          },
          {
            'c': 'Muzzle',
            'i': [
              '5ac72e945acfc43f3b691116',
              '5ac7655e5acfc40016339a19',
              '5649aa744bdc2ded0b8b457e',
              '5f633f791b231926f2329f13',
              '5943eeeb86f77412d6384f6b',
              '5cc9a96cd7f00c011c04e04a',
              '615d8f5dd92c473c770212ef',
              '5649ab884bdc2ded0b8b457f',
              '57dc324a24597759501edc20',
              '59bffc1f86f77435b128b872',
              '593d493f86f7745e6b2ceb22',
              '564caa3d4bdc2d17108b458e',
              '57ffb0e42459777d047111c5'
            ],
            'n': 'mod_muzzle'
          },
          {
            'c': 'Receiver',
            'i': [
              '57dc334d245977597164366f',
              '5839a7742459773cf9693481'
            ],
            'n': 'mod_reciever'
          },
          {
            'c': 'Gas Block',
            'i': [
              '59d36a0086f7747e673f3946'
            ],
            'n': 'mod_gas_block'
          }
        ],
        'v': 141,
        'c': 'mainWeapon',
        'ic': 'https://assets.tarkov.dev/57dc2fa62459775949412633-icon.jpg',
        'i': '57dc2fa62459775949412633',
        'im': 'https://assets.tarkov.dev/57dc2fa62459775949412633-image.jpg',
        'm': 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle',
        'n': 'Kalashnikov AKS-74U 5.45x39 assault rifle',
        's': 'AKS-74U',
        'w': 1.809,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
      },
      {
        baseItemId: undefined,
        caliber: 'Caliber545x39',
        categoryId: ItemCategoryId.mainWeapon,
        conflictingItemIds: [],
        defaultPresetId: '584147732459775a2b6d9f12',
        ergonomics: 44,
        fireModes: ['Single fire', 'Full auto'],
        fireRate: 650,
        horizontalRecoil: 445,
        iconLink: 'https://assets.tarkov.dev/57dc2fa62459775949412633-icon.jpg',
        id: '57dc2fa62459775949412633',
        imageLink: 'https://assets.tarkov.dev/57dc2fa62459775949412633-image.jpg',
        marketLink: 'https://tarkov.dev/item/kalashnikov-aks-74u-545x39-assault-rifle',
        maxStackableAmount: 1,
        minuteOfAngle: undefined,
        modSlots: [
          {
            caption: 'Pistol Grip',
            compatibleItemIds: [
              '5f6341043ada5942720e2dc5',
              '6087e663132d4d12c81fd96b',
              '5beec8ea0db834001a6f9dbf',
              '5649ad3f4bdc2df8348b4585',
              '5649ade84bdc2d1b2b8b4587',
              '59e62cc886f77440d40b52a1',
              '5a0071d486f77404e23a12b2',
              '57e3dba62459770f0c32322b',
              '5cf54404d7f00c108840b2ef',
              '5e2192a498a36665e8337386',
              '5b30ac585acfc433000eb79c',
              '59e6318286f77444dd62c4cc',
              '5cf50850d7f00c056e24104c',
              '5cf508bfd7f00c056e24104e',
              '5947f92f86f77427344a76b1',
              '5947fa2486f77425b47c1a9b',
              '5c6bf4aa2e2216001219b0ae',
              '5649ae4a4bdc2d1b2b8b4588',
              '5998517986f7746017232f7e',
              '623c3be0484b5003161840dc',
              '628c9ab845c59e5b80768a81',
              '628a664bccaab13006640e47'
            ],
            maxStackableAmount: 1,
            name: 'mod_pistol_grip',
            required: false
          },
          {
            caption: 'Stock',
            compatibleItemIds: [
              '59ecc28286f7746d7a68aa8c',
              '5ab626e4d8ce87272e4c6e43',
              '57dc347d245977596754e7a1'
            ],
            maxStackableAmount: 1,
            name: 'mod_stock',
            required: false
          },
          {
            caption: 'Ch. Handle',
            compatibleItemIds: [
              '6130ca3fd92c473c77020dbd',
              '5648ac824bdc2ded0b8b457d'
            ],
            maxStackableAmount: 1,
            name: 'mod_charge',
            required: false
          },
          {
            caption: 'Magazine',
            compatibleItemIds: [
              '564ca9df4bdc2d35148b4569',
              '564ca99c4bdc2d16268b4589',
              '55d480c04bdc2d1d4e8b456a',
              '5cbdaf89ae9215000e5b9c94',
              '55d481904bdc2d8c2f8b456a',
              '55d482194bdc2d1d4e8b456b',
              '55d4837c4bdc2d1d4e8b456c',
              '5aaa4194e5b5b055d06310a5',
              '5bed61680db834001d2c45ab',
              '5bed625c0db834001c062946'
            ],
            maxStackableAmount: 1,
            name: 'mod_magazine',
            required: false
          },
          {
            caption: 'Muzzle',
            compatibleItemIds: [
              '5ac72e945acfc43f3b691116',
              '5ac7655e5acfc40016339a19',
              '5649aa744bdc2ded0b8b457e',
              '5f633f791b231926f2329f13',
              '5943eeeb86f77412d6384f6b',
              '5cc9a96cd7f00c011c04e04a',
              '615d8f5dd92c473c770212ef',
              '5649ab884bdc2ded0b8b457f',
              '57dc324a24597759501edc20',
              '59bffc1f86f77435b128b872',
              '593d493f86f7745e6b2ceb22',
              '564caa3d4bdc2d17108b458e',
              '57ffb0e42459777d047111c5'
            ],
            maxStackableAmount: 1,
            name: 'mod_muzzle',
            required: false
          },
          {
            caption: 'Receiver',
            compatibleItemIds: [
              '57dc334d245977597164366f',
              '5839a7742459773cf9693481'
            ],
            maxStackableAmount: 1,
            name: 'mod_reciever',
            required: false
          },
          {
            caption: 'Gas Block',
            compatibleItemIds: [
              '59d36a0086f7747e673f3946'
            ],
            maxStackableAmount: 1,
            name: 'mod_gas_block',
            required: false
          }
        ],
        name: 'Kalashnikov AKS-74U 5.45x39 assault rifle',
        presetRangedWeaponModifiers: undefined,
        presetWeight: undefined,
        prices: [],
        shortName: 'AKS-74U',
        verticalRecoil: 141,
        weight: 1.809,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kalashnikov_AKS-74U_5.45x39_assault_rifle'
      } as IRangedWeapon
    ],
    [
      {
        'ca': 'Caliber26x75',
        'e': 51,
        'r': 30,
        'h': 400,
        'v': 200,
        'c': 'mainWeapon',
        'ic': 'https://assets.tarkov.dev/624c0b3340357b5f566e8766-icon.jpg',
        'i': '624c0b3340357b5f566e8766',
        'im': 'https://assets.tarkov.dev/624c0b3340357b5f566e8766-image.jpg',
        'm': 'https://tarkov.dev/item/rsp-30-reactive-signal-cartridge-yellow',
        'n': 'RSP-30 reactive signal cartridge (Yellow)',
        's': 'Yellow',
        'w': 0.6,
        'wi': 'https://escapefromtarkov.fandom.com/wiki/RSP-30_reactive_signal_cartridge_(Yellow)'
      },
      {
        baseItemId: undefined,
        caliber: 'Caliber26x75',
        categoryId: ItemCategoryId.mainWeapon,
        conflictingItemIds: [],
        defaultPresetId: undefined,
        ergonomics: 51,
        fireModes: [],
        fireRate: 30,
        horizontalRecoil: 400,
        iconLink: 'https://assets.tarkov.dev/624c0b3340357b5f566e8766-icon.jpg',
        id: '624c0b3340357b5f566e8766',
        imageLink: 'https://assets.tarkov.dev/624c0b3340357b5f566e8766-image.jpg',
        marketLink: 'https://tarkov.dev/item/rsp-30-reactive-signal-cartridge-yellow',
        maxStackableAmount: 1,
        minuteOfAngle: undefined,
        modSlots: [],
        name: 'RSP-30 reactive signal cartridge (Yellow)',
        presetRangedWeaponModifiers: undefined,
        presetWeight: undefined,
        prices: [],
        shortName: 'Yellow',
        verticalRecoil: 200,
        weight: 0.6,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RSP-30_reactive_signal_cartridge_(Yellow)'
      } as IRangedWeapon
    ]
  ])('should parse a reduced ranged weapon', (reducedRangedWeapon: Record<string, unknown>, expected: IRangedWeapon) => {
    // Arrange
    Services.configure(ItemPropertiesService)

    const service = new ReductionService()

    // Act
    const rangedWeapon = service.parseReducedItem(reducedRangedWeapon)

    // Assert
    expect(rangedWeapon).toStrictEqual(expected)
  })
})