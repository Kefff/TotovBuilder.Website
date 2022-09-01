import { IAmmunition } from '../../models/item/IAmmunition'
import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import { IModdable } from '../../models/item/IModdable'
import { IModSlot } from '../../models/item/IModSlot'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IVest } from '../../models/item/IVest'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

describe('isAmmunition()', () => {
  it.each([
    [{ id: '12345', fleshDamage: 50 } as IAmmunition, true],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is an ammunition',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isAmmunition(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isArmor()', () => {
  it.each([
    [{ id: '12345', armorClass: 6 } as IArmor, true],
    [{ id: '12345', armorClass: 3 } as IArmorMod, true],
    [{ id: '12345', armorClass: 4 } as IVest, true],
    [{ id: '12345', armorClass: 0 } as IVest, true],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is an armor',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isArmor(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isContainer()', () => {
  it.each([
    [{ id: '12345', capacity: 60 } as IContainer, true],
    [{ id: '12345', capacity: 0 } as IContainer, false],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is a container',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isContainer(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isMod()', () => {
  it.each([
    [{ id: '12345', ergonomicsModifier: 10 } as IMod, true],
    [{ id: '12345' } as IItem, false]
  ])(
    'should determine if an item is a mod',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isMod(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isModdable()', () => {
  it.each([
    [
      { id: '12345', modSlots: [{ id: 'trigger' } as unknown as IModSlot] } as IModdable,
      true
    ],
    [{ id: '12345', modSlots: [] as IModSlot[] } as IModdable, false],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is moddable',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isModdable(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isRangedWeapon()', () => {
  it.each([
    [{ id: '12345', fireRate: 10 } as IRangedWeapon, true],
    [{ id: '12345' } as IItem, false]
  ])(
    'should determine if an item is a ranged weapon',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isRangedWeapon(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isRangedWeaponMod()', () => {
  it.each([
    [{ id: '12345', recoilPercentageModifier: 10 } as IRangedWeaponMod, true],
    [{ id: '12345' } as IItem, false]
  ])(
    'should determine if an item is a ranged weapon',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemService = new ItemPropertiesService()

      // Act
      const result = itemService.isRangedWeaponMod(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})