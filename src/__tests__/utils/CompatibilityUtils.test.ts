import { describe, expect, it } from 'vitest'
import { IBuildItemWithPath } from '../../models/build/IBuildItemWithPath'
import { IItem, ItemCategoryId } from '../../models/item/IItem'
import { CompatibilityUtils } from '../../utils/CompatibilityUtils'
import { ak12PistolGrip, armor6b13FlDefault, banshee, berkut, crossbow, k1s, kotton, razor, rpk16Default, rpk16DustCover, rpk16Rs, rpk16RsBase, scavVest } from '../__data__/itemMocks'

describe('CompatibilityUtils', () => {
  describe('checkCompatibility', () => {
    it.each([
      [
        `build:build_1/slot:backpack_0/item:${berkut.id}/content:0_1/item:${armor6b13FlDefault.id}`,
        armor6b13FlDefault
      ],
      [
        `build:build_1/slot:backpack_0/item:${berkut.id}/content:0_1/item:${banshee.id}`,
        banshee
      ]
    ])('should do nothing when the item to add is not a mod and not in an inventory slot', (itemToAddPath: string, itemToAdd: IItem) => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = [
        {
          item: berkut,
          path: `build:12345/slot:backpack_0/item:${berkut.id}`
        }
      ]

      if (itemToAdd.categoryId === ItemCategoryId.vest) {
        buildItemPaths.push({
          item: armor6b13FlDefault,
          path: `build:12345/slot:bodyArmor_0/item:${armor6b13FlDefault.id}`
        })
      } else if (itemToAdd.categoryId === ItemCategoryId.armor) {
        buildItemPaths.push({
          item: banshee,
          path: `build:12345/slot:tacticalRig_0/item:${banshee.id}`
        })
      }

      // Act
      const conflictReason = CompatibilityUtils.checkCompatibility(buildItemPaths, itemToAddPath, itemToAdd)

      // Assert
      expect(conflictReason).toBe(undefined)
    })

    it.each([
      [
        `build:12345/slot:bodyArmor_0/item:${armor6b13FlDefault.id}`,
        armor6b13FlDefault,
        'An armored tactical rig is already equiped.'
      ],
      [
        `build:12345/slot:tacticalRig_0/item:${banshee.id}`,
        banshee,
        'A body armor is already equiped.'
      ],
      [
        `build:12345/slot:tacticalRig_0/item:${scavVest.id}`,
        scavVest,
        undefined
      ]
    ])('should check the compatibility of an armor and a vest in an inventory slot', (itemToAddPath: string, itemToAdd: IItem, expectedConflictReason: string | undefined) => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = []

      if (itemToAdd.categoryId === ItemCategoryId.vest) {
        buildItemPaths.push({
          item: armor6b13FlDefault,
          path: `build:12345/slot:bodyArmor_0/item:${armor6b13FlDefault.id}`
        })
      } else if (itemToAdd.categoryId === ItemCategoryId.armor) {
        buildItemPaths.push({
          item: banshee,
          path: `build:12345/slot:tacticalRig_0/item:${banshee.id}`
        })
      }

      // Act
      const conflictReason = CompatibilityUtils.checkCompatibility(buildItemPaths, itemToAddPath, itemToAdd)

      // Assert
      expect(conflictReason).toBe(expectedConflictReason)
    })

    it.each([
      [
        `build:12345/slot:earpiece_0/item:${razor.id}`,
        razor,
        'A helmet that blocks headphones is already equiped.'
      ],
      [
        `build:12345/slot:headwear_0/item:${k1s.id}`,
        k1s,
        'Cannot be equiped with headphones.'
      ],
      [
        `build:12345/slot:headwear_0/item:${kotton.id}`,
        kotton,
        undefined
      ]
    ])('should check the compatibility of headwear and earpiece in an inventory slot', (itemToAddPath: string, itemToAdd: IItem, expectedConflictReason: string | undefined) => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = []

      if (itemToAdd.categoryId === ItemCategoryId.headwear) {
        buildItemPaths.push({
          item: razor,
          path: `build:12345/slot:earpiece/item:${razor.id}`
        })
      } else if (itemToAdd.categoryId === ItemCategoryId.headphones) {
        buildItemPaths.push({
          item: k1s,
          path: `build:12345/slot:headwear_0/item:${k1s.id}`
        })
      }

      // Act
      const conflictReason = CompatibilityUtils.checkCompatibility(buildItemPaths, itemToAddPath, itemToAdd)

      // Assert
      expect(conflictReason).toBe(expectedConflictReason)
    })

    it('should check the compatibility of two items in an inventory slot', () => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = [
        {
          item: {
            ...kotton,
            conflictingItemIds: [crossbow.id]
          },
          path: `build:12345/slot:headwear_0/item:${kotton.id}`
        }
      ]

      // Act
      const conflictReason = CompatibilityUtils.checkCompatibility(
        buildItemPaths,
        `build:12345/slot:eyewear_0/item:${crossbow.id}`,
        crossbow)

      // Assert
      expect(conflictReason).toBe('Conflicts with "Kotton beanie".')
    })

    it('should not check the inventory item compatibility when one of the items is in the content of another item', () => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = [
        {
          item: berkut,
          path: `build:12345/slot:backpack_0/item:${berkut.id}`
        },
        {
          item: armor6b13FlDefault,
          path: `build:12345/slot:backpack_0/item:${berkut.id}/content:1_2/item:${armor6b13FlDefault.id}`
        },
        {
          item: {
            ...kotton,
            conflictingItemIds: [crossbow.id]
          },
          path: `build:12345/slot:backpack_0/item:${berkut.id}/content:2_2/item:${kotton.id}`
        }
      ]

      // Act
      let conflictReason = CompatibilityUtils.checkCompatibility(
        buildItemPaths,
        `build:12345/slot:bodyArmor_0/item:${armor6b13FlDefault.id}`,
        crossbow)

      // Assert
      expect(conflictReason).toBe(undefined)

      // Act
      conflictReason = CompatibilityUtils.checkCompatibility(
        buildItemPaths,
        `build:12345/slot:eyewear_0/item:${crossbow.id}`,
        crossbow)

      // Assert
      expect(conflictReason).toBe(undefined)
    })

    it('should check the compatibility of mods of the same item', () => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = [
        {
          item: rpk16Default,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}`
        },
        {
          item: ak12PistolGrip,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_pistol_grip/item:${ak12PistolGrip.id}`
        },
        {
          item: rpk16DustCover,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}`
        },
        {
          item: rpk16RsBase,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}/mod:mod_sight_rear/item:${rpk16RsBase.id}`
        },
        {
          item: rpk16Rs,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}/mod:mod_sight_rear/item:${rpk16RsBase.id}/mod:mod_sight_rear/item:${rpk16Rs.id}`
        }
      ]

      // Act
      const conflictReason = CompatibilityUtils.checkCompatibility(
        buildItemPaths,
        `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}/mod:mod_sight_rear/item:${rpk16RsBase.id}/mod:mod_sight_rear/item:${rpk16Rs.id}`,
        {
          ...rpk16Rs,
          conflictingItemIds: [ak12PistolGrip.id]
        })

      // Assert
      expect(conflictReason).toBe('Conflicts with "AK-12 pistol grip".')
    })

    it('should not check the compatibility of mods of different items', () => {
      // Arrange
      const buildItemPaths: IBuildItemWithPath[] = [
        {
          item: rpk16Default,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}`
        },
        {
          item: ak12PistolGrip,
          path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_pistol_grip/item:${ak12PistolGrip.id}`
        },
        {
          item: berkut,
          path: `build:12345/slot:backpack_0/item:${berkut.id}`
        },
        {
          item: rpk16Default,
          path: `build:12345/slot:backpack_0/item:${berkut.id}/content:1_1/item:${rpk16Default.id}`
        },
        {
          item: ak12PistolGrip,
          path: `build:12345/slot:backpack_0/item:${berkut.id}/content:1_1/item:${rpk16Default.id}/mod:mod_pistol_grip/item:${ak12PistolGrip.id}`
        },
        {
          item: rpk16Default,
          path: `build:12345/slot:backpack_0/item:${berkut.id}/content:1_2/item:${rpk16Default.id}`
        }
      ]

      // Act
      const conflictReason = CompatibilityUtils.checkCompatibility(
        buildItemPaths,
        `build:12345/slot:backpack_0/item:${berkut.id}/content:1_2/item:${rpk16Default.id}/mod:mod_reciever/item:${rpk16DustCover.id}`,
        {
          ...rpk16DustCover,
          conflictingItemIds: [ak12PistolGrip.id]
        }
      )

      // Assert
      expect(conflictReason).toBe(undefined)
    })
  })
})