import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IBuildItemWithPath } from '../../models/build/IBuildItemWithPath'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { PathUtils } from '../../utils/PathUtils'
import { build1 } from '../__data__/buildMocks'
import { ak12PistolGrip, ak12Stock, ammo545us, armor6b13FlDefault, berkut, cqcm, crossbow, iskra, lshZ2dtm, lshZ2dtmFs, morphine, plate6b33Back, plate6b33Front, rgd5, rpk1615inch, rpk16Default, rpk16Drum, rpk16DustCover, rpk16Handguard, rpk16MuzzleBreak, rpk16Rail, rpk16Rs, rpk16RsBase, rpk16Tube, vaseline, water } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'

describe('PathUtils', () => {
  describe('checkIsInventorySlotItem', () => {
    it.each([
      ['build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:10_10/new', undefined, false],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1', InventorySlotTypeId.bodyArmor, true],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1', InventorySlotTypeId.headwear, false],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/content:1_10/item:5672c92d4bdc2d180f8b4567', undefined, false],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/mod:mod_front_plate/item:656fa8d700d62bcd2e024084', undefined, false],
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633', undefined, true],
      ['build:12345/slot:onSling_0/item:5c0c1ce886f77401c119d014/base-item:/item:5bf3e03b0db834001d2c4a9c', undefined, false],
      ['build:12345/slot:tacticalRig_0/item:639343fce101f4caa40a4ef3', InventorySlotTypeId.tacticalRig, true]
    ])('should check whether a path is an inventory item path', (path: string, inventorySlotType: InventorySlotTypeId | undefined, expected: boolean) => {
      // Act
      const isArmorPath = PathUtils.checkIsInventorySlotItem(path, inventorySlotType)

      // Assert
      expect(isArmorPath).toBe(expected)
    })
  })

  describe('checkIsModSlotPath', () => {
    it.each([
      ['build:12345/slot:backpack_0/item:5d5d940f86f7742797262046/content:0_1/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569', true],
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569', true],
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

  describe('getBuildItemsWithPathsAsync', () => {
    it.each([
      [
        build1,
        [
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
          },
          {
            item: rpk16Drum,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_magazine/item:${rpk16Drum.id}`
          },
          {
            item: ammo545us,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_magazine/item:${rpk16Drum.id}/content:0_0/item:${ammo545us.id}`
          },
          {
            item: rpk16Tube,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_stock_001/item:${rpk16Tube.id}`
          },
          {
            item: ak12Stock,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_stock_001/item:${rpk16Tube.id}/mod:mod_stock/item:${ak12Stock.id}`
          },
          {
            item: rpk16Handguard,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_handguard/item:${rpk16Handguard.id}`
          },
          {
            item: rpk16Rail,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_handguard/item:${rpk16Handguard.id}/mod:mod_mount_000/item:${rpk16Rail.id}`
          },
          {
            item: rpk16Rail,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_handguard/item:${rpk16Handguard.id}/mod:mod_mount_001/item:${rpk16Rail.id}`
          },
          {
            item: rpk1615inch,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_barrel/item:${rpk1615inch.id}`
          },
          {
            item: rpk16MuzzleBreak,
            path: `build:build_1/slot:onSling_0/item:${rpk16Default.id}/mod:mod_barrel/item:${rpk1615inch.id}/mod:mod_muzzle/item:${rpk16MuzzleBreak.id}`
          },
          {
            item: armor6b13FlDefault,
            path: `build:build_1/slot:bodyArmor_0/item:${armor6b13FlDefault.id}`
          },
          {
            item: plate6b33Front,
            path: `build:build_1/slot:bodyArmor_0/item:${armor6b13FlDefault.id}/mod:front_plate/item:${plate6b33Front.id}`
          },
          {
            item: plate6b33Back,
            path: `build:build_1/slot:bodyArmor_0/item:${armor6b13FlDefault.id}/mod:back_plate/item:${plate6b33Back.id}`
          },
          {
            item: lshZ2dtm,
            path: `build:build_1/slot:headwear_0/item:${lshZ2dtm.id}`
          },
          {
            item: lshZ2dtmFs,
            path: `build:build_1/slot:headwear_0/item:${lshZ2dtm.id}/mod:mod_equipment/item:${lshZ2dtmFs.id}`
          },
          {
            item: berkut,
            path: `build:build_1/slot:backpack_0/item:${berkut.id}`
          },
          {
            item: iskra,
            path: `build:build_1/slot:backpack_0/item:${berkut.id}/content:0_1/item:${iskra.id}`
          },
          {
            item: water,
            path: `build:build_1/slot:backpack_0/item:${berkut.id}/content:1_1/item:${water.id}`
          },
          {
            item: morphine,
            path: `build:build_1/slot:pockets_0/item:${morphine.id}`
          },
          {
            item: vaseline,
            path: `build:build_1/slot:pockets_1/item:${vaseline.id}`
          },
          {
            item: rgd5,
            path: `build:build_1/slot:pockets_2/item:${rgd5.id}`
          },
          {
            item: ammo545us,
            path: `build:build_1/slot:pockets_3/item:${ammo545us.id}`
          },
          {
            item: crossbow,
            path: `build:build_1/slot:eyewear_0/item:${crossbow.id}`
          },
          {
            item: cqcm,
            path: `build:build_1/slot:faceCover_0/item:${cqcm.id}`
          }
        ]
      ],
      [
        {
          id: 'build_3',
          name: 'Build 3',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rpk16Default.id,
                  modSlots: [
                    {
                      item: undefined,
                      modSlotName: 'mod_pistol_grip'
                    }
                  ],
                  quantity: 1
                }
              ],
              typeId: InventorySlotTypeId.onSling
            }
          ]
        },
        [
          {
            item: rpk16Default,
            path: 'build:new-build/slot:onSling_0/item:5c0d1ec986f77439512a1a72'
          }
        ]
      ]
    ])('should gets the list of all the items in a build with their path', async (build: IBuild, expected: IBuildItemWithPath[]) => {
      // Arrange
      useItemServiceMock()

      // Act
      const buildItemsWithPath = await PathUtils.getBuildItemsWithPathsAsync(build)

      // Assert
      expect(buildItemsWithPath).toStrictEqual(expected)
    })
  })

  describe('getBaseItemPath', () => {
    it('should get the path of the base item of an item', () => {
      // Act
      const baseItemPath = PathUtils.getBaseItemPath('build:12345/slot:onSling_0/item:5c0c1ce886f77401c119d014', '5bf3e03b0db834001d2c4a9c')

      // Assert
      expect(baseItemPath).toBe('build:12345/slot:onSling_0/item:5c0c1ce886f77401c119d014/base-item:/item:5bf3e03b0db834001d2c4a9c')
    })
  })

  describe('getBuildPath', () => {
    it.each([
      [true, 'build:new-build'],
      [false, 'build:12345']
    ])('should get the path of a build', (isNewBuild: boolean, expected: string) => {
      // Act
      const buildPath = PathUtils.getBuildPath('12345', isNewBuild)

      // Assert
      expect(buildPath).toBe(expected)
    })
  })

  describe('getContainedItemPath', () => {
    it('should get the path of an item contained in another item', () => {
      // Act
      const containedItemPath = PathUtils.getContainedItemPath('build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1', 2, 4, '5672c92d4bdc2d180f8b4567')

      // Assert
      expect(containedItemPath).toBe('build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3/item:5672c92d4bdc2d180f8b4567')
    })
  })

  describe('getContentPath', () => {
    it('should get the path of an item content', () => {
      // Act
      const contentPath = PathUtils.getContentPath('build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1', 2, 4)

      // Assert
      expect(contentPath).toBe('build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3')
    })
  })

  describe('getInventorySlotItemPath', () => {
    it('should get the path of an item in an inventory slot', () => {
      // Act
      const inventorySlotItemPath = PathUtils.getInventorySlotItemPath('build:12345/slot:backpack', 2, '65765f39526e320fbe0357b1')

      // Assert
      expect(inventorySlotItemPath).toBe('build:12345/slot:backpack_2/item:65765f39526e320fbe0357b1')
    })
  })

  describe('getInventorySlotPath', () => {
    it('should get the path of an item in an inventory slot', () => {
      // Act
      const inventorySlotPath = PathUtils.getInventorySlotPath('build:12345', InventorySlotTypeId.backpack)

      // Assert
      expect(inventorySlotPath).toBe('build:12345/slot:backpack')
    })
  })

  describe('getItemPath', () => {
    it.each([
      [
        'build:12345/slot:backpack_0',
        '65765f39526e320fbe0357b1',
        'build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1'
      ],
      [
        'build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3',
        '5672c92d4bdc2d180f8b4567',
        'build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3/item:5672c92d4bdc2d180f8b4567'
      ],
      [
        'build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3',
        undefined,
        'build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3/item:empty'
      ]
    ])('should get the path of an item', (previousPath: string, itemId: string | undefined, expected: string) => {
      // Act
      const itemPath = PathUtils.getItemPath(previousPath, itemId)

      // Assert
      expect(itemPath).toBe(expected)
    })
  })

  describe('getModdedItemPathFromPath', () => {
    it.each([
      ['build:12345/slot:onSling_0/item:5c10fcb186f774533e5529ab/mod:mod_reciever/item:5c0e2f26d174af02a9625114/mod:mod_barrel/item:55d35ee94bdc2d61338b4568/mod:mod_muzzle/item:5cff9e5ed7ad1a09407397d4/mod:mod_muzzle/item:5cff9e84d7ad1a049e54ed55', 'build:12345/slot:onSling_0/item:5c10fcb186f774533e5529ab'],
      ['build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3/item:5c10fcb186f774533e5529ab/mod:mod_reciever/item:5c0e2f26d174af02a9625114/mod:mod_barrel/item:55d35ee94bdc2d61338b4568/mod:mod_muzzle/item:5cff9e5ed7ad1a09407397d4/mod:mod_muzzle/item:5cff9e84d7ad1a049e54ed55', 'build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1/content:2_3/item:5c10fcb186f774533e5529ab'],
      ['build:12345/slot:backpack_0/item:65765f39526e320fbe0357b1', undefined],
      ['build:12345', undefined]
    ])('should get the last modded item path from a path', (path: string, expected: string | undefined) => {
      // Act
      const moddedItemPath = PathUtils.getModdedItemPathFromPath(path)

      // Assert
      expect(moddedItemPath).toBe(expected)
    })
  })

  describe('getModSlotPath', () => {
    it('should get the path of a mod slot', () => {
      // Act
      const modSlotPath = PathUtils.getModSlotPath('build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1', 'mod_front_plate')

      // Assert
      expect(modSlotPath).toBe('build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/mod:mod_front_plate')
    })
  })
})