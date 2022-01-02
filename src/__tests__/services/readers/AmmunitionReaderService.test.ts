import { IPrice } from '../../../models/utils/IPrice'
import { AmmunitionReaderService } from '../../../services/readers/AmmunitionReaderService'

describe('read() and readMarketData()', () => {
  it('should populate ammunition properties from Tarkov data', async () => {
    // Arrange
    const service = new AmmunitionReaderService()

    // Act
    const item = await service.read(tarkovData, 'ammunition')
    await service.readMarketData(marketData, item)

    // Assert
    expect(item.accuracyPercentageModifier).toBe(-15)
    expect(item.armorDamagePercentage).toBe(26)
    expect(item.armorPenetrations).toStrictEqual([3, 3, 3, 3, 3, 3])
    expect(item.blinding).toBe(false)
    expect(item.caliber).toBe('Caliber12g')
    expect(item.durabilityBurnPercentageModifier).toBe(35)
    expect(item.fleshDamage).toBe(50)
    expect(item.fragmentationChancePercentage).toBe(0)
    expect(item.heavyBleedingPercentageChance).toBe(10)
    expect(item.lightBleedingPercentageChance).toBe(20)
    expect(item.penetrationPower).toBe(2)
    expect(item.projectiles).toBe(8)
    expect(item.recoilPercentageModifier).toBe(115)
    expect(item.subsonic).toBe(false)
    expect(item.tracer).toBe(false)
    expect(item.velocity).toBe(385)

    expect(item.id).toBe('5d6e6806a4b936088465b17e')
    expect(item.caption).toBe('12/70 8.5mm "Magnum" Buckshot')
    expect(item.categoryId).toBe('ammunition')
    expect(item.conflictingItemIds).toStrictEqual([])
    expect(item.description).toBe('12/70 shell loaded with 16 8.5mm buckshot for 12ga shotguns.')
    expect(item.iconLink).toBe('https://assets.tarkov-tools.com/5d6e6806a4b936088465b17e-icon.jpg')
    expect(item.imageLink).toBe('https://assets.tarkov-tools.com/5d6e6806a4b936088465b17e-image.jpg')
    expect(item.marketLink).toBe('https://tarkov-tools.com/item/1270-85mm-magnum-buckshot')
    expect(item.maxStackableAmount).toBe(20)
    expect(item.name).toBe('patron_12x70_buckshot_85')
    expect(item.prices).toStrictEqual([
      {
        currencyName: 'RUB',
        merchant: 'jaeger',
        merchantLevel: 2,
        requiresQuest: false,
        value: 53,
        valueInMainCurrency: 0
      },
      {
        currencyName: 'RUB',
        merchant: 'fleaMarket',
        merchantLevel: undefined,
        requiresQuest: false,
        value: 302,
        valueInMainCurrency: 0
      }
    ] as IPrice[])
    expect(item.shortName).toBe('Magnum')
    expect(item.weight).toBe(0.059)
    expect(item.wikiLink).toBe('https://escapefromtarkov.fandom.com/wiki/12/70_8.5mm_%22Magnum%22_Buckshot')
  })

  it('should populate armor penetrations with an empty array when the item armor penetrations are not found', async () => {
    // Arrange
    const service = new AmmunitionReaderService()

    // Act
    const item = await service.read({ '_id': 'invalid', '_props': {} }, 'ammunition')

    // Assert
    expect(item.armorPenetrations).toStrictEqual([])
  })
})

const marketData = {
  'id': '5d6e6806a4b936088465b17e',
  'name': '12/70 8.5mm "Magnum" Buckshot',
  'shortName': 'Magnum',
  'iconLink': 'https://assets.tarkov-tools.com/5d6e6806a4b936088465b17e-icon.jpg',
  'wikiLink': 'https://escapefromtarkov.fandom.com/wiki/12/70_8.5mm_%22Magnum%22_Buckshot',
  'imageLink': 'https://assets.tarkov-tools.com/5d6e6806a4b936088465b17e-image.jpg',
  'link': 'https://tarkov-tools.com/item/1270-85mm-magnum-buckshot',
  'buyFor': [
    {
      'source': 'jaeger',
      'price': 53,
      'currency': 'RUB',
      'requirements': [{ 'type': 'loyaltyLevel', 'value': 2 }]
    },
    {
      'source': 'fleaMarket',
      'price': 302,
      'currency': 'RUB',
      'requirements': [{ 'type': 'playerLevel', 'value': 20 }]
    }
  ]
}

const tarkovData = {
  '_id': '5d6e6806a4b936088465b17e',
  '_name': 'patron_12x70_buckshot_85',
  '_parent': '5485a8684bdc2da71d8b4567',
  '_type': 'Item',
  '_props': {
    'Name': '12/70 8.5 mm "Magnum" Buckshot',
    'ShortName': '8.5 12c',
    'Description': '12/70 shell loaded with 16 8.5mm buckshot for 12ga shotguns.',
    'Weight': 0.059,
    'BackgroundColor': 'yellow',
    'Width': 1,
    'Height': 1,
    'StackMaxSize': 20,
    'Rarity': 'Rare',
    'SpawnChance': 5,
    'CreditsPrice': 50,
    'ItemSound': 'ammo_shotgun',
    'Prefab': {
      'path': 'assets/content/items/ammo/patrons/patron_12x70.bundle',
      'rcid': ''
    },
    'UsePrefab': {
      'path': '',
      'rcid': ''
    },
    'StackObjectsCount': 1,
    'NotShownInSlot': false,
    'ExaminedByDefault': false,
    'ExamineTime': 1,
    'IsUndiscardable': false,
    'IsUnsaleable': false,
    'IsUnbuyable': false,
    'IsUngivable': false,
    'IsLockedafterEquip': false,
    'QuestItem': false,
    'LootExperience': 0,
    'ExamineExperience': 10,
    'HideEntrails': false,
    'RepairCost': 0,
    'RepairSpeed': 0,
    'ExtraSizeLeft': 0,
    'ExtraSizeRight': 0,
    'ExtraSizeUp': 0,
    'ExtraSizeDown': 0,
    'ExtraSizeForceAdd': false,
    'MergesWithChildren': false,
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
    'StackMinRandom': 3,
    'StackMaxRandom': 10,
    'ammoType': 'buckshot',
    'Damage': 50,
    'ammoAccr': -15,
    'ammoRec': 115,
    'ammoDist': 0,
    'buckshotBullets': 8,
    'PenetrationPower': 2,
    'PenetrationPowerDiviation': 1,
    'ammoHear': 0,
    'ammoSfx': 'standart',
    'MisfireChance': 0.01,
    'MinFragmentsCount': 1,
    'MaxFragmentsCount': 1,
    'ammoShiftChance': 0,
    'casingName': '12/70 8.5 mm "Magnum" Buckshot',
    'casingEjectPower': 0,
    'casingMass': 0,
    'casingSounds': 'shotgun_big',
    'ProjectileCount': 8,
    'InitialSpeed': 385,
    'PenetrationChance': 0.05,
    'RicochetChance': 0,
    'FragmentationChance': 0,
    'BallisticCoeficient': 1,
    'Deterioration': 1,
    'SpeedRetardation': 0.00013,
    'Tracer': false,
    'TracerColor': 'red',
    'TracerDistance': 0,
    'ArmorDamage': 26,
    'Caliber': 'Caliber12g',
    'StaminaBurnPerDamage': 0.45,
    'HeavyBleedingDelta': 0.1,
    'LightBleedingDelta': 0.2,
    'ShowBullet': false,
    'HasGrenaderComponent': false,
    'FuzeArmTimeSec': 0,
    'ExplosionStrength': 0,
    'MinExplosionDistance': 0,
    'MaxExplosionDistance': 0,
    'FragmentsCount': 0,
    'FragmentType': '5996f6d686f77467977ba6cc',
    'ShowHitEffectOnExplode': false,
    'ExplosionType': '',
    'AmmoLifeTimeSec': 5,
    'Contusion': {
      'x': 0,
      'y': 0,
      'z': 0
    },
    'ArmorDistanceDistanceDamage': {
      'x': 0,
      'y': 0,
      'z': 0
    },
    'Blindness': {
      'x': 0,
      'y': 0,
      'z': 0
    },
    'IsLightAndSoundShot': false,
    'LightAndSoundShotAngle': 0,
    'LightAndSoundShotSelfContusionTime': 0,
    'LightAndSoundShotSelfContusionStrength': 0,
    'DurabilityBurnModificator': 1.35
  },
  '_proto': '560d5e524bdc2d25448b4571'
}