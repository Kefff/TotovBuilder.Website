import Images from '../../images'
import { ItemCategoryId } from '../item/IItem'
import { IInventorySlotType } from './IInventorySlotType'

/**
 * Specifies the inventory slot IDs.
 */
export enum InventorySlotTypeId {
  armband = 'armband',
  backpack = 'backpack',
  bodyArmor = 'bodyArmor',
  earpiece = 'earpiece',
  eyewear = 'eyewear',
  faceCover = 'faceCover',
  headwear = 'headwear',
  holster = 'holster',
  onBack = 'onBack',
  onSling = 'onSling',
  pockets = 'pockets',
  pouch = 'pouch',
  scabbard = 'scabbard',
  special = 'special',
  tacticalRig = 'tacticalRig',
}

const InventorySlotTypes: IInventorySlotType[] = [
  {
    acceptedItemCategories: [
      ItemCategoryId.mainWeapon
    ],
    canBeLooted: true,
    customIcon: Images.rifle1,
    displayOrder: 1,
    id: InventorySlotTypeId.onSling,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.mainWeapon
    ],
    canBeLooted: true,
    customIcon: Images.rifle2,
    displayOrder: 2,
    id: InventorySlotTypeId.onBack,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.secondaryWeapon
    ],
    canBeLooted: true,
    customIcon: Images.pistol,
    displayOrder: 3,
    id: InventorySlotTypeId.holster,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.armor
    ],
    canBeLooted: true,
    displayOrder: 4,
    icon: 'shield-alt',
    id: InventorySlotTypeId.bodyArmor,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.vest
    ],
    canBeLooted: true,
    displayOrder: 5,
    icon: 'vest',
    id: InventorySlotTypeId.tacticalRig,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.headwear
    ],
    canBeLooted: true,
    displayOrder: 6,
    icon: 'hat-cowboy',
    id: InventorySlotTypeId.headwear,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.headphones
    ],
    canBeLooted: true,
    displayOrder: 7,
    icon: 'headphones',
    id: InventorySlotTypeId.earpiece,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.backpack
    ],
    canBeLooted: true,
    displayOrder: 8,
    icon: 'suitcase',
    id: InventorySlotTypeId.backpack,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.ammunition,
      ItemCategoryId.armband,
      ItemCategoryId.armor,
      ItemCategoryId.armorMod,
      ItemCategoryId.backpack,
      ItemCategoryId.container,
      ItemCategoryId.currency,
      ItemCategoryId.eyewear,
      ItemCategoryId.faceCover,
      ItemCategoryId.grenade,
      ItemCategoryId.headphones,
      ItemCategoryId.headwear,
      ItemCategoryId.magazine,
      ItemCategoryId.mainWeapon,
      ItemCategoryId.meleeWeapon,
      ItemCategoryId.mod,
      ItemCategoryId.other,
      ItemCategoryId.rangedWeaponMod,
      ItemCategoryId.secondaryWeapon,
      ItemCategoryId.securedContainer,
      ItemCategoryId.special,
      ItemCategoryId.vest
    ],
    canBeLooted: true,
    displayOrder: 9,
    icon: 'th-large',
    id: InventorySlotTypeId.pockets,
    itemSlotsAmount: 4
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.eyewear
    ],
    canBeLooted: true,
    displayOrder: 10,
    icon: 'glasses',
    id: InventorySlotTypeId.eyewear,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.faceCover
    ],
    canBeLooted: true,
    displayOrder: 11,
    icon: 'mask',
    id: InventorySlotTypeId.faceCover,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.securedContainer
    ],
    canBeLooted: false,
    defaultItemsIds: [
      '544a11ac4bdc2d470e8b456a'
    ],
    displayOrder: 12,
    icon: 'wallet',
    id: InventorySlotTypeId.pouch,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.meleeWeapon
    ],
    canBeLooted: false,
    customIcon: Images.stab,
    defaultItemsIds: [
      '54491bb74bdc2d09088b4567'
    ],
    displayOrder: 13,
    id: InventorySlotTypeId.scabbard,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.armband
    ],
    canBeLooted: false,
    displayOrder: 14,
    icon: 'id-card-alt',
    id: InventorySlotTypeId.armband,
    itemSlotsAmount: 1
  },
  {
    acceptedItemCategories: [
      ItemCategoryId.special
    ],
    canBeLooted: false,
    defaultItemsIds: [],
    displayOrder: 15,
    icon: 'compass',
    id: InventorySlotTypeId.special,
    itemSlotsAmount: 3
  }
]

export default InventorySlotTypes