import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IContainer } from '../../models/item/IContainer'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { IModdable } from '../../models/item/IModdable'
import { IModSlot } from '../../models/item/IModSlot'
import { IVest } from '../../models/item/IVest'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

describe('canBeModded()', () => {
  it.each([
    [
      { id: '12345', categoryId: 'armorMod', modSlots: [{ id: 'trigger' } as unknown as IModSlot] } as IModdable,
      true
    ],
    [{ id: '12345', categoryId: 'mainWeapon', modSlots: [] as IModSlot[] } as IModdable, false],
    [{ id: '12345', categoryId: 'other' } as IItem, false]
  ])(
    'should determine if an item is an armor',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.canBeModded(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('canContain()', () => {
  it.each([
    [{ id: '12345', categoryId: 'container', capacity: 60 } as IContainer, true],
    [{ id: '12345', categoryId: 'magazine', capacity: 30 } as IMagazine, true],
    [{ id: '12345', categoryId: 'vest', capacity: 12 } as IVest, true],
    [{ id: '12345', categoryId: 'container', capacity: 0 } as IContainer, false],
    [{ id: '12345', categoryId: 'magazine', capacity: 0 } as IMagazine, false],
    [{ id: '12345', categoryId: 'vest', capacity: 0 } as IVest, false],
    [{ id: '12345', categoryId: 'other' } as IItem, false]
  ])(
    'should determine if an item is a container',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.canContain(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('canHaveArmor()', () => {
  it.each([
    [{ id: '12345', categoryId: 'armor', armorClass: 6 } as IArmor, true],
    [{ id: '12345', categoryId: 'armor', armorClass: 0 } as IArmor, true],
    [{ id: '12345', categoryId: 'armorMod', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', categoryId: 'armorMod', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', categoryId: 'headwear', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', categoryId: 'headwear', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', categoryId: 'vest', armorClass: 4, capacity: 10 } as IVest, true],
    [{ id: '12345', categoryId: 'vest', armorClass: 0, capacity: 10 } as IVest, true],
    [{ id: '12345', categoryId: 'other' } as IItem, false]
  ])(
    'should determine if an item is an armor',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.canHaveArmor(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('hasArmor()', () => {
  it.each([
    [{ id: '12345', categoryId: 'armor', armorClass: 6 } as IArmor, true],
    [{ id: '12345', categoryId: 'armor', armorClass: 0 } as IArmor, false],
    [{ id: '12345', categoryId: 'armorMod', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', categoryId: 'armorMod', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', categoryId: 'headwear', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', categoryId: 'headwear', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', categoryId: 'vest', armorClass: 4, capacity: 10 } as IVest, true],
    [{ id: '12345', categoryId: 'vest', armorClass: 0, capacity: 10 } as IVest, false],
    [{ id: '12345', categoryId: 'other' } as IItem, false]
  ])(
    'should determine if an item is an armor',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.hasArmor(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isAmmunition()', () => {
  it.each([
    ['ammunition', true],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is ammunition',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isAmmunition({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isArmor()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', true],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is an armor',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isArmor({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isArmorMod()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', true],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is an armor mod',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isArmorMod({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isContainer()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', true],
    ['container', true],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', true],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a container',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isContainer({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isEyewear()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', true],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is eyewear',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isEyewear({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isGrenade()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', true],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a grenade',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isGrenade({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isHeadwear()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', true],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is headwear',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isHeadwear({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isMagazine()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', true],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a magazine',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isMagazine({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isMeleeWeapon()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', true],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a melee weapon',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isMeleeWeapon({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isMod()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', true],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a mod',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isMod({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isModdable()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', true],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', true],
    ['magazine', true],
    ['mainWeapon', true],
    ['meleeWeapon', false],
    ['mod', true],
    ['other', false],
    ['rangedWeaponMod', true],
    ['secondaryWeapon', true],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is moddable',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isModdable({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isRangedWeapon()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', true],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', true],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a ranged weapon',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isRangedWeapon({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isRangedWeaponMod()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', true],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', false]
  ])(
    'should determine if an item is a ranged weapon',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isRangedWeaponMod({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isVest()', () => {
  it.each([
    ['ammunition', false],
    ['armband', false],
    ['armor', false],
    ['armorMod', false],
    ['backpack', false],
    ['container', false],
    ['currency', false],
    ['eyewear', false],
    ['faceCover', false],
    ['grenade', false],
    ['headphones', false],
    ['headwear', false],
    ['magazine', false],
    ['mainWeapon', false],
    ['meleeWeapon', false],
    ['mod', false],
    ['other', false],
    ['rangedWeaponMod', false],
    ['secondaryWeapon', false],
    ['securedContainer', false],
    ['special', false],
    ['vest', true]
  ])(
    'should determine if an item is a ranged weapon',
    (categoryId: string, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isVest({ categoryId, id: '12345' } as IItem)

      // Assert
      expect(result).toBe(expected)
    }
  )
})