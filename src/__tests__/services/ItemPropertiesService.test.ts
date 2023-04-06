import { IAmmunition } from '../../models/item/IAmmunition'
import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IContainer } from '../../models/item/IContainer'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IMod } from '../../models/item/IMod'
import { IModdable } from '../../models/item/IModdable'
import { IModSlot } from '../../models/item/IModSlot'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponMod } from '../../models/item/IRangedWeaponMod'
import { IVest } from '../../models/item/IVest'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

describe('canBeModded()', () => {
  it.each([
    [
      { id: '12345', modSlots: [{ id: 'trigger' } as unknown as IModSlot] } as IModdable,
      true
    ],
    [{ id: '12345', modSlots: [] as IModSlot[] } as IModdable, false],
    [{ id: '12345', weight: 1 } as IItem, false]
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
    [{ id: '12345', capacity: 60 } as IContainer, true],
    [{ id: '12345', capacity: 0 } as IContainer, false],
    [{ id: '12345', weight: 1 } as IItem, false]
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
    [{ id: '12345', armorClass: 6 } as IArmor, true],
    [{ id: '12345', armorClass: 0 } as IArmor, true],
    [{ id: '12345', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', armorClass: 4, capacity: 10 } as IVest, true],
    [{ id: '12345', armorClass: 0, capacity: 10 } as IVest, true],
    [{ id: '12345', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', weight: 1 } as IItem, false]
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
    [{ id: '12345', armorClass: 6 } as IArmor, true],
    [{ id: '12345', armorClass: 0 } as IArmor, false],
    [{ id: '12345', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 4, capacity: 10 } as IVest, true],
    [{ id: '12345', armorClass: 0, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 1, blocksHeadphones: true } as IHeadwear, true],
    [{ id: '12345', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', weight: 1 } as IItem, false]
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
    [{ id: '12345', fleshDamage: 50 } as IAmmunition, true],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is an ammunition',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isAmmunition(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isArmor()', () => {
  it.each([
    [{ id: '12345', armorClass: 6 } as IArmor, true],
    [{ id: '12345', armorClass: 0 } as IArmor, true],
    [{ id: '12345', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 4, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 0, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 1, blocksHeadphones: true } as IHeadwear, false],
    [{ id: '12345', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is an armor',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isArmor(item)

      // Assert
      if (result !== expected) {
        console.log(item, result, expected)
      }
      expect(result).toBe(expected)
    }
  )
})

describe('isArmorMod()', () => {
  it.each([
    [{ id: '12345', armorClass: 6 } as IArmor, false],
    [{ id: '12345', armorClass: 0 } as IArmor, false],
    [{ id: '12345', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
    [{ id: '12345', armorClass: 4, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 0, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 1, blocksHeadphones: true } as IHeadwear, false],
    [{ id: '12345', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is an armor mod',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isArmorMod(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isContainer()', () => {
  it.each([
    [{ id: '12345', capacity: 60 } as IContainer, true],
    [{ id: '12345', capacity: 0 } as IContainer, true],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is a container',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isContainer(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isHeadwear()', () => {
  it.each([
    [{ id: '12345', armorClass: 6 } as IArmor, false],
    [{ id: '12345', armorClass: 0 } as IArmor, false],
    [{ id: '12345', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 4, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 0, capacity: 10 } as IVest, false],
    [{ id: '12345', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is an armor mod',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isHeadwear(item)

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
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isMod(item)

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
    [{ id: '12345', modSlots: [] as IModSlot[] } as IModdable, true],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is moddable',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isModdable(item)

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
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isRangedWeapon(item)

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
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isRangedWeaponMod(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})

describe('isVest()', () => {
  it.each([
    [{ id: '12345', armorClass: 6 } as IArmor, false],
    [{ id: '12345', armorClass: 0 } as IArmor, false],
    [{ id: '12345', armorClass: 3, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 0, ergonomicsPercentageModifier: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
    [{ id: '12345', armorClass: 4, capacity: 10 } as IVest, true],
    [{ id: '12345', armorClass: 0, capacity: 10 } as IVest, true],
    [{ id: '12345', armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
    [{ id: '12345', weight: 1 } as IItem, false]
  ])(
    'should determine if an item is a ranged weapon',
    (item: IItem, expected: boolean) => {
      // Arrange
      const itemPropertiesService = new ItemPropertiesService()

      // Act
      const result = itemPropertiesService.isVest(item)

      // Assert
      expect(result).toBe(expected)
    }
  )
})