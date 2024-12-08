import { IPrice } from './IPrice'

/**
 * Provides the functionalities of an item.
 */
export interface IItem {
  /**
   * ID of the category of the item.
   */
  categoryId: ItemCategoryId

  /**
   * IDs of conflicting items.
   */
  conflictingItemIds: string[]

  /**
   * Link to the icon.
   */
  iconLink: string

  /**
   * ID.
   */
  id: string,

  /**
   * Link to the image.
   */
  imageLink: string

  /**
   * Link to the item market page.
   */
  marketLink: string

  /**
   * Maximum number of times the item can be stacked.
   */
  maxStackableAmount: number

  /**
   * Name.
   */
  name: string

  /**
   * Weight of the whole preset.
   * Undefined if the item is not a preset.
   */
  presetWeight: number | undefined

  /**
   * Prices.
   */
  prices: IPrice[],

  /**
   * Short name.
   */
  shortName: string,

  /**
   * Weight in kilograms.
   */
  weight: number

  /**
   * Link to the item wiki page.
   */
  wikiLink: string
}

/**
 * Item categories.
 */
export enum ItemCategoryId {
  ammunition = 'ammunition',
  armband = 'armband',
  armor = 'armor',
  armorMod = 'armorMod',
  backpack = 'backpack',
  container = 'container',
  currency = 'currency',
  eyewear = 'eyewear',
  faceCover = 'faceCover',
  grenade = 'grenade',
  headphones = 'headphones',
  headwear = 'headwear',
  magazine = 'magazine',
  mainWeapon = 'mainWeapon',
  meleeWeapon = 'meleeWeapon',
  mod = 'mod',
  notFound = 'notFound',
  other = 'other',
  rangedWeaponMod = 'rangedWeaponMod',
  secondaryWeapon = 'secondaryWeapon',
  securedContainer = 'securedContainer',
  special = 'special',
  vest = 'vest'
}