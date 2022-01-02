import { IItem } from '../models/item/IItem'
import { AmmunitionReaderService } from '../services/readers/AmmunitionReaderService'
import { ArmorModReaderService } from '../services/readers/ArmorModReaderService'
import { ArmorReaderService } from '../services/readers/ArmorReaderService'
import { ContainerReaderService } from '../services/readers/ContainerReaderService'
import { EyewearReaderService } from '../services/readers/EyewearReaderService'
import { GrenadeReaderService } from '../services/readers/GrenadeReaderService'
import { HeadwearReaderService } from '../services/readers/HeadwearReaderService'
import { IItemReaderService } from '../services/readers/IItemReaderService'
import { ItemReaderService } from '../services/readers/ItemReaderService'
import { MagazineReaderService } from '../services/readers/MagazineReaderService'
import { MeleeWeaponReaderService } from '../services/readers/MeleeWeaponReaderService'
import { ModReaderService } from '../services/readers/ModReaderService'
import { RangedWeaponModReaderService } from '../services/readers/RangedWeaponModReaderService'
import { RangedWeaponReaderService } from '../services/readers/RangedWeaponReaderService'
import { VestReaderService } from '../services/readers/VestReaderService'
import Services from '../services/repository/Services'

/**
 * Represents an utility class for manipulating item categories.
 */
export class ItemCategoryUtils {
  /**
   * Gets the reader service that can read an item of a specific category.
   * @param categoryId - ID of the category of the item which determines which reader must be used.
   */
  public static getReaderServiceForCategory(categoryId: string): IItemReaderService<IItem> {
    switch (categoryId) {
      case 'ammunition': {
        return Services.get(AmmunitionReaderService)
      }
      case 'armor': {
        return Services.get(ArmorReaderService)
      }
      case 'armorMod': {
        return Services.get(ArmorModReaderService)
      }
      case 'backpack':
      case 'container':
      case 'securedContainer': {
        return Services.get(ContainerReaderService)
      }
      case 'eyewear': {
        return Services.get(EyewearReaderService)
      }
      case 'grenade': {
        return Services.get(GrenadeReaderService)
      }
      case 'headwear': {
        return Services.get(HeadwearReaderService)
      }
      case 'magazine': {
        return Services.get(MagazineReaderService)
      }
      case 'meleeWeapon': {
        return Services.get(MeleeWeaponReaderService)
      }
      case 'mod': {
        return Services.get(ModReaderService)
      }
      case 'rangedWeaponMod': {
        return Services.get(RangedWeaponModReaderService)
      }
      case 'mainWeapon':
      case 'secondaryWeapon': {
        return Services.get(RangedWeaponReaderService)
      }
      case 'vest': {
        return Services.get(VestReaderService)
      }
      default: {
        return Services.get(ItemReaderService)
      }
    }
  }
}