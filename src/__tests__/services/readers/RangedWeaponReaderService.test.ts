import { IPrice } from '../../../models/utils/IPrice'
import { RangedWeaponReaderService } from '../../../services/readers/RangedWeaponReaderService'

describe('read() and readMarketData()', () => {
  it('should populate a ranged weapon properties from Tarkov data', async () => {
    // Arrange
    const service = new RangedWeaponReaderService()

    // Act
    const item = await service.read(tarkovData, 'mainWeapon')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.caliber).toBe('Caliber545x39')
    expect(item.ergonomics).toBe(40)
    expect(item.fireRate).toBe(650)
    expect(item.horizontalRecoil).toBe(455)
    expect(item.verticalRecoil).toBe(152)
    expect(item.modSlots).toEqual([
      {
        compatibleItemIds: [
          '5c0d5e4486f77478390952fe',
          '56dfef82d2720bbd668b4567',
          '56dff026d2720bb8668b4567',
          '56dff061d2720bb5668b4567',
          '56dff0bed2720bb0668b4567',
          '56dff216d2720bbd668b4568',
          '56dff2ced2720bb4668b4567',
          '56dff338d2720bbd668b4569',
          '56dff3afd2720bba668b4567',
          '56dff421d2720b5f5a8b4567',
          '56dff4a2d2720bbd668b456a',
          '56dff4ecd2720b5f5a8b4568'
        ],
        id: '57dc318524597759805c1581',
        maxStackableAmount: 1,
        name: 'chamber0',
        required: false
      },
      {
        compatibleItemIds: [
          '5f6341043ada5942720e2dc5',
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
          '5998517986f7746017232f7e'
        ],
        id: '57dc31bc245977596d4ef3d2',
        name: 'mod_pistol_grip',
        required: true
      },
      {
        compatibleItemIds: [
          '59ecc28286f7746d7a68aa8c',
          '5ab626e4d8ce87272e4c6e43',
          '57dc347d245977596754e7a1'
        ],
        id: '57dc31ce245977593d4e1453',
        name: 'mod_stock',
        required: false
      },
      {
        compatibleItemIds: [
          '5648ac824bdc2ded0b8b457d'
        ],
        id: '57dc31e1245977597164366e',
        name: 'mod_charge',
        required: false
      },
      {
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
        id: '57dc31f2245977596c274b4f',
        name: 'mod_magazine',
        required: false
      },
      {
        compatibleItemIds: [
          '5ac72e945acfc43f3b691116',
          '5ac7655e5acfc40016339a19',
          '5649aa744bdc2ded0b8b457e',
          '5f633f791b231926f2329f13',
          '5943eeeb86f77412d6384f6b',
          '5cc9a96cd7f00c011c04e04a',
          '5649ab884bdc2ded0b8b457f',
          '57dc324a24597759501edc20',
          '59bffc1f86f77435b128b872',
          '593d493f86f7745e6b2ceb22',
          '564caa3d4bdc2d17108b458e',
          '57ffb0e42459777d047111c5'
        ],
        id: '57dc35ce2459775971643671',
        name: 'mod_muzzle',
        required: false
      },
      {
        compatibleItemIds: [
          '57dc334d245977597164366f',
          '5839a7742459773cf9693481'
        ],
        id: '57dc35fb245977596d4ef3d7',
        name: 'mod_reciever',
        required: false
      },
      {
        compatibleItemIds: [
          '59d36a0086f7747e673f3946'
        ],
        id: '59d368ce86f7747e6a5beb03',
        name: 'mod_gas_block',
        required: true
      }
    ])

    expect(item.id).toBe('57dc2fa62459775949412633')
    expect(item.caption).toBe('AKS-74U 5.45x39 assault rifle')
    expect(item.categoryId).toBe('mainWeapon')
    expect(item.conflictingItemIds).toEqual([])
    expect(item.description).toBe('Reduced version of AKS-74 assault rifle, developed in the early 80s for combat vehicle crews and airborne troops, also became very popular with law enforcement and special forces for its compact size.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/57dc2fa62459775949412633-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/57dc2fa62459775949412633-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/aks-74u-545x39-assault-rifle')
    expect(item.maxStackableAmount).toBe(1)
    expect(item.name).toBe('weapon_izhmash_aks74u_545x39')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'prapor',
        merchantLevel: 1,
        requiresQuest: true,
        value: 28823,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 22761,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('AKS-74U')
    expect(item.weight).toBe(1.809)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/AKS-74U_5.45x39_assault_rifle')
  })
})

const marketData = {
  'id': '57dc2fa62459775949412633',
  'name': 'AKS-74U 5.45x39 assault rifle',
  'shortName': 'AKS-74U',
  'iconLink': 'https://assets.tarkov-tools.com/57dc2fa62459775949412633-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/AKS-74U_5.45x39_assault_rifle',
  'imageLink': 'https://assets.tarkov-tools.com/57dc2fa62459775949412633-image.jpg',
  'link': 'https://tarkov-tools.com/item/aks-74u-545x39-assault-rifle',
  'buyFor': [
    {
      'source': 'prapor',
      'price': 28823,
      'currency': 'RUB',
      'requirements': [
        { 'type': 'loyaltyLevel', 'value': 1 },
        { 'type': 'questCompleted', 'value': 1 }
      ]
    },
    {
      'source': 'fleaMarket',
      'price': 22761,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '57dc2fa62459775949412633',
  '_name': 'weapon_izhmash_aks74u_545x39',
  '_parent': '5447b5f14bdc2d61278b4567',
  '_type': 'Item',
  '_props': {
    'Name': 'AKS-74U 5.45x39 assault rifle',
    'ShortName': 'AKS-74U',
    'Description': 'Reduced version of AKS-74 assault rifle, developed in the early 80s for combat vehicle crews and airborne troops, also became very popular with law enforcement and special forces for its compact size.',
    'Weight': 1.809,
    'BackgroundColor': 'black',
    'Width': 3,
    'Height': 1,
    'StackMaxSize': 1,
    'Rarity': 'Rare',
    'SpawnChance': 15,
    'CreditsPrice': 13643,
    'ItemSound': 'weap_ar',
    'Prefab': {
      'path': 'assets/content/weapons/aks74u/weapon_izhmash_aks74u_545x39_container.bundle',
      'rcid': ''
    },
    'UsePrefab': {
      'path': '',
      'rcid': ''
    },
    'StackObjectsCount': 1,
    'NotShownInSlot': false,
    'ExaminedByDefault': true,
    'ExamineTime': 1,
    'IsUndiscardable': false,
    'IsUnsaleable': false,
    'IsUnbuyable': false,
    'IsUngivable': false,
    'IsLockedafterEquip': false,
    'QuestItem': false,
    'LootExperience': 20,
    'ExamineExperience': 4,
    'HideEntrails': false,
    'RepairCost': 70,
    'RepairSpeed': 4,
    'ExtraSizeLeft': 0,
    'ExtraSizeRight': 0,
    'ExtraSizeUp': 0,
    'ExtraSizeDown': 0,
    'ExtraSizeForceAdd': false,
    'MergesWithChildren': true,
    'CanSellOnRagfair': true,
    'CanRequireOnRagfair': true,
    'ConflictingItems': [],
    'FixedPrice': false,
    'Unlootable': false,
    'UnlootableFromSlot': 'FirstPrimaryWeapon',
    'UnlootableFromSide': [],
    'ChangePriceCoef': 1,
    'AllowSpawnOnLocations': [],
    'SendToClient': false,
    'AnimationVariantsNumber': 0,
    'DiscardingBlock': false,
    'RagFairCommissionModifier': 1,
    'Grids': [],
    'Slots': [
      {
        '_name': 'mod_pistol_grip',
        '_id': '57dc31bc245977596d4ef3d2',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '5f6341043ada5942720e2dc5',
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
                '5998517986f7746017232f7e'
              ]
            }
          ]
        },
        '_required': true,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      },
      {
        '_name': 'mod_stock',
        '_id': '57dc31ce245977593d4e1453',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '59ecc28286f7746d7a68aa8c',
                '5ab626e4d8ce87272e4c6e43',
                '57dc347d245977596754e7a1'
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      },
      {
        '_name': 'mod_charge',
        '_id': '57dc31e1245977597164366e',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '5648ac824bdc2ded0b8b457d'
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      },
      {
        '_name': 'mod_magazine',
        '_id': '57dc31f2245977596c274b4f',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'AnimationIndex': -1,
              'Filter': [
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
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c394bdc2dae468b4577'
      },
      {
        '_name': 'mod_muzzle',
        '_id': '57dc35ce2459775971643671',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '5ac72e945acfc43f3b691116',
                '5ac7655e5acfc40016339a19',
                '5649aa744bdc2ded0b8b457e',
                '5f633f791b231926f2329f13',
                '5943eeeb86f77412d6384f6b',
                '5cc9a96cd7f00c011c04e04a',
                '5649ab884bdc2ded0b8b457f',
                '57dc324a24597759501edc20',
                '59bffc1f86f77435b128b872',
                '593d493f86f7745e6b2ceb22',
                '564caa3d4bdc2d17108b458e',
                '57ffb0e42459777d047111c5'
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      },
      {
        '_name': 'mod_reciever',
        '_id': '57dc35fb245977596d4ef3d7',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '57dc334d245977597164366f',
                '5839a7742459773cf9693481'
              ]
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      },
      {
        '_name': 'mod_gas_block',
        '_id': '59d368ce86f7747e6a5beb03',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Shift': 0,
              'Filter': [
                '59d36a0086f7747e673f3946'
              ]
            }
          ]
        },
        '_required': true,
        '_mergeSlotWithChildren': false,
        '_proto': '55d30c4c4bdc2db4468b457e'
      }
    ],
    'CanPutIntoDuringTheRaid': true,
    'CantRemoveFromSlotsDuringRaid': [],
    'weapClass': 'assaultRifle',
    'weapUseType': 'primary',
    'ammoCaliber': 'Caliber545x39',
    'Durability': 95,
    'MaxDurability': 100,
    'OperatingResource': 4000,
    'RepairComplexity': 0,
    'durabSpawnMin': 25,
    'durabSpawnMax': 75,
    'isFastReload': true,
    'RecoilForceUp': 152,
    'RecoilForceBack': 455,
    'Convergence': 1,
    'RecoilAngle': 90,
    'weapFireType': [
      'single',
      'fullauto'
    ],
    'RecolDispersion': 35,
    'bFirerate': 650,
    'Ergonomics': 40,
    'Velocity': -17.9,
    'bEffDist': 300,
    'bHearDist': 80,
    'isChamberLoad': true,
    'chamberAmmoCount': 1,
    'isBoltCatch': false,
    'defMagType': '55d480c04bdc2d1d4e8b456a',
    'defAmmo': '56dff3afd2720bba668b4567',
    'shotgunDispersion': 0,
    'Chambers': [
      {
        '_name': 'patron_in_weapon',
        '_id': '57dc318524597759805c1581',
        '_parent': '57dc2fa62459775949412633',
        '_props': {
          'filters': [
            {
              'Filter': [
                '5c0d5e4486f77478390952fe',
                '56dfef82d2720bbd668b4567',
                '56dff026d2720bb8668b4567',
                '56dff061d2720bb5668b4567',
                '56dff0bed2720bb0668b4567',
                '56dff216d2720bbd668b4568',
                '56dff2ced2720bb4668b4567',
                '56dff338d2720bbd668b4569',
                '56dff3afd2720bba668b4567',
                '56dff421d2720b5f5a8b4567',
                '56dff4a2d2720bbd668b456a',
                '56dff4ecd2720b5f5a8b4568'
              ],
              'MaxStackCount': 0
            }
          ]
        },
        '_required': false,
        '_mergeSlotWithChildren': false,
        '_proto': '55d4af244bdc2d962f8b4571'
      }
    ],
    'CameraRecoil': 0.165,
    'CameraSnap': 3.5,
    'ReloadMode': 'ExternalMagazine',
    'CenterOfImpact': 0.1,
    'AimPlane': 0.15,
    'DeviationCurve': 1,
    'DeviationMax': 100,
    'Foldable': true,
    'Retractable': false,
    'TacticalReloadStiffnes': {
      'x': 0.95,
      'y': 0.33,
      'z': 0.95
    },
    'TacticalReloadFixation': 0.95,
    'RecoilCenter': {
      'x': 0,
      'y': -0.25,
      'z': 0
    },
    'RotationCenter': {
      'x': 0,
      'y': -0.1,
      'z': -0.03
    },
    'RotationCenterNoStock': {
      'x': 0,
      'y': -0.27,
      'z': -0.08
    },
    'SizeReduceRight': 0,
    'FoldedSlot': 'mod_stock',
    'CompactHandling': true,
    'SightingRange': 100,
    'MinRepairDegradation': 0,
    'MaxRepairDegradation': 0.01,
    'IronSightRange': 100,
    'MustBoltBeOpennedForExternalReload': false,
    'MustBoltBeOpennedForInternalReload': false,
    'BoltAction': false,
    'HipAccuracyRestorationDelay': 0.2,
    'HipAccuracyRestorationSpeed': 7,
    'HipInnaccuracyGain': 0.16,
    'ManualBoltCatch': false,
    'AimSensitivity': 0.65,
    'BurstShotsCount': 3
  },
  '_proto': '5644bd2b4bdc2d3b4c8b4572'
}