import { describe, expect, it } from 'vitest'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { PathUtils } from '../../utils/PathUtils'

describe('PathUtils', () => {
  describe('checkIsInventorySlotItem', () => {
    it.each([
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1', InventorySlotTypeId.bodyArmor, true],
      ['build:12345/slot:tacticalRig_0/item:639343fce101f4caa40a4ef3', InventorySlotTypeId.tacticalRig, true],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1', InventorySlotTypeId.headwear, false],
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633', undefined, true],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/mod:mod_front_plate/item:656fa8d700d62bcd2e024084', undefined, false],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/content:1_10/item:5672c92d4bdc2d180f8b4567', undefined, false]
    ])('should check whether a path is an inventory item path', (path: string, inventorySlotType: InventorySlotTypeId | undefined, expected: boolean) => {
      // Act
      const isArmorPath = PathUtils.checkIsInventorySlotItem(path, inventorySlotType)

      // Assert
      expect(isArmorPath).toBe(expected)
    })
  })

  describe('checkIsModSlotPath', () => {
    it.each([
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569', true],
      ['build:12345/slot:backpack_0/item:5d5d940f86f7742797262046/content:0_1/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569', true],
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569/content:0_1/item:5c0d5e4486f77478390952fe', false],
      ['build:12345/slot:pockets_1/item:59fafd4b86f7745ca07e1232/content:1_10/item:5672c92d4bdc2d180f8b4567', false],
      ['build:12345/slot:pockets_1/item:empty', false]
    ])('should check whether a path is a mod slot path', (path: string, expected: boolean) => {
      // Act
      const isModSlotPath = PathUtils.checkIsModSlotPath(path)

      // Assert
      expect(isModSlotPath).toBe(expected)
    })
  })

  describe('getPathLevel', () => {
    it.each([
      [
        'build:12345/slot:onSling_0/item:584147732459775a2b6d9f12/mod:mod_reciever/item:57dc334d245977597164366f/mod:mod_mount_000/item:57ffb0062459777a045af529/mod:mod_scope/item:584984812459776a704a82a6',
        3
      ],
      [
        'build:12345/slot:holster_0/item:5b439b1f86f7744fd8059cbe/mod:mod_magazine/item:5a718f958dc32e00094b97e7/content:0_1/item:5efb0da7a29a85116f6ea05f',
        2
      ],
      [
        'build:12345/slot:tacticalRig_0/item:5ab8dab586f77441cd04f2a2/content:0_8/item:5b7d37845acfc400170e2f87/content:0_1/item:58dd3ad986f77403051cba8f',
        2
      ],
      [
        'build:12345/slot:onSling_0/item:5b439b5686f77428bd137424/base-item:/item:5b0bbe4e5acfc40dc528a72d',
        1
      ]
    ])('should get the level of imbrication of the path of an item', (path: string, expected: number) => {
      // Act
      const level = PathUtils.getPathLevel(path)

      // Assert
      expect(level).toBe(expected)
    })
  })
})