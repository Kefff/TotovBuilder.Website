import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { ReductionService } from '../../services/ReductionService'
import { ak12PistolGrip, berkut, rpk16Default } from '../__data__/itemMocks'

const inventoryItem: IInventoryItem = {
  content: [
    {
      content: [],
      ignorePrice: false,
      itemId: rpk16Default.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: ak12PistolGrip.id,
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
  itemId: berkut.id,
  modSlots: [],
  quantity: 2
}

const reducedInventoryItem = {
  'c': [
    {
      'i': rpk16Default.id,
      'm': [
        {
          'i': {
            'i': ak12PistolGrip.id
          },
          'n': 'mod_pistol_grip'
        }
      ]
    }
  ],
  'p': 1,
  'i': berkut.id,
  'q': 2
}

describe('parseReducedInventoryItem', () => {
  it('should parse a reduced inventory item', () => {
    // Arrange
    const service = new ReductionService()

    // Act
    const inventoryItem = service.parseReducedInventoryItem(reducedInventoryItem)

    // Assert
    expect(inventoryItem).toStrictEqual(inventoryItem)
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