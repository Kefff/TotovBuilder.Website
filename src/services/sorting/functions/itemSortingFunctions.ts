import Images from '../../../images'
import { IAmmunition } from '../../../models/item/IAmmunition'
import { IArmor } from '../../../models/item/IArmor'
import { IContainer } from '../../../models/item/IContainer'
import { IEyewear } from '../../../models/item/IEyewear'
import { IGrenade } from '../../../models/item/IGrenade'
import { IHeadwear } from '../../../models/item/IHeadwear'
import { IItem, ItemCategoryId } from '../../../models/item/IItem'
import { IMagazine } from '../../../models/item/IMagazine'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import { IMod } from '../../../models/item/IMod'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import { IWearable } from '../../../models/item/IWearable'
import { InventoryItemService } from '../../InventoryItemService'
import Services from '../../repository/Services'
import { compareByNumber, compareByString } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting items.
 */
export const ItemSortingFunctions: IItemSortingFunctionList = {
  itemCategoryIds: [
    ItemCategoryId.armband,
    ItemCategoryId.currency,
    ItemCategoryId.headphones,
    ItemCategoryId.other,
    ItemCategoryId.special
  ],
  functions: {
    categoryId: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByString(i1 as IItem, iv1, i2 as IItem, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IItem).categoryId),
      customIcon: undefined,
      icon: 'id-card'
    },
    name: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByString(i1 as IItem, iv1, i2 as IItem, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(i.name),
      customIcon: undefined,
      icon: 'font'
    },
    price: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: async (i) => await getPriceAsync(i as IItem),
      customIcon: undefined,
      icon: 'ruble-sign'
    },
    weight: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IItem).presetWeight ?? i.weight),
      customIcon: undefined,
      icon: 'weight-hanging'
    }
  }
}

export const AmmunitionSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    accuracyModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).accuracyModifierPercentage),
      customIcon: undefined,
      icon: 'bullseye'
    },
    fleshDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).fleshDamage * (i as IAmmunition).projectiles),
      customIcon: undefined,
      icon: 'heart-broken'
    },
    fragmentationChance: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).fragmentationChance),
      customIcon: undefined,
      icon: 'viruses'
    },
    penetratedArmorLevel: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).penetrationPower), // Since the penetratedArmorLevel is calculated from the penetrationPower, we can sort by penetrationPower which is more precise
      customIcon: undefined,
      icon: 'award'
    },
    penetrationPower: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).penetrationPower),
      customIcon: undefined,
      icon: 'bolt'
    },
    recoilModifier: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).recoilModifier),
      customIcon: undefined,
      icon: 'arrows-alt'
    },
    velocity: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IAmmunition).velocity),
      customIcon: undefined,
      icon: 'wind'
    }
  },
  itemCategoryIds: [ItemCategoryId.ammunition]
}

export const ContainerSortingFunctions: IItemSortingFunctionList = {
  itemCategoryIds: [ItemCategoryId.container, ItemCategoryId.securedContainer],
  functions: {
    ...ItemSortingFunctions.functions,
    capacity: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IContainer).capacity),
      customIcon: undefined,
      icon: 'box-open'
    }
  }
}

export const ModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    ergonomicsModifier: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IMod).presetErgonomicsModifier
        ?? (i as IMod).ergonomicsModifier),
      customIcon: undefined,
      icon: 'hand-paper'
    }
  },
  itemCategoryIds: [ItemCategoryId.mod]
}

export const WearableSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    ergonomicsModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IWearable).presetWearableModifiers?.ergonomicsModifierPercentage
        ?? (i as IWearable).ergonomicsModifierPercentage),
      customIcon: undefined,
      icon: 'hand-paper'
    },
    movementSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IWearable).presetWearableModifiers?.movementSpeedModifierPercentage
        ?? (i as IWearable).movementSpeedModifierPercentage),
      customIcon: undefined,
      icon: 'walking'
    },
    turningSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IWearable).presetWearableModifiers?.turningSpeedModifierPercentage
        ?? (i as IWearable).turningSpeedModifierPercentage),
      customIcon: undefined,
      icon: 'undo'
    }
  },
  itemCategoryIds: []
}

export const ArmorSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...WearableSortingFunctions.functions,
    armorClass: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IArmor).presetArmorModifiers?.armorClass ?? (i as IArmor).armorClass),
      customIcon: undefined,
      icon: 'award'
    },
    durability: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IArmor).presetArmorModifiers?.durability ?? (i as IArmor).durability),
      customIcon: undefined,
      icon: 'heart'
    }
  },
  itemCategoryIds: [ItemCategoryId.armor]
}

export const ArmorModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions
  },
  itemCategoryIds: [ItemCategoryId.armorMod]
}

export const BackpackSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ContainerSortingFunctions.functions,
    ...WearableSortingFunctions.functions
  },
  itemCategoryIds: [ItemCategoryId.backpack]
}

export const EyewearSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    blindnessProtectionPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IEyewear).blindnessProtectionPercentage),
      customIcon: undefined,
      icon: 'low-vision'
    }
  },
  itemCategoryIds: [ItemCategoryId.eyewear]
}

export const GrenadeSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    explosionDelay: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IGrenade).explosionDelay),
      customIcon: undefined,
      icon: 'stopwatch'
    },
    fragmentsAmount: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IGrenade).fragmentsAmount),
      customIcon: undefined,
      icon: 'viruses'
    },
    maximumExplosionRange: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IGrenade).maximumExplosionRange),
      customIcon: undefined,
      icon: 'dot-circle'
    }
  },
  itemCategoryIds: [ItemCategoryId.grenade]
}

export const HeadwearSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions,
    ricochetChance: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(ricochetChances[(i as IHeadwear).ricochetChance ?? 'None']),
      customIcon: Images['ricochet'],
      icon: undefined
    }
  },
  itemCategoryIds: [
    ItemCategoryId.faceCover,
    ItemCategoryId.headwear
  ]
}

const ricochetChances: { [ricocherChance: string]: number } = {
  None: 0,
  Low: 1,
  Medium: 2,
  High: 3
}

export const MagazineSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ContainerSortingFunctions.functions,
    ...ModSortingFunctions.functions,
    checkSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IMagazine).checkSpeedModifierPercentage),
      customIcon: undefined,
      icon: 'eye'
    },
    loadSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IMagazine).loadSpeedModifierPercentage),
      customIcon: undefined,
      icon: 'sync-alt'
    },
    malfunctionPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IMagazine).malfunctionPercentage),
      customIcon: undefined,
      icon: 'exclamation'
    }
  },
  itemCategoryIds: [ItemCategoryId.magazine]
}

export const MeleeWeaponSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    chopDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IMeleeWeapon).chopDamage),
      customIcon: Images['chop'],
      icon: undefined
    },
    hitRadius: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IMeleeWeapon).hitRadius),
      customIcon: undefined,
      icon: 'dot-circle'
    },
    stabDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IMeleeWeapon).stabDamage),
      customIcon: Images['stab'],
      icon: undefined
    }
  },
  itemCategoryIds: [ItemCategoryId.meleeWeapon]
}

export const RangedWeaponModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ModSortingFunctions.functions,
    accuracyModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IRangedWeaponMod).accuracyModifierPercentage),
      customIcon: undefined,
      icon: 'bullseye'
    },
    recoilModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IRangedWeaponMod).presetRecoilModifierPercentage
        ?? (i as IRangedWeaponMod).recoilModifierPercentage),
      customIcon: undefined,
      icon: 'arrows-alt'
    }
  },
  itemCategoryIds: [ItemCategoryId.rangedWeaponMod]
}

export const RangedWeaponSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    caliber: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByString(i1 as IItem, iv1, i2 as IItem, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IRangedWeapon).caliber),
      customIcon: Images['caliber'],
      icon: undefined
    },
    ergonomics: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.ergonomics
        ?? (i as IRangedWeapon).ergonomics),
      customIcon: undefined,
      icon: 'hand-paper'
    },
    fireRate: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve((i as IRangedWeapon).fireRate),
      customIcon: Images['fireRate'],
      icon: undefined
    },
    horizontalRecoil: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.horizontalRecoil
        ?? (i as IRangedWeapon).horizontalRecoil),
      customIcon: undefined,
      icon: 'arrows-alt-h'
    },
    verticalRecoil: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: (i) => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.verticalRecoil
        ?? (i as IRangedWeapon).verticalRecoil),
      customIcon: undefined,
      icon: 'arrows-alt-v'
    }
  },
  itemCategoryIds: [ItemCategoryId.mainWeapon, ItemCategoryId.secondaryWeapon]
}

export const VestSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions,
    ...ContainerSortingFunctions.functions
  },
  itemCategoryIds: [ItemCategoryId.vest]
}

/**
 * Gets the price of an item to compare.
 * @param item - Item.
 * @returns Price.
 */
async function getPriceAsync(item: IItem): Promise<number> {
  const inventoryItemService = Services.get(InventoryItemService)
  const price = await inventoryItemService.getPriceAsync({
    content: [],
    ignorePrice: false,
    itemId: item.id,
    modSlots: [],
    quantity: 1
  })

  return price.unitPrice.valueInMainCurrency
}