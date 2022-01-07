import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { PathUtils } from '../../utils/PathUtils'

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
                itemId: '5710c24ad2720bc3458b45a3', // F-1 hand grenade
                modSlots: [],
                quantity: 1
              },
              {
                content: [
                  {
                    content: [],
                    itemId: '5eff09cd30a7dc22fd1ddfed', // Health Resort east wing room 110 key with a blue tape
                    modSlots: [],
                    quantity: 1
                  },
                  {
                    content: [],
                    itemId: '5672c92d4bdc2d180f8b4567', // Dorm room 118 key
                    modSlots: [],
                    quantity: 1
                  }
                ],
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
        name: 'build'
      } as IBuild,
      'build:12345/slot:pockets_1/item:59fafd4b86f7745ca07e1232/content:1_10/item:5672c92d4bdc2d180f8b4567',
      {
        content: [],
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
                itemId: '57dc2fa62459775949412633', // AKS-74U 5.45x39 assault rifle
                modSlots: [
                  {
                    modSlotName: 'mod_magazine',
                    item: {
                      content: [],
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
        name: 'build'
      } as IBuild,
      'build:12345/slot:onSling_0/item:57dc2fa62459775949412633/mod:mod_magazine/item:564ca9df4bdc2d35148b4569',
      {
        content: [],
        itemId: '564ca9df4bdc2d35148b4569', // AK-74 5.45x39 6L18 45-round magazine
        modSlots: [],
        quantity: 1
      } as IInventoryItem
    ]
  ])('should get an inventory item from a path', (build: IBuild, path: string, expected: IInventoryItem) => {
    // Act
    const inventorySlotResult = PathUtils.getInventoryItemFromPath(build, path)

    // Assert
    expect(inventorySlotResult.success).toBe(true)
    expect(inventorySlotResult.value).toStrictEqual(expected)
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
        name: 'build1'
      } as IBuild,
      'build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/invalid',
      'Path "build:123456789/slot:backpack_0/item:5ca20d5986f774331e7c9602/invalid" is invalid.'
    ]
  ])('should fail when the path is invalid', (build: IBuild, path: string, expected: string) => {
    // Act
    const inventorySlotResult = PathUtils.getInventoryItemFromPath(build, path)

    // Assert
    expect(inventorySlotResult.success).toBe(false)
    expect(inventorySlotResult.failureMessage).toBe(expected)
  })
})