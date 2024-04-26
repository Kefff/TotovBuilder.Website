import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IItem } from '../../../models/item/IItem'
import { ItemService } from '../../../services/ItemService'
import { ModSlotComponentService } from '../../../services/components/ModSlotComponentService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { razor } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'

describe('getAcceptedItems()', () => {
  it('should get the acceptem items', async () => {
    // Arrange
    useItemServiceMock(true, [ags74, m3PGrip, scorpius, razor])

    const modSlotService = new ModSlotComponentService()

    // Act
    const items = await modSlotService.getAcceptedItems([
      ags74.id,
      scorpius.id
    ])

    // Assert
    expect(items).toStrictEqual([ags74, scorpius])
  })

  it('should ignore accepted items that are not found', async () => {
    // Arrange
    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItems(anything(), true)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    const modSlotService = new ModSlotComponentService()

    // Act
    const items = await modSlotService.getAcceptedItems(['5ca20d5986f774331e7c9602'])

    // Assert
    expect(items.length).toBe(0)
  })
})

describe('getAcceptedItemsCategoryId()', () => {
  it.each([
    [
      [
        scorpius,
        razor
      ],
      undefined
    ],
    [
      [
        razor
      ],
      'headphones'
    ]
  ])('should get the accepted items category ID', (items: IItem[], expected: string | undefined) => {
    // Arrange
    const modSlotService = new ModSlotComponentService()

    // Act
    const categoryIds = modSlotService.getAcceptedItemsCategoryId(items)

    // Assert
    expect(categoryIds).toBe(expected)
  })
})

const ags74 = {
  categoryId: 'rangedWeaponMod',
  id: '6087e663132d4d12c81fd96b'
} as IItem

const m3PGrip = {
  categoryId: 'rangedWeaponMod',
  id: '6259c3d8012d6678ec38eeb8'
} as IItem

const scorpius = {
  categoryId: 'rangedWeaponMod',
  id: '5f6341043ada5942720e2dc5'
} as IItem