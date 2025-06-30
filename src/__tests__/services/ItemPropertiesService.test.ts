import { describe, expect, it } from 'vitest'
import { IArmor } from '../../models/item/IArmor'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IBackpack } from '../../models/item/IBackpack'
import { IContainer } from '../../models/item/IContainer'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { IModSlot } from '../../models/item/IModSlot'
import { IModdable } from '../../models/item/IModdable'
import { IVest } from '../../models/item/IVest'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { rpk16 } from '../__data__/itemMocks'

describe('ItemPropertiesService', () => {
  describe('canBeModded', () => {
    it.each([
      [
        { id: '12345', categoryId: ItemCategoryId.armorMod, modSlots: [{ id: 'trigger' } as unknown as IModSlot] } as IModdable,
        true
      ],
      [{ id: '12345', categoryId: ItemCategoryId.mainWeapon, modSlots: [] as IModSlot[] } as IModdable, false],
      [{ id: '12345', categoryId: ItemCategoryId.other } as IItem, false]
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

  describe('canContain', () => {
    it.each([
      [{ id: '12345', categoryId: ItemCategoryId.backpack, capacity: 18 } as IBackpack, true],
      [{ id: '12345', categoryId: ItemCategoryId.container, capacity: 60 } as IContainer, true],
      [{ id: '12345', categoryId: ItemCategoryId.magazine, capacity: 30 } as IMagazine, true],
      [{ id: '12345', categoryId: ItemCategoryId.vest, capacity: 12 } as IVest, true],
      [{ id: '12345', categoryId: ItemCategoryId.backpack, capacity: 0 } as IBackpack, false],
      [{ id: '12345', categoryId: ItemCategoryId.container, capacity: 0 } as IContainer, false],
      [{ id: '12345', categoryId: ItemCategoryId.magazine, capacity: 0 } as IMagazine, false],
      [{ id: '12345', categoryId: ItemCategoryId.vest, capacity: 0 } as IVest, false],
      [{ id: '12345', categoryId: ItemCategoryId.other } as IItem, false]
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

  describe('canHaveArmor', () => {
    it.each([
      [{ id: '12345', categoryId: ItemCategoryId.armor, armorClass: 6 } as IArmor, true],
      [{ id: '12345', categoryId: ItemCategoryId.armor, armorClass: 0 } as IArmor, true],
      [{ id: '12345', categoryId: ItemCategoryId.armorMod, armorClass: 3, ergonomicsModifierPercentage: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
      [{ id: '12345', categoryId: ItemCategoryId.armorMod, armorClass: 0, ergonomicsModifierPercentage: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
      [{ id: '12345', categoryId: ItemCategoryId.faceCover, armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
      [{ id: '12345', categoryId: ItemCategoryId.faceCover } as IItem, true],
      [{ id: '12345', categoryId: ItemCategoryId.headwear, armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
      [{ id: '12345', categoryId: ItemCategoryId.headwear, armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
      [{ id: '12345', categoryId: ItemCategoryId.vest, armorClass: 4, capacity: 10 } as IVest, true],
      [{ id: '12345', categoryId: ItemCategoryId.vest, armorClass: 0, capacity: 10 } as IVest, true],
      [{ id: '12345', categoryId: ItemCategoryId.other } as IItem, false]
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

  describe('checkMatchesFilter', () => {
    it.each([
      ['rpk 16', true],
      ['light gun', true],
      ['light invalid', false]
    ])('should check whether an item matches a filter', (filter: string, expected: boolean) => {
      // Arrange
      const service = new ItemPropertiesService()

      // Act
      const result = service.checkMatchesFilter(rpk16, filter)

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('hasArmor', () => {
    it.each([
      [{ id: '12345', categoryId: ItemCategoryId.armor, armorClass: 6 } as IArmor, true],
      [{ id: '12345', categoryId: ItemCategoryId.armor, armorClass: 0 } as IArmor, false],
      [{ id: '12345', categoryId: ItemCategoryId.armorMod, armorClass: 3, ergonomicsModifierPercentage: 1, modSlots: [] as IModSlot[] } as IArmorMod, true],
      [{ id: '12345', categoryId: ItemCategoryId.armorMod, armorClass: 0, ergonomicsModifierPercentage: 1, modSlots: [] as IModSlot[] } as IArmorMod, false],
      [{ id: '12345', categoryId: ItemCategoryId.headwear, armorClass: 2, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, true],
      [{ id: '12345', categoryId: ItemCategoryId.headwear, armorClass: 0, blocksHeadphones: true, modSlots: [] as IModSlot[] } as IHeadwear, false],
      [{ id: '12345', categoryId: ItemCategoryId.vest, armorClass: 4, capacity: 10 } as IVest, true],
      [{ id: '12345', categoryId: ItemCategoryId.vest, armorClass: 0, capacity: 10 } as IVest, false],
      [{ id: '12345', categoryId: ItemCategoryId.other } as IItem, false]
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

  describe('isAmmunition', () => {
    it.each([
      [ItemCategoryId.ammunition, true],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is ammunition',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isAmmunition(categoryId)
        const result2 = itemPropertiesService.isAmmunition({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isArmor', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, true],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is an armor',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isArmor(categoryId)
        const result2 = itemPropertiesService.isArmor({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isArmorMod', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, true],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is an armor mod',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isArmorMod(categoryId)
        const result2 = itemPropertiesService.isArmorMod({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isContainer', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, true],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, true],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a container',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isContainer(categoryId)
        const result2 = itemPropertiesService.isContainer({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isEyewear', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, true],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is eyewear',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isEyewear(categoryId)
        const result2 = itemPropertiesService.isEyewear({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isFaceCover', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, true],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is headwear',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isFaceCover(categoryId)
        const result2 = itemPropertiesService.isFaceCover({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isGrenade', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, true],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a grenade',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isGrenade(categoryId)
        const result2 = itemPropertiesService.isGrenade({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isHeadphones', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, true],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is headphones',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isHeadphones(categoryId)
        const result2 = itemPropertiesService.isHeadphones({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isHeadwear', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, true],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is headwear',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isHeadwear(categoryId)
        const result2 = itemPropertiesService.isHeadwear({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isMagazine', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, true],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a magazine',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isMagazine(categoryId)
        const result2 = itemPropertiesService.isMagazine({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isMeleeWeapon', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, true],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a melee weapon',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isMeleeWeapon(categoryId)
        const result2 = itemPropertiesService.isMeleeWeapon({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isMod', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, true],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a mod',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isMod(categoryId)
        const result2 = itemPropertiesService.isMod({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isModdable', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, true],
      [ItemCategoryId.armorMod, true],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, true],
      [ItemCategoryId.magazine, true],
      [ItemCategoryId.mainWeapon, true],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, true],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, true],
      [ItemCategoryId.secondaryWeapon, true],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, true]
    ])(
      'should determine if an item is moddable',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isModdable(categoryId)
        const result2 = itemPropertiesService.isModdable({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isRangedWeapon', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, true],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, true],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a ranged weapon',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isRangedWeapon(categoryId)
        const result2 = itemPropertiesService.isRangedWeapon({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isRangedWeaponMod', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, true],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, false]
    ])(
      'should determine if an item is a ranged weapon',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isRangedWeaponMod(categoryId)
        const result2 = itemPropertiesService.isRangedWeaponMod({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isVest', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, false],
      [ItemCategoryId.armorMod, false],
      [ItemCategoryId.backpack, false],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, false],
      [ItemCategoryId.faceCover, false],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, false],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, true]
    ])(
      'should determine if an item is a ranged weapon',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isVest(categoryId)
        const result2 = itemPropertiesService.isVest({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })

  describe('isWearable', () => {
    it.each([
      [ItemCategoryId.ammunition, false],
      [ItemCategoryId.armband, false],
      [ItemCategoryId.armor, true],
      [ItemCategoryId.armorMod, true],
      [ItemCategoryId.backpack, true],
      [ItemCategoryId.container, false],
      [ItemCategoryId.currency, false],
      [ItemCategoryId.eyewear, true],
      [ItemCategoryId.faceCover, true],
      [ItemCategoryId.grenade, false],
      [ItemCategoryId.headphones, false],
      [ItemCategoryId.headwear, true],
      [ItemCategoryId.magazine, false],
      [ItemCategoryId.mainWeapon, false],
      [ItemCategoryId.meleeWeapon, false],
      [ItemCategoryId.mod, false],
      [ItemCategoryId.other, false],
      [ItemCategoryId.rangedWeaponMod, false],
      [ItemCategoryId.secondaryWeapon, false],
      [ItemCategoryId.securedContainer, false],
      [ItemCategoryId.special, false],
      [ItemCategoryId.vest, true]
    ])(
      'should determine if an item is a ranged weapon',
      (categoryId: ItemCategoryId, expected: boolean) => {
        // Arrange
        const itemPropertiesService = new ItemPropertiesService()

        // Act
        const result1 = itemPropertiesService.isWearable(categoryId)
        const result2 = itemPropertiesService.isWearable({ categoryId, id: '12345' } as IItem)

        // Assert
        expect(result1).toBe(expected)
        expect(result2).toBe(expected)
      }
    )
  })
})