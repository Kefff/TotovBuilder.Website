import { describe, expect, it } from 'vitest'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IArmorPlateModifiers } from '../../models/utils/IArmorPlateModifiers'
import { ArmorUtils } from '../../utils/ArmorUtils'
import { armor6b13FlDefault, bansheeDefault, cultLocust, iskra, monocletePe, paca, plate6b33Back } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'

describe('getArmorPenetrationTooltip()', () => {
  it.each([
    [1, 0, `Armor class 1 penetration : 0
Penetrated after > 20 bullets`],
    [2, 1, `Armor class 2 penetration : 1
Penetrated after 13 - 20 bullets`],
    [3, 2, `Armor class 3 penetration : 2
Penetrated after 9 - 13 bullets`],
    [4, 3, `Armor class 4 penetration : 3
Penetrated after 5 - 9 bullets`],
    [5, 4, `Armor class 5 penetration : 4
Penetrated after 3 - 5 bullets`],
    [6, 5, `Armor class 6 penetration : 5
Penetrated after 1 - 3 bullets`],
    [6, 6, `Armor class 6 penetration : 6
Penetrated after < 1 bullets`]
  ])('should get the tooltip for an armor penetration', (armorClass: number, penetration: number, expected: string) => {
    // Arrange
    useTarkovValuesServiceMock()

    // Act
    const tooltip = ArmorUtils.getArmorPenetrationTooltip(armorClass, penetration)

    // Assert
    expect(tooltip).toBe(expected)
  })
})

describe('getFrontPlateArmorClass()', () => {
  it.each([
    [
      {
        content: [],
        itemId: armor6b13FlDefault.id,
        ignorePrice: false,
        modSlots: [
          {
            item: {
              content: [],
              itemId: cultLocust.id,
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'front_plate'
          },
          {
            item: {
              content: [],
              itemId: plate6b33Back.id,
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'back_plate'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        armorClass: cultLocust.armorClass,
        durability: cultLocust.durability
      } as IArmorPlateModifiers
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: bansheeDefault.id,
        modSlots: [
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: cultLocust.id,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'front_plate'
          },
          {
            item: {
              content: [],
              ignorePrice: false,
              itemId: monocletePe.id,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'back_plate'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      {
        armorClass: cultLocust.armorClass,
        durability: cultLocust.durability
      } as IArmorPlateModifiers
    ],
    [
      {
        content: [],
        itemId: armor6b13FlDefault.id,
        ignorePrice: false,
        modSlots: [
          {
            item: undefined,
            modSlotName: 'front_plate'
          },
          {
            item: {
              content: [],
              itemId: plate6b33Back.id,
              ignorePrice: false,
              modSlots: [],
              quantity: 1
            },
            modSlotName: 'back_plate'
          }
        ],
        quantity: 1
      } as IInventoryItem,
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: paca.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      undefined
    ],
    [
      {
        content: [],
        ignorePrice: false,
        itemId: iskra.id,
        modSlots: [],
        quantity: 1
      } as IInventoryItem,
      undefined
    ]
  ])('should get the armor class of the front ballistic plate of the inventory item', async (inventoryItem: IInventoryItem, expected: IArmorPlateModifiers | undefined) => {
    // Arrange
    useItemServiceMock()

    // Act
    const armorClassResult = await ArmorUtils.getFrontPlateArmorClass(inventoryItem)

    // Assert
    if (expected == null) {
      expect(armorClassResult).toBe(expected)
    } else {
      expect(armorClassResult!.success).toBe(true)
      expect(armorClassResult!.value).toStrictEqual(expected)
    }
  })

  it('should fail when the item cannot be found', async () => {
    // Arrange
    useItemServiceMock()

    // Act
    const armorClassResult = await ArmorUtils.getFrontPlateArmorClass({
      content: [],
      ignorePrice: false,
      itemId: bansheeDefault.id,
      modSlots: [
        {
          item: {
            content: [],
            ignorePrice: false,
            itemId: 'invalid',
            modSlots: [],
            quantity: 1
          },
          modSlotName: 'front_plate'
        }
      ],
      quantity: 1
    })

    // Assert
    expect(armorClassResult!.success).toBe(false)
    expect(armorClassResult!.failureMessage).toBe('Item "invalid" not found.')
  })
})