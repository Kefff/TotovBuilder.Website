import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { PathUtils } from '../../utils/PathUtils'

describe('PathUtils', () => {
  describe('checkIsArmorInventorySlotPath()', () => {
    it.each([
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1', true],
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633', false],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/mod:mod_front_plate/item:656fa8d700d62bcd2e024084', false],
      ['build:12345/slot:bodyArmor_0/item:65765f39526e320fbe0357b1/content:1_10/item:5672c92d4bdc2d180f8b4567', false]
    ])('should check whether a path is a mod slot path', (path: string, expected: boolean) => {
      // Act
      const isArmorPath = PathUtils.checkIsArmorInventorySlotPath(path)

      // Assert
      expect(isArmorPath).toBe(expected)
    })
  })

  describe('checkIsModSlotPath()', () => {
    it.each([
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569', true],
      ['build:12345/slot:backpack_0/content:0_1/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569', true],
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

  describe('checkIsVestInventorySlotPath()', () => {
    it.each([
      ['build:12345/slot:tacticalRig_0/item:639343fce101f4caa40a4ef3', true],
      ['build:12345/slot:onSling_0/item:57dc2fa62459775949412633', false],
      ['build:12345/slot:tacticalRig_0/item:639343fce101f4caa40a4ef3/mod:mod_front_plate/item:656fa8d700d62bcd2e024084', false],
      ['build:12345/slot:tacticalRig_0/item:639343fce101f4caa40a4ef3/content:1_10/item:5672c92d4bdc2d180f8b4567', false]
    ])('should check whether a path is a mod slot path', (path: string, expected: boolean) => {
      // Act
      const isVestPath = PathUtils.checkIsVestInventorySlotPath(path)

      // Assert
      expect(isVestPath).toBe(expected)
    })
  })

  describe('getInventoryItemFromPath()', () => {
    it.each([
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '5710c24ad2720bc3458b45a3', // F-1 hand grenade
                  modSlots: [],
                  quantity: 1
                },
                {
                  content: [
                    {
                      content: [],
                      ignorePrice: false,
                      itemId: '5eff09cd30a7dc22fd1ddfed', // Health Resort east wing room 110 key with a blue tape
                      modSlots: [],
                      quantity: 1
                    },
                    {
                      content: [],
                      ignorePrice: false,
                      itemId: '5672c92d4bdc2d180f8b4567', // Dorm room 118 key
                      modSlots: [],
                      quantity: 1
                    }
                  ],
                  ignorePrice: false,
                  itemId: '59fafd4b86f7745ca07e1232', // Key tool
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'pockets'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build'
        } as IBuild,
        'build:12345/slot:pockets_1/item:59fafd4b86f7745ca07e1232/content:1_10/item:5672c92d4bdc2d180f8b4567',
        {
          content: [],
          ignorePrice: false,
          itemId: '5672c92d4bdc2d180f8b4567', // Dorm room 118 key
          modSlots: [],
          quantity: 1
        } as IInventoryItem
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
                  modSlots: [
                    {
                      modSlotName: 'mod_magazine',
                      item: {
                        content: [],
                        ignorePrice: false,
                        itemId: '564ca9df4bdc2d35148b4569', // AK-74 5.45x39 6L18 45-round magazine
                        modSlots: [],
                        quantity: 1
                      }
                    }
                  ],
                  quantity: 1
                }
              ],
              typeId: 'onSling'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build'
        } as IBuild,
        'build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569',
        {
          content: [],
          ignorePrice: false,
          itemId: '564ca9df4bdc2d35148b4569', // AK-74 5.45x39 6L18 45-round magazine
          modSlots: [],
          quantity: 1
        } as IInventoryItem
      ]
    ])('should get an inventory item from a path', (build: IBuild, path: string, expected: IInventoryItem) => {
      // Act
      const inventorySlot = PathUtils.getInventoryItemFromPath(build, path)

      // Assert
      expect(inventorySlot).toStrictEqual(expected)
    })

    it.each([
      [
        {} as IBuild,
        'build:123456789/item:57dc2fa62459775949412633',
        'Cannot find inventory slot in path "build:123456789/item:57dc2fa62459775949412633".'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:invalid/item:57dc2fa62459775949412633',
        'Cannot find inventory slot "invalid".'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [],
              typeId: 'pockets'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:pockets_0',
        'Cannot find inventory item in inventory slot "pockets" at index 0.'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '57dc2fa62459775949412633',
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'onSling'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:onSling_0/item:57dc2fa62459775949412633/mod:invalid',
        'Cannot find mod slot item "" in path "build:123456789/slot:onSling_0/item:57dc2fa62459775949412633/mod:invalid".'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '57dc2fa62459775949412633',
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'onSling'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:onSling_0/item:57dc2fa62459775949412633/mod:invalid/item:564ca9df4bdc2d35148b4569',
        'Cannot find mod slot item "564ca9df4bdc2d35148b4569" in path "build:123456789/slot:onSling_0/item:57dc2fa62459775949412633/mod:invalid/item:564ca9df4bdc2d35148b4569".'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '5ca20d5986f774331e7c9602',
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'backpack'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/content:invalid',
        'Cannot find content item "" in path "build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/content:invalid".'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '5ca20d5986f774331e7c9602',
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'backpack'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/content:invalid/item:564ca9df4bdc2d35148b4569',
        'Cannot find content item "564ca9df4bdc2d35148b4569" in path "build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/content:invalid/item:564ca9df4bdc2d35148b4569".'
      ],
      [
        {
          id: '123456789',
          inventorySlots: [
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '5ca20d5986f774331e7c9602',
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'backpack'
            }
          ],
          lastExported: undefined,
          lastUpdated: new Date(),
          lastWebsiteVersion: '1.0.0',
          name: 'build1'
        } as IBuild,
        'build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/invalid',
        'Path "build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/invalid" is invalid.'
      ]
    ])('should throw when the path is invalid', (build: IBuild, path: string, expected: string) => {
      // Act
      const act = (): IInventoryItem => PathUtils.getInventoryItemFromPath(build, path)

      // Assert
      expect(act).toThrowError(expected)
    })
  })

  describe('getPathModSlotNames()', () => {
    it.each([
      [
        'build:12345/slot:onSling_0/item:57dc2fa62459775949412633',
        []
      ],
      [
        'build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569',
        ['mod_magazine']
      ],
      [
        'build:12345/slot:onSling_0/item:5b439b5686f77428bd137424/mod:mod_handguard/item:5b7bedd75acfc43d825283f9/mod:mod_mount_000',
        ['mod_handguard', 'mod_mount_000']
      ],
      [
        'build:2cd97201-da85-a69d-8a0f-63bec555bfc0/slot:onBack_0/item:5af08cf886f774223c269184/mod:mod_reciever/item:59bfe68886f7746004266202/mod:mod_handguard/item:595cfa8b86f77427437e845b/mod:mod_mount_004/item:59e0bdb186f774156f04ce82/mod:mod_tactical',
        ['mod_reciever', 'mod_handguard', 'mod_mount_004', 'mod_tactical']
      ]
    ])('should get the mod slot names present in a path', (path: string, expected: string[]) => {
      // Act
      const result = PathUtils.getPathModSlotNames(path)

      // Assert
      expect(result).toStrictEqual(expected)
    })
  })
})