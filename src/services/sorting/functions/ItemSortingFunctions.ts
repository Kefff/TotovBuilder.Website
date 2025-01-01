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
import { compareByItemNumber, compareByItemString } from '../SortingService'
import { IItemSortingFunctionList } from './ISortingFunctionList'

/**
 * Functions for sorting items.
 */
export const ItemSortingFunctions: IItemSortingFunctionList = {
  itemCategoryIds: [
    ItemCategoryId.armband,
    ItemCategoryId.currency,
    ItemCategoryId.faceCover,
    ItemCategoryId.headphones,
    ItemCategoryId.other,
    ItemCategoryId.special
  ],
  functions: {
    categoryId: {
      comparisonFunction: (i1, i1v, i2, i2v) => compareByItemString(i1, i1v, i2, i2v),
      comparisonValueObtentionPromise: i => Promise.resolve(i.categoryId)
    },
    name: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemString(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(i.name)
    },
    price: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: async i => await getPriceAsync(i)
    },
    weight: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(i.presetWeight ?? i.weight)
    }
  }
}

export const AmmunitionSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    accuracyModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).accuracyModifierPercentage)
    },
    fleshDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).fleshDamage * (i as IAmmunition).projectiles)
    },
    fragmentationChance: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).fragmentationChance)
    },
    penetratedArmorLevel: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).penetrationPower) // Since the penetratedArmorLevel is calculated from the penetrationPower, we can sort by penetrationPower which is more precise
    },
    penetrationPower: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).penetrationPower)
    },
    recoilModifier: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IAmmunition).recoilModifier)
    }
  },
  itemCategoryIds: [ItemCategoryId.ammunition]
}

export const ContainerSortingFunctions: IItemSortingFunctionList = {
  itemCategoryIds: [ItemCategoryId.container, ItemCategoryId.securedContainer],
  functions: {
    ...ItemSortingFunctions.functions,
    capacity: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IContainer).capacity)
    }
  }
}

export const ModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    ergonomicsModifier: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IMod).presetErgonomicsModifier
        ?? (i as IMod).ergonomicsModifier)
    }
  },
  itemCategoryIds: [ItemCategoryId.mod]
}

export const WearableSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    ergonomicsModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IWearable).presetWearableModifiers?.ergonomicsModifierPercentage
        ?? (i as IWearable).ergonomicsModifierPercentage)
    },
    movementSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IWearable).presetWearableModifiers?.movementSpeedModifierPercentage
        ?? (i as IWearable).movementSpeedModifierPercentage)
    },
    turningSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IWearable).presetWearableModifiers?.turningSpeedModifierPercentage
        ?? (i as IWearable).turningSpeedModifierPercentage)
    }
  },
  itemCategoryIds: []
}

export const ArmorSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...WearableSortingFunctions.functions,
    armorClass: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IArmor).presetArmorModifiers?.armorClass ?? (i as IArmor).armorClass)
    },
    durability: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IArmor).presetArmorModifiers?.durability ?? (i as IArmor).durability)
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
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IEyewear).blindnessProtectionPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.eyewear]
}

export const GrenadeSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    explosionDelay: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IGrenade).explosionDelay)
    },
    fragmentsAmount: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IGrenade).fragmentsAmount)
    },
    maximumExplosionRange: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IGrenade).maximumExplosionRange)
    }
  },
  itemCategoryIds: [ItemCategoryId.grenade]
}

export const HeadwearSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ArmorSortingFunctions.functions,
    ricochetChance: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(ricochetChances[(i as IHeadwear).ricochetChance])
    }
  },
  itemCategoryIds: [ItemCategoryId.headwear]
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
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IMagazine).checkSpeedModifierPercentage)
    },
    loadSpeedModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IMagazine).loadSpeedModifierPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.magazine]
}

export const MeleeWeaponSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    chopDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IMeleeWeapon).chopDamage)
    },
    hitRadius: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IMeleeWeapon).hitRadius)
    },
    stabDamage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IMeleeWeapon).stabDamage)
    }
  },
  itemCategoryIds: [ItemCategoryId.meleeWeapon]
}

export const RangedWeaponModSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ModSortingFunctions.functions,
    accuracyModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IRangedWeaponMod).accuracyModifierPercentage)
    },
    recoilModifierPercentage: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IRangedWeaponMod).presetRecoilModifierPercentage
        ?? (i as IRangedWeaponMod).recoilModifierPercentage)
    }
  },
  itemCategoryIds: [ItemCategoryId.rangedWeaponMod]
}

export const RangedWeaponSortingFunctions: IItemSortingFunctionList = {
  functions: {
    ...ItemSortingFunctions.functions,
    caliber: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemString(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IRangedWeapon).caliber)
    },
    ergonomics: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.ergonomics
        ?? (i as IRangedWeapon).ergonomics)
    },
    fireRate: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve((i as IRangedWeapon).fireRate)
    },
    horizontalRecoil: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.horizontalRecoil
        ?? (i as IRangedWeapon).horizontalRecoil)
    },
    verticalRecoil: {
      comparisonFunction: (i1, iv1, i2, iv2) => compareByItemNumber(i1, iv1, i2, iv2),
      comparisonValueObtentionPromise: i => Promise.resolve(
        (i as IRangedWeapon).presetRangedWeaponModifiers?.verticalRecoil
        ?? (i as IRangedWeapon).verticalRecoil)
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