import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { ReductionService } from '../../services/ReductionService'

const inventoryItem: IInventoryItem = {
  content: [
    {
      content: [],
      ignorePrice: false,
      itemId: '584147732459775a2b6d9f12',
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: '57e3dba62459770f0c32322b',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'mod_pistol_grip'
        }
      ],
      quantity: 1
    }
  ],
  ignorePrice: true,
  itemId: '5ab8ebf186f7742d8b372e80',
  modSlots: [],
  quantity: 2
}

const reducedInventoryItem = {
  'c': [
    {
      'i': '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle
      'm': [
        {
          'i': {
            'i': '57e3dba62459770f0c32322b' // AK bakelite pistol grip (6P4 Sb.9)
          },
          'n': 'mod_pistol_grip'
        }
      ]
    }
  ],
  'p': 1,
  'i': '5ab8ebf186f7742d8b372e80', // SSO Attack 2 raid backpack
  'q': 2
}

describe('parseReducedInventoryItem', () => {
  it('should parse a reduced inventory item', () => {
    // Arrange
    const service = new ReductionService()

    // Act
    const result = service.parseReducedInventoryItem(reducedInventoryItem)

    // Assert
    expect(result.success).toBe(true)
    expect(result.value).toStrictEqual(inventoryItem)
  })
})

describe('reduceInventoryItem', () => {
  it('should reduce an inventory item', () => {
    // Arrange
    const service = new ReductionService()

    // Act
    const result = service.reduceInventoryItem(inventoryItem)

    // Assert
    expect(result).toStrictEqual(reducedInventoryItem)
  })
})