import { IAmmunition } from '../../models/item/IAmmunition'
import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IBackpack } from '../../models/item/IBackpack'
import { IContainer } from '../../models/item/IContainer'
import { IEyewear } from '../../models/item/IEyewear'
import { IGrenade } from '../../models/item/IGrenade'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import { IMod } from '../../models/item/IMod'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IVest } from '../../models/item/IVest'

export const ak12bt: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/649ec87d8007560a9001ab36-icon.webp',
  id: '649ec87d8007560a9001ab36',
  imageLink: 'https://assets.tarkov.dev/649ec87d8007560a9001ab36-image.webp',
  marketLink: 'https://tarkov.dev/item/ak-12-buffer-tube',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '602e620f9b513876d4338d9a',
        '5a9eb32da2750c00171b3f9c',
        '5bfe86df0db834001b734685',
        '55d4ae6c4bdc2d8b2f8b456e',
        '5c87a07c2e2216001219d4a2',
        '5bb20e70d4351e0035629f8f',
        '5beec8c20db834001d2c465c',
        '5ae30c9a5acfc408fb139a03',
        '5d135e83d7ad1a21b83f42d8',
        '5d135ecbd7ad1a21c176542e',
        '56eabf3bd2720b75698b4569',
        '58d2946386f774496974c37e',
        '58d2946c86f7744e271174b5',
        '58d2947686f774485c6a1ee5',
        '58d2947e86f77447aa070d53',
        '5947c73886f7747701588af5',
        '5c793fde2e221601da358614',
        '5b39f8db5acfc40016387a1b',
        '5fbbaa86f9986c4cff3fe5f6',
        '5fce16961f152d4312622bc9',
        '5fc2369685fd526b824a5713',
        '606587d11246154cad35d635',
        '628a85ee6b1d481ff772e9d5',
        '5d44069ca4b9361ebd26fc37',
        '5d4406a8a4b9361e4f6eb8b7',
        '6516e91f609aaf354b34b3e2',
        '6516e971a3d4c6497930b450',
        '6529370c405a5f51dd023db8'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock',
      required: false
    }
  ],
  name: 'AK-12 buffer tube',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.03,
  shortName: 'AK-12 BT',
  weight: 0.142,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AK-12_buffer_tube'
}

export const ak12PistolGrip: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 7,
  iconLink: 'https://assets.tarkov.dev/5beec8ea0db834001a6f9dbf-icon.webp',
  id: '5beec8ea0db834001a6f9dbf',
  imageLink: 'https://assets.tarkov.dev/5beec8ea0db834001a6f9dbf-image.webp',
  marketLink: 'https://tarkov.dev/item/ak-12-pistol-grip',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'AK-12 pistol grip',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'AK-12',
  weight: 0.05,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AK-12_pistol_grip'
}

export const ak12Stock: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 3,
  iconLink: 'https://assets.tarkov.dev/5beec8c20db834001d2c465c-icon.webp',
  id: '5beec8c20db834001d2c465c',
  imageLink: 'https://assets.tarkov.dev/5beec8c20db834001d2c465c-image.webp',
  marketLink: 'https://tarkov.dev/item/ak-12-stock',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'AK-12 stock',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.21,
  shortName: 'AK-12',
  weight: 0.148,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AK-12_stock'
}

export const alkali: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/59faf98186f774067b6be103-icon.webp',
  id: '59faf98186f774067b6be103',
  imageLink: 'https://assets.tarkov.dev/59faf98186f774067b6be103-image.webp',
  marketLink: 'https://tarkov.dev/item/alkaline-cleaner-for-heat-exchangers',
  maxStackableAmount: 1,
  name: 'Alkaline cleaner for heat exchangers',
  presetWeight: undefined,
  prices: [],
  shortName: 'Alkali',
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Alkaline_cleaner_for_heat_exchangers'
}

export const alpha: IContainer = {
  capacity: 4,
  categoryId: ItemCategoryId.securedContainer,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/544a11ac4bdc2d470e8b456a-icon.webp',
  id: '544a11ac4bdc2d470e8b456a',
  imageLink: 'https://assets.tarkov.dev/544a11ac4bdc2d470e8b456a-image.webp',
  marketLink: 'https://tarkov.dev/item/secure-container-alpha',
  maxStackableAmount: 1,
  name: 'Secure container Alpha',
  presetWeight: undefined,
  prices: [],
  shortName: 'Alpha',
  weight: 0.6,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Secure_container_Alpha'
}

export const ammo1270Magnum: IAmmunition = {
  accuracyModifierPercentage: -0.15,
  armorDamagePercentage: 0.26,
  blinding: false,
  caliber: 'Caliber12g',
  categoryId: ItemCategoryId.ammunition,
  conflictingItemIds: [],
  durabilityBurnModifierPercentage: 0,
  fleshDamage: 50,
  fragmentationChance: 0,
  heavyBleedingChance: 0.1,
  iconLink: 'https://assets.tarkov.dev/5d6e6806a4b936088465b17e-icon.webp',
  id: '5d6e6806a4b936088465b17e',
  imageLink: 'https://assets.tarkov.dev/5d6e6806a4b936088465b17e-image.webp',
  lightBleedingChance: 0.2,
  marketLink: 'https://tarkov.dev/item/1270-85mm-magnum-buckshot',
  maxStackableAmount: 20,
  name: '12/70 8.5mm Magnum buckshot',
  penetratedArmorLevel: 0,
  penetrationPower: 2,
  presetWeight: undefined,
  prices: [],
  projectiles: 8,
  recoilModifier: 115,
  shortName: 'Magnum',
  subsonic: false,
  tracer: false,
  velocity: 385,
  weight: 0.059,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/12/70_8.5mm_Magnum_buckshot'
}

export const ammo545bp: IAmmunition = {
  accuracyModifierPercentage: -0.03,
  armorDamagePercentage: 0.46,
  blinding: false,
  caliber: 'Caliber545x39',
  categoryId: ItemCategoryId.ammunition,
  conflictingItemIds: [],
  durabilityBurnModifierPercentage: 0.35,
  fleshDamage: 48,
  fragmentationChance: 0.16,
  heavyBleedingChance: 0,
  iconLink: 'https://assets.tarkov.dev/56dfef82d2720bbd668b4567-icon.webp',
  id: '56dfef82d2720bbd668b4567',
  imageLink: 'https://assets.tarkov.dev/56dfef82d2720bbd668b4567-image.webp',
  lightBleedingChance: 0,
  marketLink: 'https://tarkov.dev/item/545x39mm-bp-gs',
  maxStackableAmount: 60,
  name: '5.45x39mm BP gs',
  penetratedArmorLevel: 4,
  penetrationPower: 45,
  presetWeight: undefined,
  prices: [],
  projectiles: 1,
  recoilModifier: 7,
  shortName: 'BP',
  subsonic: false,
  tracer: false,
  velocity: 890,
  weight: 0.01,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_BP_gs'
}

export const ammo545us: IAmmunition = {
  accuracyModifierPercentage: 0,
  armorDamagePercentage: 0.33,
  blinding: false,
  caliber: 'Caliber545x39',
  categoryId: ItemCategoryId.ammunition,
  conflictingItemIds: [],
  durabilityBurnModifierPercentage: -0.2,
  fleshDamage: 65,
  fragmentationChance: 0.1,
  heavyBleedingChance: 0,
  iconLink: 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-icon.webp',
  id: '56dff4ecd2720b5f5a8b4568',
  imageLink: 'https://assets.tarkov.dev/56dff4ecd2720b5f5a8b4568-image.webp',
  lightBleedingChance: 0,
  marketLink: 'https://tarkov.dev/item/545x39mm-us-gs',
  maxStackableAmount: 60,
  name: '5.45x39mm US gs',
  penetratedArmorLevel: 1,
  penetrationPower: 17,
  presetWeight: undefined,
  prices: [],
  projectiles: 1,
  recoilModifier: -15,
  shortName: 'US',
  subsonic: true,
  tracer: false,
  velocity: 303,
  weight: 0.01,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/5.45x39mm_US_gs'
}

export const ammo9mmGT: IAmmunition = {
  accuracyModifierPercentage: -0.05,
  armorDamagePercentage: 0.33,
  blinding: false,
  caliber: 'Caliber9x19PARA',
  categoryId: ItemCategoryId.ammunition,
  conflictingItemIds: [],
  durabilityBurnModifierPercentage: 0.15,
  fleshDamage: 58,
  fragmentationChance: 0.15,
  heavyBleedingChance: 0,
  iconLink: 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-icon.webp',
  id: '5c3df7d588a4501f290594e5',
  imageLink: 'https://assets.tarkov.dev/5c3df7d588a4501f290594e5-image.webp',
  lightBleedingChance: 0,
  marketLink: 'https://tarkov.dev/item/9x19mm-green-tracer',
  maxStackableAmount: 50,
  name: '9x19mm Green Tracer',
  penetratedArmorLevel: 1,
  penetrationPower: 14,
  presetWeight: undefined,
  prices: [],
  projectiles: 1,
  recoilModifier: -6,
  shortName: 'GT',
  subsonic: false,
  tracer: true,
  velocity: 365,
  weight: 0.006,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/9x19mm_Green_Tracer'
}

export const aquamari: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5c0fa877d174af02a012e1cf-icon.webp',
  id: '5c0fa877d174af02a012e1cf',
  imageLink: 'https://assets.tarkov.dev/5c0fa877d174af02a012e1cf-image.webp',
  marketLink: 'https://tarkov.dev/item/aquamari-water-bottle-with-filter',
  maxStackableAmount: 1,
  name: 'Aquamari water bottle with filter',
  presetWeight: undefined,
  prices: [],
  shortName: 'Aquamari',
  weight: 0.6,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Aquamari_water_bottle_with_filter'
}

export const armbandBlue: IItem = {
  categoryId: ItemCategoryId.armband,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5b3f3af486f774679e752c1f-icon.webp',
  id: '5b3f3af486f774679e752c1f',
  imageLink: 'https://assets.tarkov.dev/5b3f3af486f774679e752c1f-image.webp',
  marketLink: 'https://tarkov.dev/item/armband-blue',
  maxStackableAmount: 1,
  name: 'Armband (Blue)',
  presetWeight: undefined,
  prices: [],
  shortName: 'Armband',
  weight: 0.05,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Armband_(Blue)'
}

export const armor6b13Fl: IArmor = {
  armorClass: 0,
  armoredAreas: [
    'FRPLATE',
    'BCKPLATE',
    'Thorax',
    'Stomach',
    'ThoraxUpperBack',
    'StomachLowerBack',
    'StomachLeftSide',
    'StomachRightSide',
    'ThoraxThroat',
    'ThoraxNeck',
    'StomachGroin'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armor,
  conflictingItemIds: [],
  defaultPresetId: '65765f39526e320fbe0357b1',
  durability: 108,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/5c0e51be86f774598e797894-icon.webp',
  id: '5c0e51be86f774598e797894',
  imageLink: 'https://assets.tarkov.dev/5c0e51be86f774598e797894-image.webp',
  marketLink: 'https://tarkov.dev/item/6b13-assault-armor-flora',
  material: 'Aramid',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656f603f94b480b8a500c0d6',
        '654a4dea7c17dec2f50cc86a',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '656f57dc27aed95beb08f628',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '656f611f94b480b8a500c0db',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656f66b5c6baea13cd07e108',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656f664200d62bcd2e024077',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4',
        '656f63c027aed95beb08f62c'
      ],
      maxStackableAmount: 1,
      name: 'front_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '657b2797c3dbcb01d60c35ea',
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '657b22485f444d6dff0c6c2f',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '654a4a964b446df1ad03f192',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656efaf54772930db4031ff5',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '657b28d25f444d6dff0c6c77',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656efd66034e8e01c407f35c',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4'
      ],
      maxStackableAmount: 1,
      name: 'back_plate',
      required: false
    }
  ],
  movementSpeedModifierPercentage: -0.01,
  name: '6B13 assault armor (Flora)',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '6B13 FL',
  turningSpeedModifierPercentage: 0,
  weight: 2.8,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B13_assault_armor_(Flora)'
}

export const armor6b13FlDefault: IArmor = {
  armorClass: 0,
  armoredAreas: [
    'FRPLATE',
    'BCKPLATE',
    'Thorax',
    'Stomach',
    'ThoraxUpperBack',
    'StomachLowerBack',
    'StomachLeftSide',
    'StomachRightSide',
    'ThoraxThroat',
    'ThoraxNeck',
    'StomachGroin'
  ],
  baseItemId: '5c0e51be86f774598e797894',
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armor,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 108,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/65765f39526e320fbe0357b1-icon.webp',
  id: '65765f39526e320fbe0357b1',
  imageLink: 'https://assets.tarkov.dev/65765f39526e320fbe0357b1-image.webp',
  marketLink: 'https://tarkov.dev/item/6b13-assault-armor-flora-default',
  material: 'Aramid',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656f603f94b480b8a500c0d6',
        '654a4dea7c17dec2f50cc86a',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '656f57dc27aed95beb08f628',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '656f611f94b480b8a500c0db',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656f66b5c6baea13cd07e108',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656f664200d62bcd2e024077',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4',
        '656f63c027aed95beb08f62c'
      ],
      maxStackableAmount: 1,
      name: 'front_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '657b2797c3dbcb01d60c35ea',
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '657b22485f444d6dff0c6c2f',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '654a4a964b446df1ad03f192',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656efaf54772930db4031ff5',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '657b28d25f444d6dff0c6c77',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656efd66034e8e01c407f35c',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4'
      ],
      maxStackableAmount: 1,
      name: 'back_plate',
      required: false
    }
  ],
  movementSpeedModifierPercentage: -0.01,
  name: '6B13 assault armor (Flora) Default',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '6B13 FL Default',
  turningSpeedModifierPercentage: 0,
  weight: 2.8,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B13_assault_armor_(Flora)'
}

export const banshee: IVest = {
  armorClass: 0, armoredAreas: [
    'FRPLATE',
    'BCKPLATE',
    'LPLATE',
    'RPLATE',
    'StomachLeftSide',
    'StomachRightSide'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  capacity: 16,
  categoryId: ItemCategoryId.vest,
  conflictingItemIds: [],
  defaultPresetId: '657661ad234b9f6e050a42a2',
  durability: 72,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/639343fce101f4caa40a4ef3-icon.webp',
  id: '639343fce101f4caa40a4ef3',
  imageLink: 'https://assets.tarkov.dev/639343fce101f4caa40a4ef3-image.webp',
  marketLink: 'https://tarkov.dev/item/shellback-tactical-banshee-plate-carrier-a-tacs-au',
  material: 'Aramid',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656f603f94b480b8a500c0d6',
        '654a4dea7c17dec2f50cc86a',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '656f57dc27aed95beb08f628',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '656f611f94b480b8a500c0db',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656f66b5c6baea13cd07e108',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656f664200d62bcd2e024077',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4',
        '656f63c027aed95beb08f62c'
      ],
      maxStackableAmount: 1,
      name: 'front_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '657b2797c3dbcb01d60c35ea',
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '657b22485f444d6dff0c6c2f',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '654a4a964b446df1ad03f192',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656efaf54772930db4031ff5',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '657b28d25f444d6dff0c6c77',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656efd66034e8e01c407f35c',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4'
      ],
      maxStackableAmount: 1,
      name: 'back_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '64afdb577bb3bfe8fe03fd1d',
        '654a4f8bc721968a4404ef18',
        '64afd81707e2cf40e903a316',
        '6557458f83942d705f0c4962'
      ],
      maxStackableAmount: 1,
      name: 'left_side_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '64afdb577bb3bfe8fe03fd1d',
        '654a4f8bc721968a4404ef18',
        '64afd81707e2cf40e903a316',
        '6557458f83942d705f0c4962'
      ],
      maxStackableAmount: 1,
      name: 'right_side_plate',
      required: false
    }
  ],
  movementSpeedModifierPercentage: -0.01,
  name: 'Shellback Tactical Banshee plate carrier (A-TACS AU)',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Banshee',
  turningSpeedModifierPercentage: -0.01,
  weight: 3.08,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Shellback_Tactical_Banshee_plate_carrier_(A-TACS_AU)'
}

export const bansheeDefault: IVest = {
  armorClass: 0,
  armoredAreas: [
    'FRPLATE',
    'BCKPLATE',
    'LPLATE',
    'RPLATE',
    'StomachLeftSide',
    'StomachRightSide'
  ],
  baseItemId: '639343fce101f4caa40a4ef3',
  blindnessProtectionPercentage: 0,
  capacity: 16,
  categoryId: ItemCategoryId.vest,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 72,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/657661ad234b9f6e050a42a2-icon.webp',
  id: '657661ad234b9f6e050a42a2',
  imageLink: 'https://assets.tarkov.dev/657661ad234b9f6e050a42a2-image.webp',
  marketLink: 'https://tarkov.dev/item/shellback-tactical-banshee-plate-carrier-a-tacs-au-default',
  material: 'Aramid',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656f603f94b480b8a500c0d6',
        '654a4dea7c17dec2f50cc86a',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '656f57dc27aed95beb08f628',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '656f611f94b480b8a500c0db',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656f66b5c6baea13cd07e108',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656f664200d62bcd2e024077',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4',
        '656f63c027aed95beb08f62c'
      ],
      maxStackableAmount: 1,
      name: 'front_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '657b2797c3dbcb01d60c35ea',
        '656faf0ca0dce000a2020f77',
        '656fa76500d62bcd2e024080',
        '656f9d5900d62bcd2e02407c',
        '656fad8c498d1b7e3e071da0',
        '656fa0fb498d1b7e3e071d9c',
        '657b22485f444d6dff0c6c2f',
        '656fae5f7c2d57afe200c0d7',
        '656fa61e94b480b8a500c0e8',
        '656f9fa0498d1b7e3e071d98',
        '654a4a964b446df1ad03f192',
        '64afdcb83efdfea28601d041',
        '656fb21fa0dce000a2020f7c',
        '656fa99800d62bcd2e024088',
        '656efaf54772930db4031ff5',
        '655746010177119f4a097ff7',
        '64afc71497cf3a403c01ff38',
        '657b28d25f444d6dff0c6c77',
        '656fafe3498d1b7e3e071da4',
        '656fa8d700d62bcd2e024084',
        '656fa25e94b480b8a500c0e0',
        '656efd66034e8e01c407f35c',
        '65573fa5655447403702a816',
        '656fb0bd7c2d57afe200c0dc',
        '656fac30c6baea13cd07e10c',
        '656fa53d94b480b8a500c0e4'
      ],
      maxStackableAmount: 1,
      name: 'back_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '64afdb577bb3bfe8fe03fd1d',
        '654a4f8bc721968a4404ef18',
        '64afd81707e2cf40e903a316',
        '6557458f83942d705f0c4962'
      ],
      maxStackableAmount: 1,
      name: 'left_side_plate',
      required: false
    },
    {
      compatibleItemIds: [
        '64afdb577bb3bfe8fe03fd1d',
        '654a4f8bc721968a4404ef18',
        '64afd81707e2cf40e903a316',
        '6557458f83942d705f0c4962'
      ],
      maxStackableAmount: 1,
      name: 'right_side_plate',
      required: false
    }
  ],
  movementSpeedModifierPercentage: -0.01,
  name: 'Shellback Tactical Banshee plate carrier (A-TACS AU) Default',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Banshee Default',
  turningSpeedModifierPercentage: -0.01,
  weight: 3.08,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Shellback_Tactical_Banshee_plate_carrier_(A-TACS_AU)'
}

export const bayonet6Kh5: IMeleeWeapon = {
  categoryId: ItemCategoryId.meleeWeapon,
  chopDamage: 24,
  conflictingItemIds: [],
  hitRadius: 0.4,
  iconLink: 'https://assets.tarkov.dev/5bffdc370db834001d23eca8-icon.webp',
  id: '5bffdc370db834001d23eca8',
  imageLink: 'https://assets.tarkov.dev/5bffdc370db834001d23eca8-image.webp',
  marketLink: 'https://tarkov.dev/item/6kh5-bayonet',
  maxStackableAmount: 1,
  name: '6Kh5 Bayonet',
  presetWeight: undefined,
  prices: [],
  shortName: '6Kh5',
  stabDamage: 31,
  weight: 0.223,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6Kh5_Bayonet'
}

export const berkut: IBackpack = {
  capacity: 20,
  categoryId: ItemCategoryId.backpack,
  conflictingItemIds: [],
  ergonomicsModifierPercentage: -0.02,
  iconLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-icon.webp',
  id: '5ca20d5986f774331e7c9602',
  imageLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-image.webp',
  marketLink: 'https://tarkov.dev/item/wartech-berkut-bb-102-backpack-a-tacs-fg',
  maxStackableAmount: 1,
  movementSpeedModifierPercentage: 0,
  name: 'WARTECH Berkut BB-102 backpack (A-TACS FG)',
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Berkut',
  turningSpeedModifierPercentage: 0,
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/WARTECH_Berkut_BB-102_backpack_(A-TACS_FG)'
}

export const capacitors: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5c06782b86f77426df5407d2-icon.webp',
  id: '5c06782b86f77426df5407d2',
  imageLink: 'https://assets.tarkov.dev/5c06782b86f77426df5407d2-image.webp',
  marketLink: 'https://tarkov.dev/item/capacitors',
  maxStackableAmount: 1,
  name: 'Capacitors',
  presetWeight: undefined,
  prices: [],
  shortName: 'Caps',
  weight: 0.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Capacitors'
}

export const cf: IHeadwear = {
  armorClass: 0,
  armoredAreas: [],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  blocksHeadphones: false,
  categoryId: ItemCategoryId.faceCover,
  conflictingItemIds: [],
  deafening: 'None',
  defaultPresetId: undefined,
  durability: 0,
  ergonomicsModifierPercentage: 0,
  iconLink: 'https://assets.tarkov.dev/5ab8f39486f7745cd93a1cca-icon.webp',
  id: '5ab8f39486f7745cd93a1cca',
  imageLink: 'https://assets.tarkov.dev/5ab8f39486f7745cd93a1cca-image.webp',
  marketLink: 'https://tarkov.dev/item/cold-fear-infrared-balaclava',
  material: '',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: 0,
  name: 'Cold Fear infrared balaclava',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  ricochetChance: '',
  shortName: 'CF',
  turningSpeedModifierPercentage: 0,
  weight: 0.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Cold_Fear_infrared_balaclava'
}

export const cqcm: IHeadwear = {
  armorClass: 4,
  armoredAreas: [],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  blocksHeadphones: false,
  categoryId: ItemCategoryId.faceCover,
  conflictingItemIds: [
    '66b5f65ca7f72d197e70bcd6',
    '66b5f666cad6f002ab7214c2',
    '66b5f661af44ca0014063c05',
    '5e01ef6886f77445f643baa4',
    '5e00c1ad86f774747333222c'
  ],
  deafening: 'None',
  defaultPresetId: undefined,
  durability: 35,
  ergonomicsModifierPercentage: -0.02,
  iconLink: 'https://assets.tarkov.dev/657089638db3adca1009f4ca-icon.webp',
  id: '657089638db3adca1009f4ca',
  imageLink: 'https://assets.tarkov.dev/657089638db3adca1009f4ca-image.webp',
  marketLink: 'https://tarkov.dev/item/atomic-defense-cqcm-up-armored-ballistic-mask-black',
  material: 'UHMWPE',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: -0.01,
  name: 'Atomic Defense CQCM up armored ballistic mask (Black)',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  ricochetChance: 'High',
  shortName: 'CQCM',
  turningSpeedModifierPercentage: -0.03,
  weight: 2.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Atomic_Defense_CQCM_up_armored_ballistic_mask_(Black)'
}

export const crossbow: IEyewear = {
  armorClass: 0,
  armoredAreas: [],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0.3,
  categoryId: ItemCategoryId.eyewear,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 0,
  ergonomicsModifierPercentage: 0,
  iconLink: 'https://assets.tarkov.dev/5d5fca1ea4b93635fd598c07-icon.webp',
  id: '5d5fca1ea4b93635fd598c07',
  imageLink: 'https://assets.tarkov.dev/5d5fca1ea4b93635fd598c07-image.webp',
  marketLink: 'https://tarkov.dev/item/ess-crossbow-tactical-glasses',
  material: 'UHMWPE',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: 0,
  name: 'ESS Crossbow tactical glasses',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Crossbow',
  turningSpeedModifierPercentage: 0,
  weight: 0.03,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/ESS_Crossbow_tactical_glasses'
}

export const cultLocust: IArmorMod = {
  armorClass: 5,
  armoredAreas: [
    'FRPLATE',
    'BCKPLATE'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armorMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 60,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/656fa8d700d62bcd2e024084-icon.webp',
  id: '656fa8d700d62bcd2e024084',
  imageLink: 'https://assets.tarkov.dev/656fa8d700d62bcd2e024084-image.webp',
  marketLink: 'https://tarkov.dev/item/cult-locust-ballistic-plate',
  material: 'Titan',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: -0.015,
  name: 'Cult Locust ballistic plate',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Cult Locust',
  turningSpeedModifierPercentage: -0.01,
  weight: 2.56,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Cult_Locust_ballistic_plate'
}

export const ekp802dt: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [
    '5827272a24597748c74bdeea'
  ],
  defaultPresetId: undefined,
  ergonomicsModifier: -3,
  iconLink: 'https://assets.tarkov.dev/5947db3f86f77447880cf76f-icon.webp',
  id: '5947db3f86f77447880cf76f',
  imageLink: 'https://assets.tarkov.dev/5947db3f86f77447880cf76f-image.webp',
  marketLink: 'https://tarkov.dev/item/axion-kobra-ekp-8-02-reflex-sight-dovetail',
  maxStackableAmount: 1,
  name: 'Axion Kobra EKP-8-02 reflex sight (Dovetail)',
  modSlots: [
    {
      compatibleItemIds: [
        '591c4e1186f77410354b316e'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical',
      required: false
    }
  ],
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'EKP-8-02 DT',
  weight: 0.273,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Axion_Kobra_EKP-8-02_reflex_sight_(Dovetail)'
}

export const erBayonet: IMeleeWeapon = {
  categoryId: ItemCategoryId.meleeWeapon,
  chopDamage: 25,
  conflictingItemIds: [],
  hitRadius: 0.4,
  iconLink: 'https://assets.tarkov.dev/54491bb74bdc2d09088b4567-icon.webp',
  id: '54491bb74bdc2d09088b4567',
  imageLink: 'https://assets.tarkov.dev/54491bb74bdc2d09088b4567-image.webp',
  marketLink: 'https://tarkov.dev/item/er-fulcrum-bayonet',
  maxStackableAmount: 1,
  name: 'ER FULCRUM BAYONET',
  presetWeight: undefined,
  prices: [],
  shortName: 'ER BAYONET',
  stabDamage: 27,
  weight: 0.45,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/ER_FULCRUM_BAYONET'
}

export const esLamp: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/590a3cd386f77436f20848cb-icon.webp',
  id: '590a3cd386f77436f20848cb',
  imageLink: 'https://assets.tarkov.dev/590a3cd386f77436f20848cb-image.webp',
  marketLink: 'https://tarkov.dev/item/energy-saving-lamp',
  maxStackableAmount: 1,
  name: 'Energy-saving lamp',
  presetWeight: undefined,
  prices: [],
  shortName: 'ES Lamp',
  weight: 0.2,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Energy-saving_lamp'
}

export const eur: IItem = {
  categoryId: ItemCategoryId.currency,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/569668774bdc2da2298b4568-icon.webp',
  id: '569668774bdc2da2298b4568',
  imageLink: 'https://assets.tarkov.dev/569668774bdc2da2298b4568-image.webp',
  marketLink: 'https://tarkov.dev/item/euros',
  maxStackableAmount: 50000,
  name: 'Euros',
  presetWeight: undefined,
  prices: [],
  shortName: 'EUR',
  weight: 0,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Euros'
}

export const ewr: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/60098b1705871270cd5352a1-icon.webp',
  id: '60098b1705871270cd5352a1',
  imageLink: 'https://assets.tarkov.dev/60098b1705871270cd5352a1-image.webp',
  marketLink: 'https://tarkov.dev/item/emergency-water-ration',
  maxStackableAmount: 1,
  name: 'Emergency Water Ration',
  presetWeight: undefined,
  prices: [],
  shortName: 'EWR',
  weight: 0.128,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Emergency_Water_Ration'
}

export const filter: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/590c595c86f7747884343ad7-icon.webp',
  id: '590c595c86f7747884343ad7',
  imageLink: 'https://assets.tarkov.dev/590c595c86f7747884343ad7-image.webp',
  marketLink: 'https://tarkov.dev/item/gas-mask-air-filter',
  maxStackableAmount: 1,
  name: 'Gas mask air filter',
  presetWeight: undefined,
  prices: [],
  shortName: 'Filter',
  weight: 0.5,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Gas_mask_air_filter'
}

export const h2o2: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/59e361e886f774176c10a2a5-icon.webp',
  id: '59e361e886f774176c10a2a5',
  imageLink: 'https://assets.tarkov.dev/59e361e886f774176c10a2a5-image.webp',
  marketLink: 'https://tarkov.dev/item/bottle-of-hydrogen-peroxide',
  maxStackableAmount: 1,
  name: 'Bottle of hydrogen peroxide',
  presetWeight: undefined,
  prices: [],
  shortName: 'H2O2',
  weight: 0.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Bottle_of_hydrogen_peroxide'
}

export const halfMask: IHeadwear = {
  armorClass: 0,
  armoredAreas: [],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  blocksHeadphones: false,
  categoryId: ItemCategoryId.faceCover,
  conflictingItemIds: [],
  deafening: 'None',
  defaultPresetId: undefined,
  durability: 0,
  ergonomicsModifierPercentage: 0,
  iconLink: 'https://assets.tarkov.dev/572b7fa524597762b747ce82-icon.webp',
  id: '572b7fa524597762b747ce82',
  imageLink: 'https://assets.tarkov.dev/572b7fa524597762b747ce82-image.webp',
  marketLink: 'https://tarkov.dev/item/lower-half-mask',
  material: '',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: 0,
  name: 'Lower half-mask',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  ricochetChance: '',
  shortName: 'Half-mask',
  turningSpeedModifierPercentage: 0,
  weight: 0.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Lower_half-mask'
}

export const iskra: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/590c5d4b86f774784e1b9c45-icon.webp',
  id: '590c5d4b86f774784e1b9c45',
  imageLink: 'https://assets.tarkov.dev/590c5d4b86f774784e1b9c45-image.webp',
  marketLink: 'https://tarkov.dev/item/iskra-ration-pack',
  maxStackableAmount: 1,
  name: 'Iskra ration pack',
  presetWeight: undefined,
  prices: [],
  shortName: 'Iskra',
  weight: 1.75,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Iskra_ration_pack'
}

export const k1s: IHeadwear = {
  armorClass: 2,
  armoredAreas: [
    'HeadTopOfTheHead',
    'HeadNape',
    'HeadEars'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  blocksHeadphones: true,
  categoryId: ItemCategoryId.headwear,
  conflictingItemIds: [],
  deafening: 'High',
  defaultPresetId: undefined,
  durability: 45,
  ergonomicsModifierPercentage: -0.02,
  iconLink: 'https://assets.tarkov.dev/59e7711e86f7746cae05fbe1-icon.webp',
  id: '59e7711e86f7746cae05fbe1',
  imageLink: 'https://assets.tarkov.dev/59e7711e86f7746cae05fbe1-image.webp',
  marketLink: 'https://tarkov.dev/item/kolpak-1s-riot-helmet',
  material: 'Aramid',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5ac4c50d5acfc40019262e87'
      ],
      maxStackableAmount: 1,
      name: 'mod_equipment',
      required: false
    }
  ],
  movementSpeedModifierPercentage: 0,
  name: 'Kolpak-1S riot helmet',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  ricochetChance: 'Low',
  shortName: 'K-1S',
  turningSpeedModifierPercentage: -0.02,
  weight: 1.9,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kolpak-1S_riot_helmet'
}

export const k1sVisor: IArmorMod = {
  armorClass: 2,
  armoredAreas: [
    'HeadFace',
    'HeadEyes',
    'HeadJaws'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0.15,
  categoryId: ItemCategoryId.armorMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 30,
  ergonomicsModifierPercentage: 0,
  iconLink: 'https://assets.tarkov.dev/5ac4c50d5acfc40019262e87-icon.webp',
  id: '5ac4c50d5acfc40019262e87',
  imageLink: 'https://assets.tarkov.dev/5ac4c50d5acfc40019262e87-image.webp',
  marketLink: 'https://tarkov.dev/item/kolpak-1s-face-shield',
  material: 'Glass',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: 0,
  name: 'Kolpak-1S face shield',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'K-1S',
  turningSpeedModifierPercentage: 0,
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kolpak-1S_face_shield'
}

export const kotton: IHeadwear = {
  armorClass: 0,
  armoredAreas: [],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  blocksHeadphones: false,
  categoryId: ItemCategoryId.headwear,
  conflictingItemIds: [
    '5b432be65acfc433000ed01f',
    '59e770b986f7742cbd762754'
  ],
  deafening: 'None',
  defaultPresetId: undefined,
  durability: 0,
  ergonomicsModifierPercentage: 0,
  iconLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-icon.webp',
  id: '5bd073c986f7747f627e796c',
  imageLink: 'https://assets.tarkov.dev/5bd073c986f7747f627e796c-image.webp',
  marketLink: 'https://tarkov.dev/item/kotton-beanie',
  material: '',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: 0,
  name: 'Kotton beanie',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  ricochetChance: '',
  shortName: 'Kotton',
  turningSpeedModifierPercentage: 0,
  weight: 0.2,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Kotton_beanie'
}

export const lshZ2dtm: IHeadwear = {
  armorClass: 4,
  armoredAreas: [
    'HeadTopOfTheHead',
    'HeadNape',
    'HeadEars'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  blocksHeadphones: true,
  categoryId: ItemCategoryId.headwear,
  conflictingItemIds: [],
  deafening: 'High',
  defaultPresetId: undefined,
  durability: 99,
  ergonomicsModifierPercentage: -0.03,
  iconLink: 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-icon.webp',
  id: '5d6d3716a4b9361bc8618872',
  imageLink: 'https://assets.tarkov.dev/5d6d3716a4b9361bc8618872-image.webp',
  marketLink: 'https://tarkov.dev/item/bnti-lshz-2dtm-helmet-black',
  material: 'Combined',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5d6d3829a4b9361bc8618943'
      ],
      maxStackableAmount: 1,
      name: 'mod_equipment_000',
      required: false
    },
    {
      compatibleItemIds: [
        '5c0558060db834001b735271',
        '5a16b8a9fcdbcb00165aa6ca'
      ],
      maxStackableAmount: 1,
      name: 'mod_nvg',
      required: false
    },
    {
      compatibleItemIds: [
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
      maxStackableAmount: 1,
      name: 'mod_mount',
      required: false
    },
    {
      compatibleItemIds: [
        '5d6d3be5a4b9361bc73bc763'
      ],
      maxStackableAmount: 1,
      name: 'mod_equipment_001',
      required: false
    },
    {
      compatibleItemIds: [
        '5d6d3943a4b9360dbc46d0cc'
      ],
      maxStackableAmount: 1,
      name: 'mod_equipment_002',
      required: false
    }
  ],
  movementSpeedModifierPercentage: 0,
  name: 'BNTI LShZ-2DTM helmet (Black)',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  ricochetChance: 'High',
  shortName: 'LShZ-2DTM',
  turningSpeedModifierPercentage: -0.03,
  weight: 3.4,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/BNTI_LShZ-2DTM_helmet_(Black)'
}

export const lshZ2dtmFs: IArmorMod = {
  armorClass: 4,
  armoredAreas: [
    'HeadFace',
    'HeadEyes',
    'HeadJaws'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0.1,
  categoryId: ItemCategoryId.armorMod,
  conflictingItemIds: [
    '5c0696830db834001d23f5da',
    '5c066e3a0db834001b7353f0',
    '5c0558060db834001b735271',
    '57235b6f24597759bf5a30f1',
    '5c110624d174af029e69734c'
  ],
  defaultPresetId: undefined,
  durability: 50,
  ergonomicsModifierPercentage: -0.02,
  iconLink: 'https://assets.tarkov.dev/5d6d3829a4b9361bc8618943-icon.webp',
  id: '5d6d3829a4b9361bc8618943',
  imageLink: 'https://assets.tarkov.dev/5d6d3829a4b9361bc8618943-image.webp',
  marketLink: 'https://tarkov.dev/item/lshz-2dtm-face-shield',
  material: 'Glass',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: 0,
  name: 'LShZ-2DTM face shield',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '2DTM FS',
  turningSpeedModifierPercentage: -0.05,
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/LShZ-2DTM_face_shield'
}

export const m9a3: IRangedWeapon = {
  baseItemId: undefined,
  caliber: 'Caliber9x19PARA',
  categoryId: ItemCategoryId.secondaryWeapon,
  conflictingItemIds: [],
  defaultPresetId: '5d3f0bc986f7743cb332abdc',
  ergonomics: 70,
  fireModes: [
    'SingleFire'
  ],
  fireRate: 30,
  horizontalRecoil: 280,
  iconLink: 'https://assets.tarkov.dev/5cadc190ae921500103bb3b6-icon.webp',
  id: '5cadc190ae921500103bb3b6',
  imageLink: 'https://assets.tarkov.dev/5cadc190ae921500103bb3b6-image.webp',
  marketLink: 'https://tarkov.dev/item/beretta-m9a3-9x19-pistol',
  maxStackableAmount: 1,
  minuteOfAngle: undefined,
  modSlots: [
    {
      compatibleItemIds: [
        '5cadc1c6ae9215000f2775a4'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadc431ae921500113bb8d5'
      ],
      maxStackableAmount: 1,
      name: 'mod_pistol_grip',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadc55cae921500103bb3be'
      ],
      maxStackableAmount: 1,
      name: 'mod_reciever',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadc2e0ae9215051e1c21e7',
        '676176b762e0497044079f49'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '5a800961159bd4315e3a1657',
        '5cc9c20cd7f00c001336c65d',
        '5d2369418abbc306c62e0c80',
        '5b07dd285acfc4001754240d',
        '56def37dd2720bec348b456a',
        '5a7b483fe899ef0016170d15',
        '5a5f1ce64f39f90b401987bc',
        '560d657b4bdc2da74d8b4572',
        '5a7b4900e899ef197b331a2a',
        '5b3a08b25acfc4001754880c',
        '6272370ee4013c5d7e31f418',
        '6272379924e29f06af4d5ecb'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical',
      required: false
    }
  ],
  name: 'Beretta M9A3 9x19 pistol',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'M9A3',
  verticalRecoil: 404,
  weight: 0.231,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Beretta_M9A3_9x19_pistol'
}

export const m9a3Default: IRangedWeapon = {
  baseItemId: '5cadc190ae921500103bb3b6',
  caliber: 'Caliber9x19PARA',
  categoryId: ItemCategoryId.secondaryWeapon,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomics: 70,
  fireModes: [
    'SingleFire'
  ],
  fireRate: 30,
  horizontalRecoil: 280,
  iconLink: 'https://assets.tarkov.dev/5d3f0bc986f7743cb332abdc-icon.webp',
  id: '5d3f0bc986f7743cb332abdc',
  imageLink: 'https://assets.tarkov.dev/5d3f0bc986f7743cb332abdc-image.webp',
  marketLink: 'https://tarkov.dev/item/beretta-m9a3-9x19-pistol-default',
  maxStackableAmount: 1,
  minuteOfAngle: 9.97,
  modSlots: [
    {
      compatibleItemIds: [
        '5cadc1c6ae9215000f2775a4'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadc431ae921500113bb8d5'
      ],
      maxStackableAmount: 1,
      name: 'mod_pistol_grip',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadc55cae921500103bb3be'
      ],
      maxStackableAmount: 1,
      name: 'mod_reciever',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadc2e0ae9215051e1c21e7',
        '676176b762e0497044079f49'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '5a800961159bd4315e3a1657',
        '5cc9c20cd7f00c001336c65d',
        '5d2369418abbc306c62e0c80',
        '5b07dd285acfc4001754240d',
        '56def37dd2720bec348b456a',
        '5a7b483fe899ef0016170d15',
        '5a5f1ce64f39f90b401987bc',
        '560d657b4bdc2da74d8b4572',
        '5a7b4900e899ef197b331a2a',
        '5b3a08b25acfc4001754880c',
        '6272370ee4013c5d7e31f418',
        '6272379924e29f06af4d5ecb'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical',
      required: false
    }
  ],
  name: 'Beretta M9A3 9x19 pistol Default',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'M9A3 Default',
  verticalRecoil: 404,
  weight: 0.231,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Beretta_M9A3_9x19_pistol'
}

export const m9a3Fs: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/5cadd919ae921500126a77f3-icon.webp',
  id: '5cadd919ae921500126a77f3',
  imageLink: 'https://assets.tarkov.dev/5cadd919ae921500126a77f3-image.webp',
  marketLink: 'https://tarkov.dev/item/m9a3-front-sight',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'M9A3 front sight',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'M9A3 FS',
  weight: 0.007,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_front_sight'
}

export const m9a3Magazine: IMagazine = {
  acceptedAmmunitionIds: [
    '5efb0da7a29a85116f6ea05f',
    '5c3df7d588a4501f290594e5',
    '58864a4f2459770fcc257101',
    '56d59d3ad2720bdb418b4577',
    '5c925fa22e221601da359b7b',
    '5a3c16fe86f77452b62de32a',
    '5efb0e16aeb21837e749c7ff',
    '5c0d56a986f774449d5de529',
    '64b7bbb74b75259c590fa897'
  ],
  baseItemId: undefined,
  capacity: 17,
  categoryId: ItemCategoryId.magazine,
  checkSpeedModifierPercentage: 0,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  iconLink: 'https://assets.tarkov.dev/5cadc2e0ae9215051e1c21e7-icon.webp',
  id: '5cadc2e0ae9215051e1c21e7',
  imageLink: 'https://assets.tarkov.dev/5cadc2e0ae9215051e1c21e7-image.webp',
  loadSpeedModifierPercentage: 0,
  malfunctionPercentage: 0.01,
  marketLink: 'https://tarkov.dev/item/m9a3-9x19-17-round-magazine',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'M9A3 9x19 17-round magazine',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'M9A3',
  weight: 0.082,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_9x19_17-round_magazine'
}

export const m9a3Rs: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/5cadd940ae9215051e1c2316-icon.webp',
  id: '5cadd940ae9215051e1c2316',
  imageLink: 'https://assets.tarkov.dev/5cadd940ae9215051e1c2316-image.webp',
  marketLink: 'https://tarkov.dev/item/m9a3-rear-sight',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'M9A3 rear sight',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'M9A3 RS',
  weight: 0.008,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_rear_sight'
}

export const m9a3SideGrip: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 4,
  iconLink: 'https://assets.tarkov.dev/5cadc431ae921500113bb8d5-icon.webp',
  id: '5cadc431ae921500113bb8d5',
  imageLink: 'https://assets.tarkov.dev/5cadc431ae921500113bb8d5-image.webp',
  marketLink: 'https://tarkov.dev/item/m9a3-polymer-side-grips',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'M9A3 polymer side grips',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'M9A3',
  weight: 0.09,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_polymer_side_grips'
}

export const m9a3Slide: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 1,
  iconLink: 'https://assets.tarkov.dev/5cadc55cae921500103bb3be-icon.webp',
  id: '5cadc55cae921500103bb3be',
  imageLink: 'https://assets.tarkov.dev/5cadc55cae921500103bb3be-image.webp',
  marketLink: 'https://tarkov.dev/item/m9a3-pistol-slide',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5cadd940ae9215051e1c2316',
        '5cadd954ae921500103bb3c2'
      ],
      maxStackableAmount: 1,
      name: 'mod_sight_rear',
      required: false
    },
    {
      compatibleItemIds: [
        '5cadd919ae921500126a77f3'
      ],
      maxStackableAmount: 1,
      name: 'mod_sight_front',
      required: false
    }
  ],
  name: 'M9A3 pistol slide',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'M9A3',
  weight: 0.19,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_pistol_slide'
}

export const m9a3Thr: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -4,
  iconLink: 'https://assets.tarkov.dev/5cadc1c6ae9215000f2775a4-icon.webp',
  id: '5cadc1c6ae9215000f2775a4',
  imageLink: 'https://assets.tarkov.dev/5cadc1c6ae9215000f2775a4-image.webp',
  marketLink: 'https://tarkov.dev/item/m9a3-9x19-127mm-threaded-barrel',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5cadc390ae921500126a77f1',
        '5c7e8fab2e22165df16b889b',
        '5a33a8ebc4a282000c5a950d',
        '5c6165902e22160010261b28',
        '5a32a064c4a28200741e22de'
      ],
      maxStackableAmount: 1,
      name: 'mod_muzzle',
      required: false
    }
  ],
  name: 'M9A3 9x19 127mm threaded barrel',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.03,
  shortName: 'M9A3 thr.',
  weight: 0.2,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_9x19_127mm_threaded_barrel'
}

export const m9a3Prot: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 1,
  iconLink: 'https://assets.tarkov.dev/5cadc390ae921500126a77f1-icon.webp',
  id: '5cadc390ae921500126a77f1',
  imageLink: 'https://assets.tarkov.dev/5cadc390ae921500126a77f1-image.webp',
  marketLink: 'https://tarkov.dev/item/m9a3-thread-protector',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'M9A3 thread protector',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'M9A3 thr.',
  weight: 0.01,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/M9A3_thread_protector'
}

export const magazine6l20: IMagazine = {
  acceptedAmmunitionIds: [
    '5c0d5e4486f77478390952fe',
    '61962b617c6c7b169525f168',
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
  baseItemId: undefined,
  capacity: 30,
  categoryId: ItemCategoryId.magazine,
  checkSpeedModifierPercentage: 0,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -3,
  iconLink: 'https://assets.tarkov.dev/564ca99c4bdc2d16268b4589-icon.webp',
  id: '564ca99c4bdc2d16268b4589',
  imageLink: 'https://assets.tarkov.dev/564ca99c4bdc2d16268b4589-image.webp',
  loadSpeedModifierPercentage: 0,
  malfunctionPercentage: 0.07,
  marketLink: 'https://tarkov.dev/item/ak-74-545x39-6l20-30-round-magazine',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'AK-74 5.45x39 6L20 30-round magazine',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '6L20',
  weight: 0.215,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AK-74_5.45x39_6L20_30-round_magazine'
}

export const mechanism: IBackpack = {
  capacity: 32,
  categoryId: ItemCategoryId.backpack,
  conflictingItemIds: [],
  ergonomicsModifierPercentage: -0.03,
  iconLink: 'https://assets.tarkov.dev/5d5d940f86f7742797262046-icon.webp',
  id: '5d5d940f86f7742797262046',
  imageLink: 'https://assets.tarkov.dev/5d5d940f86f7742797262046-image.webp',
  marketLink: 'https://tarkov.dev/item/oakley-mechanism-heavy-duty-backpack-black',
  maxStackableAmount: 1,
  movementSpeedModifierPercentage: -0.02,
  name: 'Oakley Mechanism heavy duty backpack (Black)',
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Mechanism',
  turningSpeedModifierPercentage: -0.01,
  weight: 0.997,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Oakley_Mechanism_heavy_duty_backpack_(Black)'
}

export const monocletePe: IArmorMod = {
  armorClass: 4,
  armoredAreas: [
    'FRPLATE',
    'BCKPLATE'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armorMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 40,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/656fad8c498d1b7e3e071da0-icon.webp',
  id: '656fad8c498d1b7e3e071da0',
  imageLink: 'https://assets.tarkov.dev/656fad8c498d1b7e3e071da0-image.webp',
  marketLink: 'https://tarkov.dev/item/monoclete-level-iii-pe-ballistic-plate',
  material: 'UHMWPE',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: -0.01,
  name: 'Monoclete level III PE ballistic plate',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'Monoclete PE',
  turningSpeedModifierPercentage: 0,
  weight: 1.35,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Monoclete_level_III_PE_ballistic_plate'
}

export const morphine: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/544fb3f34bdc2d03748b456a-icon.webp',
  id: '544fb3f34bdc2d03748b456a',
  imageLink: 'https://assets.tarkov.dev/544fb3f34bdc2d03748b456a-image.webp',
  marketLink: 'https://tarkov.dev/item/morphine-injector',
  maxStackableAmount: 1,
  name: 'Morphine injector',
  presetWeight: undefined,
  prices: [],
  shortName: 'Morphine',
  weight: 0.05,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Morphine_injector'
}

export const ms2000: IItem = {
  categoryId: ItemCategoryId.special,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5991b51486f77447b112d44f-icon.webp',
  id: '5991b51486f77447b112d44f',
  imageLink: 'https://assets.tarkov.dev/5991b51486f77447b112d44f-image.webp',
  marketLink: 'https://tarkov.dev/item/ms2000-marker',
  maxStackableAmount: 1,
  name: 'MS2000 Marker',
  presetWeight: undefined,
  prices: [],
  shortName: 'MS2000',
  weight: 0.15,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MS2000_Marker'
}

export const mts25512: IRangedWeapon = {
  baseItemId: undefined,
  caliber: 'Caliber12g',
  categoryId: ItemCategoryId.mainWeapon,
  conflictingItemIds: [],
  defaultPresetId: '6198e2ddef80673cae5d1c87',
  ergonomics: 50,
  fireModes: [
    'SingleFire',
    'DoubleAction'
  ],
  fireRate: 30,
  horizontalRecoil: 486,
  iconLink: 'https://assets.tarkov.dev/60db29ce99594040e04c4a27-icon.webp',
  id: '60db29ce99594040e04c4a27',
  imageLink: 'https://assets.tarkov.dev/60db29ce99594040e04c4a27-image.webp',
  marketLink: 'https://tarkov.dev/item/mts-255-12-12ga-shotgun',
  maxStackableAmount: 1,
  minuteOfAngle: undefined,
  modSlots: [
    {
      compatibleItemIds: [
        '60dc519adf4c47305f6d410d'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '612368f58b401f4f51239b33'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    },
    {
      compatibleItemIds: [
        '612781056f3d944a17348d60'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock',
      required: false
    },
    {
      compatibleItemIds: [
        '6123649463849f3d843da7c4'
      ],
      maxStackableAmount: 1,
      name: 'mod_handguard',
      required: false
    }
  ],
  name: 'MTs-255-12 12ga shotgun',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'MTs-255-12',
  verticalRecoil: 364,
  weight: 1.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_12ga_shotgun'
}

export const mts25512Default: IRangedWeapon = {
  baseItemId: '60db29ce99594040e04c4a27',
  caliber: 'Caliber12g',
  categoryId: ItemCategoryId.mainWeapon,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomics: 50,
  fireModes: [
    'SingleFire',
    'DoubleAction'
  ],
  fireRate: 30,
  horizontalRecoil: 486,
  iconLink: 'https://assets.tarkov.dev/6198e2ddef80673cae5d1c87-icon.webp',
  id: '6198e2ddef80673cae5d1c87',
  imageLink: 'https://assets.tarkov.dev/6198e2ddef80673cae5d1c87-image.webp',
  marketLink: 'https://tarkov.dev/item/mts-255-12-12ga-shotgun-default',
  maxStackableAmount: 1,
  minuteOfAngle: 26.13,
  modSlots: [
    {
      compatibleItemIds: [
        '60dc519adf4c47305f6d410d'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '612368f58b401f4f51239b33'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    },
    {
      compatibleItemIds: [
        '612781056f3d944a17348d60'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock',
      required: false
    },
    {
      compatibleItemIds: [
        '6123649463849f3d843da7c4'
      ],
      maxStackableAmount: 1,
      name: 'mod_handguard',
      required: false
    }
  ],
  name: 'MTs-255-12 12ga shotgun Default',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'MTs-255-12 Default',
  verticalRecoil: 364,
  weight: 1.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_12ga_shotgun'
}

export const mts25512755mmRib: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -18,
  iconLink: 'https://assets.tarkov.dev/612368f58b401f4f51239b33-icon.webp',
  id: '612368f58b401f4f51239b33',
  imageLink: 'https://assets.tarkov.dev/612368f58b401f4f51239b33-image.webp',
  marketLink: 'https://tarkov.dev/item/mts-255-12-12ga-755mm-barrel-with-rib',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '619d36da53b4d42ee724fae4'
      ],
      maxStackableAmount: 1,
      name: 'mod_muzzle',
      required: false
    },
    {
      compatibleItemIds: [
        '609b9e31506cf869cf3eaf41',
        '5dfe14f30b92095fd441edaf'
      ],
      maxStackableAmount: 1,
      name: 'mod_mount',
      required: false
    }
  ],
  name: 'MTs-255-12 12ga 755mm barrel with rib',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.1,
  shortName: 'MTs-255 755mm rib',
  weight: 1.55,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_12ga_755mm_barrel_with_rib'
}

export const mts25512beech: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 9,
  iconLink: 'https://assets.tarkov.dev/6123649463849f3d843da7c4-icon.webp',
  id: '6123649463849f3d843da7c4',
  imageLink: 'https://assets.tarkov.dev/6123649463849f3d843da7c4-image.webp',
  marketLink: 'https://tarkov.dev/item/mts-255-12-beechwood-forestock',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'MTs-255-12 beechwood forestock',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.02,
  shortName: 'MTs-255 beech',
  weight: 0.8,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_beechwood_forestock'
}

export const mts25512choke: IRangedWeaponMod = {
  accuracyModifierPercentage: 0.03,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/619d36da53b4d42ee724fae4-icon.webp',
  id: '619d36da53b4d42ee724fae4',
  imageLink: 'https://assets.tarkov.dev/619d36da53b4d42ee724fae4-image.webp',
  marketLink: 'https://tarkov.dev/item/mts-255-12-12ga-choke',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'MTs-255-12 12ga choke',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.01,
  shortName: 'MTs choke',
  weight: 0.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_12ga_choke'
}

export const mts25512cyl: IMagazine = {
  acceptedAmmunitionIds: [
    '560d5e524bdc2d25448b4571',
    '5d6e6772a4b936088465b17c',
    '5d6e67fba4b9361bc73bc779',
    '5d6e6806a4b936088465b17e',
    '5d6e68dea4b9361bcc29e659',
    '5d6e6911a4b9361bd5780d52',
    '5c0d591486f7744c505b416f',
    '58820d1224597753c90aeb13',
    '5d6e68c4a4b9361b93413f79',
    '5d6e68a8a4b9360b6c0d54e2',
    '5d6e68e6a4b9361c140bcfe0',
    '5d6e6869a4b9361c140bcfde',
    '5d6e68b3a4b9361bca7e50b5',
    '5d6e6891a4b9361bd473feea',
    '5d6e689ca4b9361bc8618956',
    '5d6e68d1a4b93622fe60e845',
    '64b8ee384b75259c590fa89b'
  ],
  baseItemId: undefined,
  capacity: 5,
  categoryId: ItemCategoryId.magazine,
  checkSpeedModifierPercentage: 0,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -2,
  iconLink: 'https://assets.tarkov.dev/60dc519adf4c47305f6d410d-icon.webp',
  id: '60dc519adf4c47305f6d410d',
  imageLink: 'https://assets.tarkov.dev/60dc519adf4c47305f6d410d-image.webp',
  loadSpeedModifierPercentage: 0,
  malfunctionPercentage: 0,
  marketLink: 'https://tarkov.dev/item/mts-255-12-12ga-cylinder',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '560d5e524bdc2d25448b4571',
        '5d6e6772a4b936088465b17c',
        '5d6e67fba4b9361bc73bc779',
        '5d6e6806a4b936088465b17e',
        '5d6e68dea4b9361bcc29e659',
        '5d6e6911a4b9361bd5780d52',
        '5c0d591486f7744c505b416f',
        '58820d1224597753c90aeb13',
        '5d6e68c4a4b9361b93413f79',
        '5d6e68a8a4b9360b6c0d54e2',
        '5d6e68e6a4b9361c140bcfe0',
        '5d6e6869a4b9361c140bcfde',
        '5d6e68b3a4b9361bca7e50b5',
        '5d6e6891a4b9361bd473feea',
        '5d6e689ca4b9361bc8618956',
        '5d6e68d1a4b93622fe60e845',
        '64b8ee384b75259c590fa89b'
      ],
      maxStackableAmount: 1,
      name: 'camora_000',
      required: false
    },
    {
      compatibleItemIds: [
        '560d5e524bdc2d25448b4571',
        '5d6e6772a4b936088465b17c',
        '5d6e67fba4b9361bc73bc779',
        '5d6e6806a4b936088465b17e',
        '5d6e68dea4b9361bcc29e659',
        '5d6e6911a4b9361bd5780d52',
        '5c0d591486f7744c505b416f',
        '58820d1224597753c90aeb13',
        '5d6e68c4a4b9361b93413f79',
        '5d6e68a8a4b9360b6c0d54e2',
        '5d6e68e6a4b9361c140bcfe0',
        '5d6e6869a4b9361c140bcfde',
        '5d6e68b3a4b9361bca7e50b5',
        '5d6e6891a4b9361bd473feea',
        '5d6e689ca4b9361bc8618956',
        '5d6e68d1a4b93622fe60e845',
        '64b8ee384b75259c590fa89b'
      ],
      maxStackableAmount: 1,
      name: 'camora_001',
      required: false
    },
    {
      compatibleItemIds: [
        '560d5e524bdc2d25448b4571',
        '5d6e6772a4b936088465b17c',
        '5d6e67fba4b9361bc73bc779',
        '5d6e6806a4b936088465b17e',
        '5d6e68dea4b9361bcc29e659',
        '5d6e6911a4b9361bd5780d52',
        '5c0d591486f7744c505b416f',
        '58820d1224597753c90aeb13',
        '5d6e68c4a4b9361b93413f79',
        '5d6e68a8a4b9360b6c0d54e2',
        '5d6e68e6a4b9361c140bcfe0',
        '5d6e6869a4b9361c140bcfde',
        '5d6e68b3a4b9361bca7e50b5',
        '5d6e6891a4b9361bd473feea',
        '5d6e689ca4b9361bc8618956',
        '5d6e68d1a4b93622fe60e845',
        '64b8ee384b75259c590fa89b'
      ],
      maxStackableAmount: 1,
      name: 'camora_002',
      required: false
    },
    {
      compatibleItemIds: [
        '560d5e524bdc2d25448b4571',
        '5d6e6772a4b936088465b17c',
        '5d6e67fba4b9361bc73bc779',
        '5d6e6806a4b936088465b17e',
        '5d6e68dea4b9361bcc29e659',
        '5d6e6911a4b9361bd5780d52',
        '5c0d591486f7744c505b416f',
        '58820d1224597753c90aeb13',
        '5d6e68c4a4b9361b93413f79',
        '5d6e68a8a4b9360b6c0d54e2',
        '5d6e68e6a4b9361c140bcfe0',
        '5d6e6869a4b9361c140bcfde',
        '5d6e68b3a4b9361bca7e50b5',
        '5d6e6891a4b9361bd473feea',
        '5d6e689ca4b9361bc8618956',
        '5d6e68d1a4b93622fe60e845',
        '64b8ee384b75259c590fa89b'
      ],
      maxStackableAmount: 1,
      name: 'camora_003',
      required: false
    },
    {
      compatibleItemIds: [
        '560d5e524bdc2d25448b4571',
        '5d6e6772a4b936088465b17c',
        '5d6e67fba4b9361bc73bc779',
        '5d6e6806a4b936088465b17e',
        '5d6e68dea4b9361bcc29e659',
        '5d6e6911a4b9361bd5780d52',
        '5c0d591486f7744c505b416f',
        '58820d1224597753c90aeb13',
        '5d6e68c4a4b9361b93413f79',
        '5d6e68a8a4b9360b6c0d54e2',
        '5d6e68e6a4b9361c140bcfe0',
        '5d6e6869a4b9361c140bcfde',
        '5d6e68b3a4b9361bca7e50b5',
        '5d6e6891a4b9361bd473feea',
        '5d6e689ca4b9361bc8618956',
        '5d6e68d1a4b93622fe60e845',
        '64b8ee384b75259c590fa89b'
      ],
      maxStackableAmount: 1,
      name: 'camora_004',
      required: false
    }
  ],
  name: 'MTs-255-12 12ga cylinder',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '255 cyl.',
  weight: 0.25,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_12ga_cylinder'
}

export const mts25512wood: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 3,
  iconLink: 'https://assets.tarkov.dev/612781056f3d944a17348d60-icon.webp',
  id: '612781056f3d944a17348d60',
  imageLink: 'https://assets.tarkov.dev/612781056f3d944a17348d60-image.webp',
  marketLink: 'https://tarkov.dev/item/mts-255-12-wooden-stock',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'MTs-255-12 wooden stock',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.23,
  shortName: 'MTs-255 wood',
  weight: 0.45,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/MTs-255-12_wooden_stock'
}

export const nf30mm: IMod = {
  baseItemId: undefined,
  categoryId: ItemCategoryId.mod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  iconLink: 'https://assets.tarkov.dev/5b3b99265acfc4704b4a1afb-icon.webp',
  id: '5b3b99265acfc4704b4a1afb',
  imageLink: 'https://assets.tarkov.dev/5b3b99265acfc4704b4a1afb-image.webp',
  marketLink: 'https://tarkov.dev/item/nightforce-magmount-30mm-ring-scope-mount',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5b2388675acfc4771e1be0be',
        '5b3b99475acfc432ff4dcbee',
        '5a37cb10c4a282329a73b4e7',
        '57c5ac0824597754771e88a9',
        '618ba27d9008e4636a67f61d',
        '617151c1d92c473c770214ab',
        '6567e7681265c8a131069b0f'
      ],
      maxStackableAmount: 1,
      name: 'mod_scope',
      required: false
    }
  ],
  name: 'Nightforce Magmount 30mm ring scope mount',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'NF 30mm',
  weight: 0.19,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Nightforce_Magmount_30mm_ring_scope_mount'
}

export const opSksDefault: IRangedWeapon = {
  baseItemId: '587e02ff24597743df3deaeb',
  caliber: 'Caliber762x39',
  categoryId: ItemCategoryId.mainWeapon,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomics: 40,
  fireModes: ['SingleFire'],
  fireRate: 40,
  horizontalRecoil: 360,
  iconLink: 'https://assets.tarkov.dev/59dcdbb386f77417b03f350d-icon.webp',
  id: '59dcdbb386f77417b03f350d',
  imageLink: 'https://assets.tarkov.dev/59dcdbb386f77417b03f350d-image.webp',
  marketLink: 'https://tarkov.dev/item/molot-arms-simonov-op-sks-762x39-carbine-default',
  maxStackableAmount: 1,
  minuteOfAngle: 4.13,
  modSlots: [
    {
      compatibleItemIds: [
        '5d0236dad7ad1a0940739d29',
        '587e0531245977466077a0f7',
        '5afd7ded5acfc40017541f5e',
        '574dad8024597745964bf05c',
        '653ecef836fae5a82f02b869'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock',
      required: false
    },
    {
      compatibleItemIds: [
        '634eff66517ccc8a960fc735',
        '634f02331f9f536910079b51'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    },
    {
      compatibleItemIds: [
        '61695095d92c473c7702147a',
        '5c5970672e221602b21d7855',
        '587df583245977373c4f1129',
        '587df3a12459772c28142567'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '587e08ee245977446b4410cf',
        '6415d33eda439c6a97048b5b'
      ],
      maxStackableAmount: 1,
      name: 'mod_mount',
      required: false
    },
    {
      compatibleItemIds: [
        '634f06262e5def262d0b30ca',
        '634f05ca517ccc8a960fc748',
        '6415c694da439c6a97048b56'
      ],
      maxStackableAmount: 1,
      name: 'mod_reciever',
      required: false
    }
  ],
  name: 'Molot Arms Simonov OP-SKS 7.62x39 carbine Default',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'OP-SKS Default',
  verticalRecoil: 155,
  weight: 0.82,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Molot_Arms_Simonov_OP-SKS_7.62x39_carbine'
}

export const opSksDt: IMod = {
  baseItemId: undefined,
  categoryId: ItemCategoryId.mod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  iconLink: 'https://assets.tarkov.dev/587e08ee245977446b4410cf-icon.webp',
  id: '587e08ee245977446b4410cf',
  imageLink: 'https://assets.tarkov.dev/587e08ee245977446b4410cf-image.webp',
  marketLink: 'https://tarkov.dev/item/op-sks-dovetail-mount',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5947db3f86f77447880cf76f',
        '6113d6c3290d254f5e6b27db',
        '57486e672459770abd687134',
        '5c82342f2e221644f31c060e',
        '576fd4ec2459777f0b518431',
        '5c82343a2e221644f31c0611',
        '5cf638cbd7f00c06595bc936',
        '5a7c74b3e899ef0014332c29',
        '591ee00d86f774592f7b841e',
        '618a75c9a3884f56c957ca1b',
        '57acb6222459771ec34b5cb0',
        '638db77630c4240f9e06f8b6',
        '63d114019e35b334d82302f7',
        '6544d4187c5457729210d277'
      ],
      maxStackableAmount: 1,
      name: 'mod_scope',
      required: false
    }
  ],
  name: 'OP-SKS dovetail mount',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'OPSKS DT',
  weight: 0.02,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/OP-SKS_dovetail_mount'
}

export const paca: IArmor = {
  armorClass: 2,
  armoredAreas: [
    'Stomach',
    'Thorax',
    'StomachLowerBack',
    'ThoraxUpperBack',
    'StomachLeftSide',
    'StomachRightSide'
  ],
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armor,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 100,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/5648a7494bdc2d9d488b4583-icon.webp',
  id: '5648a7494bdc2d9d488b4583',
  imageLink: 'https://assets.tarkov.dev/5648a7494bdc2d9d488b4583-image.webp',
  marketLink: 'https://tarkov.dev/item/paca-soft-armor',
  material: 'Aramid',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: -0.01,
  name: 'PACA Soft Armor',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'PACA',
  turningSpeedModifierPercentage: 0,
  weight: 3.5,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/PACA_Soft_Armor'
}

export const paid: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/59e3596386f774176c10a2a2-icon.webp',
  id: '59e3596386f774176c10a2a2',
  imageLink: 'https://assets.tarkov.dev/59e3596386f774176c10a2a2-image.webp',
  marketLink: 'https://tarkov.dev/item/paid-antiroach-spray',
  maxStackableAmount: 1,
  name: 'PAID AntiRoach spray',
  presetWeight: undefined,
  prices: [],
  shortName: 'PAID',
  weight: 0.5,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/PAID_AntiRoach_spray'
}

export const pass: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/62a09cb7a04c0c5c6e0a84f8-icon.webp',
  id: '62a09cb7a04c0c5c6e0a84f8',
  imageLink: 'https://assets.tarkov.dev/62a09cb7a04c0c5c6e0a84f8-image.webp',
  marketLink: 'https://tarkov.dev/item/press-pass-issued-for-noiceguy',
  maxStackableAmount: 1,
  name: 'Press pass (issued for NoiceGuy)',
  presetWeight: undefined,
  prices: [],
  shortName: 'Pass',
  weight: 0.12,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Press_pass_(issued_for_NoiceGuy)'
}

export const plate6b33Back: IArmorMod = {
  armoredAreas: [
    'BCKPLATE'
  ],
  armorClass: 4,
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armorMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 45,
  ergonomicsModifierPercentage: -0.005,
  iconLink: 'https://assets.tarkov.dev/656efd66034e8e01c407f35c-icon.webp',
  id: '656efd66034e8e01c407f35c',
  imageLink: 'https://assets.tarkov.dev/656efd66034e8e01c407f35c-image.webp',
  marketLink: 'https://tarkov.dev/item/6b13-custom-ballistic-plates-back',
  material: 'ArmoredSteel',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: -0.025,
  name: '6B13 custom ballistic plates (Back)',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '6B13 Back',
  turningSpeedModifierPercentage: 0,
  weight: 4.1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B13_custom_ballistic_plates_(Back)'
}

export const plate6b33Front: IArmorMod = {
  armoredAreas: [
    'FRPLATE'
  ],
  armorClass: 4,
  baseItemId: undefined,
  blindnessProtectionPercentage: 0,
  categoryId: ItemCategoryId.armorMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  durability: 50,
  ergonomicsModifierPercentage: -0.01,
  iconLink: 'https://assets.tarkov.dev/656f603f94b480b8a500c0d6-icon.webp',
  id: '656f603f94b480b8a500c0d6',
  imageLink: 'https://assets.tarkov.dev/656f603f94b480b8a500c0d6-image.webp',
  marketLink: 'https://tarkov.dev/item/6b33-ballistic-plate-front',
  material: 'ArmoredSteel',
  maxStackableAmount: 1,
  modSlots: [],
  movementSpeedModifierPercentage: -0.025,
  name: '6B33 ballistic plate (Front)',
  presetArmorModifiers: undefined,
  presetWearableModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: '6B33 Front',
  turningSpeedModifierPercentage: -0.01,
  weight: 3.7,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/6B33_ballistic_plate_(Front)'
}

export const plexiglass: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/59e366c186f7741778269d85-icon.webp',
  id: '59e366c186f7741778269d85',
  imageLink: 'https://assets.tarkov.dev/59e366c186f7741778269d85-image.webp',
  marketLink: 'https://tarkov.dev/item/piece-of-plexiglass',
  maxStackableAmount: 1,
  name: 'Piece of plexiglass',
  presetWeight: undefined,
  prices: [],
  shortName: 'Plexiglass',
  weight: 0.7,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Piece_of_plexiglass'
}

export const precision: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 1,
  iconLink: 'https://assets.tarkov.dev/5fc2369685fd526b824a5713-icon.webp',
  id: '5fc2369685fd526b824a5713',
  imageLink: 'https://assets.tarkov.dev/5fc2369685fd526b824a5713-image.webp',
  marketLink: 'https://tarkov.dev/item/ar-15-b5-systems-collapsible-precision-stock',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'AR-15 B5 Systems Collapsible Precision Stock',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.24,
  shortName: 'B5 CPS',
  weight: 0.16,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/AR-15_B5_Systems_Collapsible_Precision_Stock'
}

export const pso1: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [
    '5827272a24597748c74bdeea',
    '58272b392459774b4c7b3ccd',
    '6113d6c3290d254f5e6b27db',
    '57486e672459770abd687134',
    '5947db3f86f77447880cf76f',
    '57acb6222459771ec34b5cb0',
    '591ee00d86f774592f7b841e'
  ],
  defaultPresetId: undefined,
  ergonomicsModifier: -7,
  iconLink: 'https://assets.tarkov.dev/5c82342f2e221644f31c060e-icon.webp',
  id: '5c82342f2e221644f31c060e',
  imageLink: 'https://assets.tarkov.dev/5c82342f2e221644f31c060e-image.webp',
  marketLink: 'https://tarkov.dev/item/belomo-pso-1-4x24-scope',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '57f3a5ae2459772b0e0bf19e'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical',
      required: false
    }
  ],
  name: 'BelOMO PSO-1 4x24 scope',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'PSO-1',
  weight: 0.6,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/BelOMO_PSO-1_4x24_scope'
}

export const razor: IItem = {
  categoryId: ItemCategoryId.headphones,
  conflictingItemIds: [
    '5a16b9fffcdbcb0176308b34',
    '66b5f6a28ca68c6461709ed8',
    '66b5f69ea7f72d197e70bcdb',
    '5c06c6a80db834001b735491',
    '59e7708286f7742cbd762753',
    '5b4327aa5acfc400175496e0',
    '618aef6d0a5a59657e5f55ee',
    '60b52e5bc7d8103275739d67',
    '5d96141523f0ea1b7f2aacab',
    '5aa2b9ede5b5b000137b758b'
  ],
  iconLink: 'https://assets.tarkov.dev/5e4d34ca86f774264f758330-icon.webp',
  id: '5e4d34ca86f774264f758330',
  imageLink: 'https://assets.tarkov.dev/5e4d34ca86f774264f758330-image.webp',
  marketLink: 'https://tarkov.dev/item/walkers-razor-digital-headset',
  maxStackableAmount: 1,
  name: 'Walker\'s Razor Digital headset',
  presetWeight: undefined,
  prices: [],
  shortName: 'Razor',
  weight: 0.43,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Walker%27s_Razor_Digital_headset'
}

export const rgd5: IGrenade = {
  categoryId: ItemCategoryId.grenade,
  conflictingItemIds: [],
  explosionDelay: 3.5,
  fragmentsAmount: 70,
  iconLink: 'https://assets.tarkov.dev/5448be9a4bdc2dfd2f8b456a-icon.webp',
  id: '5448be9a4bdc2dfd2f8b456a',
  imageLink: 'https://assets.tarkov.dev/5448be9a4bdc2dfd2f8b456a-image.webp',
  marketLink: 'https://tarkov.dev/item/rgd-5-hand-grenade',
  maximumExplosionRange: 7,
  maxStackableAmount: 1,
  minimumExplosionRange: 3,
  name: 'RGD-5 hand grenade',
  presetWeight: undefined,
  prices: [],
  shortName: 'RGD-5',
  type: 'Grenade',
  weight: 0.31,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RGD-5_hand_grenade'
}

export const rooster: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5bc9bc53d4351e00367fbcee-icon.webp',
  id: '5bc9bc53d4351e00367fbcee',
  imageLink: 'https://assets.tarkov.dev/5bc9bc53d4351e00367fbcee-image.webp',
  marketLink: 'https://tarkov.dev/item/golden-rooster-figurine',
  maxStackableAmount: 1,
  name: 'Golden rooster figurine',
  presetWeight: undefined,
  prices: [],
  shortName: 'Rooster',
  weight: 3.8,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Golden_rooster_figurine'
}

export const rpk16: IRangedWeapon = {
  baseItemId: undefined,
  caliber: 'Caliber545x39',
  categoryId: ItemCategoryId.mainWeapon,
  conflictingItemIds: [],
  defaultPresetId: '5c0d1ec986f77439512a1a72',
  ergonomics: 45,
  fireModes: [
    'SingleFire',
    'FullAuto'
  ],
  fireRate: 650,
  horizontalRecoil: 333,
  iconLink: 'https://assets.tarkov.dev/5beed0f50db834001c062b12-icon.webp',
  id: '5beed0f50db834001c062b12',
  imageLink: 'https://assets.tarkov.dev/5beed0f50db834001c062b12-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-545x39-light-machine-gun',
  maxStackableAmount: 1,
  minuteOfAngle: undefined,
  modSlots: [
    {
      compatibleItemIds: [
        '5beec8ea0db834001a6f9dbf',
        '5649ad3f4bdc2df8348b4585',
        '5649ade84bdc2d1b2b8b4587',
        '59e62cc886f77440d40b52a1',
        '5a0071d486f77404e23a12b2',
        '57e3dba62459770f0c32322b',
        '5cf54404d7f00c108840b2ef',
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
        '628a664bccaab13006640e47',
        '628c9ab845c59e5b80768a81',
        '5e2192a498a36665e8337386',
        '6087e663132d4d12c81fd96b',
        '5f6341043ada5942720e2dc5',
        '63f4da90f31d4a33b87bd054',
        '648ae3e356c6310a830fc291',
        '651580dc71a4f10aec4b6056'
      ],
      maxStackableAmount: 1,
      name: 'mod_pistol_grip',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec91a0db834001961942d'
      ],
      maxStackableAmount: 1,
      name: 'mod_reciever',
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
        '5bed625c0db834001c062946',
        '64b9e265c94d0d15c5027e35',
        '649ec30cb013f04a700e60fb'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '6130ca3fd92c473c77020dbd',
        '5648ac824bdc2ded0b8b457d'
      ],
      maxStackableAmount: 1,
      name: 'mod_charge',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec8b20db834001961942a',
        '649ec87d8007560a9001ab36',
        '6761779c48fa5c377e06fc3f'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock_001',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec3e30db8340019619424'
      ],
      maxStackableAmount: 1,
      name: 'mod_handguard',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec1bd0db834001e6006f3',
        '5beec2820db834001b095426'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    }
  ],
  name: 'RPK-16 5.45x39 light machine gun',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'RPK-16',
  verticalRecoil: 112,
  weight: 1.5,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_light_machine_gun'
}

export const rpk16Default: IRangedWeapon = {
  baseItemId: '5beed0f50db834001c062b12',
  caliber: 'Caliber545x39',
  categoryId: ItemCategoryId.mainWeapon,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomics: 45,
  fireModes: [
    'SingleFire',
    'FullAuto'
  ],
  fireRate: 650,
  horizontalRecoil: 333,
  iconLink: 'https://assets.tarkov.dev/5c0d1ec986f77439512a1a72-icon.webp',
  id: '5c0d1ec986f77439512a1a72',
  imageLink: 'https://assets.tarkov.dev/5c0d1ec986f77439512a1a72-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-545x39-light-machine-gun-default',
  maxStackableAmount: 1,
  minuteOfAngle: 3.03,
  modSlots: [
    {
      compatibleItemIds: [
        '5beec8ea0db834001a6f9dbf',
        '5649ad3f4bdc2df8348b4585',
        '5649ade84bdc2d1b2b8b4587',
        '59e62cc886f77440d40b52a1',
        '5a0071d486f77404e23a12b2',
        '57e3dba62459770f0c32322b',
        '5cf54404d7f00c108840b2ef',
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
        '628a664bccaab13006640e47',
        '628c9ab845c59e5b80768a81',
        '5e2192a498a36665e8337386',
        '6087e663132d4d12c81fd96b',
        '5f6341043ada5942720e2dc5',
        '63f4da90f31d4a33b87bd054',
        '648ae3e356c6310a830fc291',
        '651580dc71a4f10aec4b6056'
      ],
      maxStackableAmount: 1,
      name: 'mod_pistol_grip',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec91a0db834001961942d'
      ],
      maxStackableAmount: 1,
      name: 'mod_reciever',
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
        '5bed625c0db834001c062946',
        '64b9e265c94d0d15c5027e35',
        '649ec30cb013f04a700e60fb'
      ],
      maxStackableAmount: 1,
      name: 'mod_magazine',
      required: false
    },
    {
      compatibleItemIds: [
        '6130ca3fd92c473c77020dbd',
        '5648ac824bdc2ded0b8b457d'
      ],
      maxStackableAmount: 1,
      name: 'mod_charge',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec8b20db834001961942a',
        '649ec87d8007560a9001ab36',
        '6761779c48fa5c377e06fc3f'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock_001',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec3e30db8340019619424'
      ],
      maxStackableAmount: 1,
      name: 'mod_handguard',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec1bd0db834001e6006f3',
        '5beec2820db834001b095426'
      ],
      maxStackableAmount: 1,
      name: 'mod_barrel',
      required: false
    }
  ],
  name: 'RPK-16 5.45x39 light machine gun Default',
  presetRangedWeaponModifiers: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'RPK-16 Default',
  verticalRecoil: 112,
  weight: 1.5,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_light_machine_gun'
}

export const rpk1615inch: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -2,
  iconLink: 'https://assets.tarkov.dev/5beec1bd0db834001e6006f3-icon.webp',
  id: '5beec1bd0db834001e6006f3',
  imageLink: 'https://assets.tarkov.dev/5beec1bd0db834001e6006f3-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-545x39-15-inch-barrel',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5ac72e945acfc43f3b691116',
        '5ac7655e5acfc40016339a19',
        '5649aa744bdc2ded0b8b457e',
        '5943eeeb86f77412d6384f6b',
        '5cc9a96cd7f00c011c04e04a',
        '5649ab884bdc2ded0b8b457f',
        '5beec3420db834001b095429',
        '593d493f86f7745e6b2ceb22',
        '564caa3d4bdc2d17108b458e'
      ],
      maxStackableAmount: 1,
      name: 'mod_muzzle',
      required: false
    }
  ],
  name: 'RPK-16 5.45x39 15 inch barrel',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.03,
  shortName: 'RPK-16 15"',
  weight: 0.54,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_15_inch_barrel'
}

export const rpk16Drum: IMagazine = {
  acceptedAmmunitionIds: [
    '5c0d5e4486f77478390952fe',
    '61962b617c6c7b169525f168',
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
  baseItemId: undefined,
  capacity: 95,
  categoryId: ItemCategoryId.magazine,
  checkSpeedModifierPercentage: 0.25,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -24,
  iconLink: 'https://assets.tarkov.dev/5bed625c0db834001c062946-icon.webp',
  id: '5bed625c0db834001c062946',
  imageLink: 'https://assets.tarkov.dev/5bed625c0db834001c062946-image.webp',
  loadSpeedModifierPercentage: 0.9,
  malfunctionPercentage: 0.394,
  marketLink: 'https://tarkov.dev/item/rpk-16-545x39-95-round-drum-magazine',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'RPK-16 5.45x39 95-round drum magazine',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'RPK-16 drum',
  weight: 0.68,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_95-round_drum_magazine'
}

export const rpk16DustCover: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 4,
  iconLink: 'https://assets.tarkov.dev/5beec91a0db834001961942d-icon.webp',
  id: '5beec91a0db834001961942d',
  imageLink: 'https://assets.tarkov.dev/5beec91a0db834001961942d-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-dust-cover',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '57ac965c24597706be5f975c',
        '57aca93d2459771f2c7e26db',
        '544a3a774bdc2d3a388b4567',
        '5d2dc3e548f035404a1a4798',
        '57adff4f24597737f373b6e6',
        '5c0517910db83400232ffee5',
        '591c4efa86f7741030027726',
        '570fd79bd2720bc7458b4583',
        '570fd6c2d2720bc6458b457f',
        '558022b54bdc2dac148b458d',
        '5c07dd120db834001c39092d',
        '5c0a2cec0db834001b7ce47d',
        '58491f3324597764bc48fa02',
        '584924ec24597768f12ae244',
        '5b30b0dc5acfc400153b7124',
        '6165ac8c290d254f5e6b2f6c',
        '60a23797a37c940de7062d02',
        '5d2da1e948f035477b1ce2ba',
        '5c0505e00db834001b735073',
        '609a63b6e2ff132951242d09',
        '584984812459776a704a82a6',
        '59f9d81586f7744c7506ee62',
        '570fd721d2720bc5458b4596',
        '57ae0171245977343c27bfcf',
        '5dfe6104585a0c3e995c7b82',
        '5d1b5e94d7ad1a2b865a96b0',
        '609bab8b455afd752b2e6138',
        '58d39d3d86f77445bb794ae7',
        '616554fe50224f204c1da2aa',
        '5c7d55f52e221644f31bff6a',
        '616584766ef05c2ce828ef57',
        '5b3b6dc75acfc47a8773fb1e',
        '615d8d878004cc50514c3233',
        '5b2389515acfc4771e1be0c0',
        '577d128124597739d65d0e56',
        '618b9643526131765025ab35',
        '618bab21526131765025ab3f',
        '5c86592b2e2216000e69e77c',
        '5a37ca54c4a282000d72296a',
        '5d0a29fed7ad1a002769ad08',
        '5c064c400db834001d23f468',
        '58d2664f86f7747fec5834f6',
        '57c69dd424597774c03b7bbc',
        '5b3b99265acfc4704b4a1afb',
        '5aa66a9be5b5b0214e506e89',
        '5aa66c72e5b5b00016327c93',
        '5c1cdd302e221602b3137250',
        '61714b2467085e45ef140b2c',
        '6171407e50224f204c1da3c5',
        '61713cc4d8e3106d9806c109',
        '5b31163c5acfc400153b71cb',
        '5a33b652c4a28232996e407c',
        '5a33b2c9c4a282000c5a9511',
        '59db7eed86f77461f8380365',
        '5a1ead28fcdbcb001912fa9f',
        '5dff77c759400025ea5150cf',
        '626bb8532c923541184624b4',
        '62811f461d5df4475f46a332',
        '63fc449f5bd61c6cf3784a88',
        '6477772ea8a38bb2050ed4db',
        '6478641c19d732620e045e17',
        '64785e7c19d732620e045e15',
        '65392f611406374f82152ba5',
        '653931da5db71d30ab1d6296',
        '655f13e0a246670fb0373245',
        '6567e751a715f85433025998',
        '67641a851b2899700609901a',
        '6761759e7ee06333f108bf86'
      ],
      maxStackableAmount: 1,
      name: 'mod_scope',
      required: false
    },
    {
      compatibleItemIds: [
        '5beec9450db83400970084fd'
      ],
      maxStackableAmount: 1,
      name: 'mod_sight_rear',
      required: false
    }
  ],
  name: 'RPK-16 dust cover',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'RPK-16',
  weight: 0.215,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_dust_cover'
}

export const rpk16Handguard: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 6,
  iconLink: 'https://assets.tarkov.dev/5beec3e30db8340019619424-icon.webp',
  id: '5beec3e30db8340019619424',
  imageLink: 'https://assets.tarkov.dev/5beec3e30db8340019619424-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-handguard',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5beecbb80db834001d2c465e'
      ],
      maxStackableAmount: 1,
      name: 'mod_mount_000',
      required: false
    },
    {
      compatibleItemIds: [
        '5beecbb80db834001d2c465e'
      ],
      maxStackableAmount: 1,
      name: 'mod_mount_001',
      required: false
    },
    {
      compatibleItemIds: [
        '558022b54bdc2dac148b458d',
        '58491f3324597764bc48fa02',
        '584924ec24597768f12ae244',
        '5b30b0dc5acfc400153b7124',
        '6165ac8c290d254f5e6b2f6c',
        '584984812459776a704a82a6',
        '59f9d81586f7744c7506ee62',
        '570fd721d2720bc5458b4596',
        '57ae0171245977343c27bfcf',
        '58d39d3d86f77445bb794ae7',
        '616554fe50224f204c1da2aa',
        '615d8d878004cc50514c3233',
        '577d128124597739d65d0e56',
        '58d2664f86f7747fec5834f6',
        '5649a2464bdc2d91118b45a8',
        '61714b2467085e45ef140b2c',
        '5b31163c5acfc400153b71cb',
        '5a33b652c4a28232996e407c',
        '5a33b2c9c4a282000c5a9511',
        '64785e7c19d732620e045e15',
        '655f13e0a246670fb0373245'
      ],
      maxStackableAmount: 1,
      name: 'mod_scope',
      required: false
    },
    {
      compatibleItemIds: [
        '5c7fc87d2e221644f31c0298',
        '5cda9bcfd7f00c0c0b53e900',
        '59f8a37386f7747af3328f06',
        '619386379fb0c665d5490dbe',
        '5c87ca002e221600114cb150',
        '588226d124597767ad33f787',
        '588226dd24597767ad33f789',
        '588226e62459776e3e094af7',
        '588226ef24597767af46e39c',
        '59fc48e086f77463b1118392',
        '5fce0cf655375d18a253eff0',
        '5cf4fb76d7f00c065703d3ac',
        '5b057b4f5acfc4771e1bd3e9',
        '5c791e872e2216001219c40a',
        '558032614bdc2de7118b4585',
        '58c157be86f77403c74b2bb6',
        '58c157c886f774032749fb06',
        '5f6340d3ca442212f4047eb2',
        '591af28e86f77414a27a9e1d',
        '5c1cd46f2e22164bef5cfedb',
        '5c1bc4812e22164bef5cfde7',
        '5c1bc5612e221602b5429350',
        '5c1bc5af2e221602b412949b',
        '5c1bc5fb2e221602b1779b32',
        '5c1bc7432e221602b412949d',
        '5c1bc7752e221602b1779b34',
        '64806bdd26c80811d408d37a',
        '64807a29e5ffe165600abc97',
        '648067db042be0705c0b3009',
        '65169d5b30425317755f8e25',
        '655df24fdf80b12750626d0a',
        '655dccfdbdcc6b5df71382b6',
        '661e52e29c8b4dadef008577',
        '661e53149c8b4dadef008579',
        '661e52415be02310ed07a07a',
        '661e52b5b099f32c28003586'
      ],
      maxStackableAmount: 1,
      name: 'mod_foregrip',
      required: false
    },
    {
      compatibleItemIds: [
        '57fd23e32459772d0805bcf1',
        '544909bb4bdc2d6f028b4577',
        '5c06595c0db834001a66af6c',
        '5a7b483fe899ef0016170d15',
        '61605d88ffa6e502ac5e7eeb',
        '5c5952732e2216398b5abda2',
        '644a3df63b0b6f03e101e065'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical_000',
      required: false
    }
  ],
  name: 'RPK-16 handguard',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.01,
  shortName: 'RPK-16',
  weight: 0.167,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_handguard'
}

export const rpk16MuzzleBreak: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  iconLink: 'https://assets.tarkov.dev/5beec3420db834001b095429-icon.webp',
  id: '5beec3420db834001b095429',
  imageLink: 'https://assets.tarkov.dev/5beec3420db834001b095429-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-545x39-muzzle-brake-compensator',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'RPK-16 5.45x39 muzzle brake-compensator',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.06,
  shortName: 'RPK-16',
  weight: 0.09,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_5.45x39_muzzle_brake-compensator'
}

export const rpk16Rail: IMod = {
  baseItemId: undefined,
  categoryId: ItemCategoryId.mod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/5beecbb80db834001d2c465e-icon.webp',
  id: '5beecbb80db834001d2c465e',
  imageLink: 'https://assets.tarkov.dev/5beecbb80db834001d2c465e-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-handguard-rail',
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
        '626becf9582c3e319310b837',
        '644a3df63b0b6f03e101e065',
        '646f6322f43d0c5d62063715'
      ],
      maxStackableAmount: 1,
      name: 'mod_tactical_000',
      required: false
    }
  ],
  name: 'RPK-16 handguard rail',
  presetErgonomicsModifier: undefined,
  presetWeight: undefined,
  prices: [],
  shortName: 'RPK-16 rail',
  weight: 0.045,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_handguard_rail'
}

export const rpk16Rs: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/5bf3f59f0db834001a6fa060-icon.webp',
  id: '5bf3f59f0db834001a6fa060',
  imageLink: 'https://assets.tarkov.dev/5bf3f59f0db834001a6fa060-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-rear-sight',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'RPK-16 rear sight',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'RPK-16 RS',
  weight: 0.025,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_rear_sight'
}

export const rpk16RsBase: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [
    '5b3b99265acfc4704b4a1afb'
  ],
  defaultPresetId: undefined,
  ergonomicsModifier: 0,
  iconLink: 'https://assets.tarkov.dev/5beec9450db83400970084fd-icon.webp',
  id: '5beec9450db83400970084fd',
  imageLink: 'https://assets.tarkov.dev/5beec9450db83400970084fd-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-rear-sight-base',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [
        '5ac733a45acfc400192630e2',
        '5649b0544bdc2d1b2b8b458a',
        '5ac72e475acfc400180ae6fe',
        '5bf3f59f0db834001a6fa060',
        '649ec2cec93611967b03495e',
        '628a7b23b0f75035732dd565'
      ],
      maxStackableAmount: 1,
      name: 'mod_sight_rear',
      required: false
    }
  ],
  name: 'RPK-16 rear sight base',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'RPK16 RS base',
  weight: 0.05,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_rear_sight_base'
}

export const rpk16Tube: IRangedWeaponMod = {
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5beec8b20db834001961942a-icon.webp',
  id: '5beec8b20db834001961942a',
  imageLink: 'https://assets.tarkov.dev/5beec8b20db834001961942a-image.webp',
  marketLink: 'https://tarkov.dev/item/rpk-16-buffer-tube',
  maxStackableAmount: 1,
  name: 'RPK-16 buffer tube',
  prices: [],
  shortName: 'RPK-16 tube',
  weight: 0.142,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/RPK-16_buffer_tube',
  baseItemId: undefined,
  defaultPresetId: undefined,
  modSlots: [
    {
      compatibleItemIds: [
        '602e620f9b513876d4338d9a',
        '5a9eb32da2750c00171b3f9c',
        '5bfe86df0db834001b734685',
        '55d4ae6c4bdc2d8b2f8b456e',
        '5c87a07c2e2216001219d4a2',
        '5bb20e70d4351e0035629f8f',
        '5beec8c20db834001d2c465c',
        '5ae30c9a5acfc408fb139a03',
        '5d135e83d7ad1a21b83f42d8',
        '5d135ecbd7ad1a21c176542e',
        '56eabf3bd2720b75698b4569',
        '58d2946386f774496974c37e',
        '58d2946c86f7744e271174b5',
        '58d2947686f774485c6a1ee5',
        '58d2947e86f77447aa070d53',
        '5947c73886f7747701588af5',
        '5c793fde2e221601da358614',
        '5b39f8db5acfc40016387a1b',
        '5fbbaa86f9986c4cff3fe5f6',
        '5fce16961f152d4312622bc9',
        '5fc2369685fd526b824a5713',
        '606587d11246154cad35d635',
        '628a85ee6b1d481ff772e9d5',
        '5d44069ca4b9361ebd26fc37',
        '5d4406a8a4b9361e4f6eb8b7',
        '6529370c405a5f51dd023db8'
      ],
      maxStackableAmount: 1,
      name: 'mod_stock',
      required: false
    }
  ],
  ergonomicsModifier: 0,
  presetErgonomicsModifier: undefined,
  accuracyModifierPercentage: 0,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  recoilModifierPercentage: -0.01
}

export const rub: IItem = {
  categoryId: ItemCategoryId.currency,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5449016a4bdc2d6f028b456f-icon.webp',
  id: '5449016a4bdc2d6f028b456f',
  imageLink: 'https://assets.tarkov.dev/5449016a4bdc2d6f028b456f-image.webp',
  marketLink: 'https://tarkov.dev/item/roubles',
  maxStackableAmount: 500000,
  name: 'Roubles',
  presetWeight: undefined,
  prices: [],
  shortName: 'RUB',
  weight: 0,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Roubles'
}

export const salewa: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/544fb45d4bdc2dee738b4568-icon.webp',
  id: '544fb45d4bdc2dee738b4568',
  imageLink: 'https://assets.tarkov.dev/544fb45d4bdc2dee738b4568-image.webp',
  marketLink: 'https://tarkov.dev/item/salewa-first-aid-kit',
  maxStackableAmount: 1,
  name: 'Salewa first aid kit',
  presetWeight: undefined,
  prices: [],
  shortName: 'Salewa',
  weight: 0.6,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Salewa_first_aid_kit'
}

export const scavVest: IVest = {
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
  presetWeight: undefined,
  prices: [],
  shortName: 'Scav Vest',
  turningSpeedModifierPercentage: 0,
  weight: 0.4,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Scav_Vest'
}

export const slickers: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/544fb6cc4bdc2d34748b456e-icon.webp',
  id: '544fb6cc4bdc2d34748b456e',
  imageLink: 'https://assets.tarkov.dev/544fb6cc4bdc2d34748b456e-image.webp',
  marketLink: 'https://tarkov.dev/item/slickers-chocolate-bar',
  maxStackableAmount: 1,
  name: 'Slickers chocolate bar',
  presetWeight: undefined,
  prices: [],
  shortName: 'Slickers',
  weight: 0.048,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Slickers_chocolate_bar'
}

export const specterDr: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -4,
  iconLink: 'https://assets.tarkov.dev/57ac965c24597706be5f975c-icon.webp',
  id: '57ac965c24597706be5f975c',
  imageLink: 'https://assets.tarkov.dev/57ac965c24597706be5f975c-image.webp',
  marketLink: 'https://tarkov.dev/item/elcan-specterdr-1x4x-scope',
  maxStackableAmount: 1,
  modSlots: [
    {
      compatibleItemIds: [],
      maxStackableAmount: 1,
      name: 'mod_mount',
      required: false
    }
  ],
  name: 'ELCAN SpecterDR 1x/4x scope',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'SpecterDR',
  weight: 0.64,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/ELCAN_SpecterDR_1x/4x_scope'
}

export const srd9: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -15,
  iconLink: 'https://assets.tarkov.dev/5c6165902e22160010261b28-icon.webp',
  id: '5c6165902e22160010261b28',
  imageLink: 'https://assets.tarkov.dev/5c6165902e22160010261b28-image.webp',
  marketLink: 'https://tarkov.dev/item/sig-sauer-srd9-9x19-sound-suppressor',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'SIG Sauer SRD9 9x19 sound suppressor',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: -0.06,
  shortName: 'SRD9',
  weight: 0.255,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/SIG_Sauer_SRD9_9x19_sound_suppressor'
}

export const syringe: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5d1b3f2d86f774253763b735-icon.webp',
  id: '5d1b3f2d86f774253763b735',
  imageLink: 'https://assets.tarkov.dev/5d1b3f2d86f774253763b735-image.webp',
  marketLink: 'https://tarkov.dev/item/disposable-syringe',
  maxStackableAmount: 1,
  name: 'Disposable syringe',
  presetWeight: undefined,
  prices: [],
  shortName: 'Syringe',
  weight: 0.06,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Disposable_syringe'
}

export const usd: IItem = {
  categoryId: ItemCategoryId.currency,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5696686a4bdc2da3298b456a-icon.webp',
  id: '5696686a4bdc2da3298b456a',
  imageLink: 'https://assets.tarkov.dev/5696686a4bdc2da3298b456a-image.webp',
  marketLink: 'https://tarkov.dev/item/dollars',
  maxStackableAmount: 50000,
  name: 'Dollars',
  presetWeight: undefined,
  prices: [],
  shortName: 'USD',
  weight: 0,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Dollars'
}

export const vaseline: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5755383e24597772cb798966-icon.webp',
  id: '5755383e24597772cb798966',
  imageLink: 'https://assets.tarkov.dev/5755383e24597772cb798966-image.webp',
  marketLink: 'https://tarkov.dev/item/vaseline-balm',
  maxStackableAmount: 1,
  name: 'Vaseline balm',
  presetWeight: undefined,
  prices: [],
  shortName: 'Vaseline',
  weight: 0.016,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Vaseline_balm'
}

export const vhs: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/62a09e974f842e1bd12da3f0-icon.webp',
  id: '62a09e974f842e1bd12da3f0',
  imageLink: 'https://assets.tarkov.dev/62a09e974f842e1bd12da3f0-image.webp',
  marketLink: 'https://tarkov.dev/item/video-cassette-with-the-cyborg-killer-movie',
  maxStackableAmount: 1,
  name: 'Video cassette with the Cyborg Killer movie',
  presetWeight: undefined,
  prices: [],
  shortName: 'VHS',
  weight: 0.15,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Video_cassette_with_the_Cyborg_Killer_movie'
}

export const vita: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/57513fcc24597720a31c09a6-icon.webp',
  id: '57513fcc24597720a31c09a6',
  imageLink: 'https://assets.tarkov.dev/57513fcc24597720a31c09a6-image.webp',
  marketLink: 'https://tarkov.dev/item/pack-of-vita-juice',
  maxStackableAmount: 1,
  name: 'Pack of Vita juice',
  presetWeight: undefined,
  prices: [],
  shortName: 'Vita',
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Pack_of_Vita_juice'
}

export const water: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-icon.webp',
  id: '5448fee04bdc2dbc018b4567',
  imageLink: 'https://assets.tarkov.dev/5448fee04bdc2dbc018b4567-image.webp',
  marketLink: 'https://tarkov.dev/item/bottle-of-water-06l',
  maxStackableAmount: 1,
  name: 'Bottle of water (0.6L)',
  presetWeight: undefined,
  prices: [],
  shortName: 'Water',
  weight: 0.65,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Bottle_of_water_(0.6L)'
}

export const wParts: IItem = {
  categoryId: ItemCategoryId.other,
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5d1c819a86f774771b0acd6c-icon.webp',
  id: '5d1c819a86f774771b0acd6c',
  imageLink: 'https://assets.tarkov.dev/5d1c819a86f774771b0acd6c-image.webp',
  marketLink: 'https://tarkov.dev/item/weapon-parts',
  maxStackableAmount: 1,
  name: 'Weapon parts',
  presetWeight: undefined,
  prices: [],
  shortName: 'WParts',
  weight: 0.56,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Weapon_parts'
}

export const x400: IRangedWeaponMod = {
  accuracyModifierPercentage: 0,
  baseItemId: undefined,
  categoryId: ItemCategoryId.rangedWeaponMod,
  conflictingItemIds: [],
  defaultPresetId: undefined,
  ergonomicsModifier: -1,
  iconLink: 'https://assets.tarkov.dev/56def37dd2720bec348b456a-icon.webp',
  id: '56def37dd2720bec348b456a',
  imageLink: 'https://assets.tarkov.dev/56def37dd2720bec348b456a-image.webp',
  marketLink: 'https://tarkov.dev/item/surefire-x400-ultra-tactical-flashlight-with-laser',
  maxStackableAmount: 1,
  modSlots: [],
  name: 'SureFire X400 Ultra tactical flashlight with laser',
  presetErgonomicsModifier: undefined,
  presetRecoilModifierPercentage: undefined,
  presetWeight: undefined,
  prices: [],
  recoilModifierPercentage: 0,
  shortName: 'X400U',
  weight: 0.138,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/SureFire_X400_Ultra_tactical_flashlight_with_laser'
}



export const ItemMocks: IItem[] = [
  ak12bt,
  ak12PistolGrip,
  ak12Stock,
  alkali,
  alpha,
  ammo1270Magnum,
  ammo545bp,
  ammo545us,
  ammo9mmGT,
  aquamari,
  armbandBlue,
  armor6b13Fl,
  armor6b13FlDefault,
  banshee,
  bansheeDefault,
  bayonet6Kh5,
  berkut,
  capacitors,
  cf,
  cqcm,
  crossbow,
  cultLocust,
  ekp802dt,
  erBayonet,
  esLamp,
  eur,
  ewr,
  filter,
  h2o2,
  halfMask,
  iskra,
  k1s,
  k1sVisor,
  kotton,
  lshZ2dtm,
  lshZ2dtmFs,
  m9a3,
  m9a3Prot,
  m9a3Default,
  m9a3Fs,
  m9a3Magazine,
  m9a3Rs,
  m9a3SideGrip,
  m9a3Slide,
  m9a3Thr,
  magazine6l20,
  mechanism,
  monocletePe,
  morphine,
  ms2000,
  mts25512,
  mts25512755mmRib,
  mts25512beech,
  mts25512choke,
  mts25512cyl,
  mts25512Default,
  mts25512wood,
  nf30mm,
  opSksDefault,
  opSksDt,
  paca,
  paid,
  pass,
  plate6b33Back,
  plate6b33Front,
  plexiglass,
  precision,
  pso1,
  razor,
  rgd5,
  rooster,
  rpk16,
  rpk1615inch,
  rpk16Default,
  rpk16Drum,
  rpk16DustCover,
  rpk16Handguard,
  rpk16MuzzleBreak,
  rpk16Rail,
  rpk16Rs,
  rpk16RsBase,
  rpk16Tube,
  rub,
  salewa,
  scavVest,
  slickers,
  specterDr,
  srd9,
  syringe,
  usd,
  vaseline,
  vhs,
  vita,
  water,
  wParts,
  x400
]