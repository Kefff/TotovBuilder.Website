import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import ItemCategories from '../../../../public/data/item-categories.json'
import { IBackpack } from '../../../models/item/IBackpack'
import { IItem } from '../../../models/item/IItem'
import { IMagazine } from '../../../models/item/IMagazine'
import { ItemService } from '../../../services/ItemService'
import { ItemContentComponentService } from '../../../services/components/ItemContentComponentService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'

describe('getAcceptedItems()', () => {
  it.each([
    [
      '5ca20d5986f774331e7c9602',
      [
        berkut,
        bigStick,
        greenTracer,
        ms2000,
        pso,
        rgd5,
        usgs
      ]
    ],
    [
      '5a7ad2e851dfba0016153692',
      [
        greenTracer,
        pso
      ]
    ]
  ])('should get the acceptem items', async (
    itemId: string,
    expectedItemIds: IItem[]) => {
    // Arrange
    useItemServiceMock(
      true,
      [
        berkut,
        bigStick,
        greenTracer,
        ms2000,
        pso,
        rgd5,
        usgs
      ])

    const itemContentService = new ItemContentComponentService()

    // Act
    const items = await itemContentService.getAcceptedItems(itemId)

    // Assert
    expect(items).toStrictEqual(expectedItemIds)
  })

  it('should get an empty list if the parent item is not found', async () => {
    // Arrange
    const itemContentService = new ItemContentComponentService()

    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(anyString())).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    // Act
    const items = await itemContentService.getAcceptedItems('5ca20d5986f774331e7c9602')

    // Assert
    expect(items.length).toBe(0)
  })

  it.each([
    [berkut],
    [bigStick]
  ])('should ignore accepted items that are not found', async (item: IItem) => {
    // Arrange
    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(item.id)).thenResolve(Result.ok(item))
    when(itemServiceMock.getItems(anything(), true)).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    when(itemServiceMock.getItemCategories()).thenResolve(ItemCategories)
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenResolve(Result.fail(FailureType.hidden, '', 'Error'))
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    const itemContentService = new ItemContentComponentService()

    // Act
    const items = await itemContentService.getAcceptedItems(item.id)

    // Assert
    expect(items.length).toBe(0)
  })
})

describe('getAcceptedItemsCategoryId()', () => {
  it.each([
    ['backpack', undefined],
    ['magazine', 'ammunition']
  ])('should get accepted items category ID', (itemCategoryId: string, expected: string | undefined) => {
    // Act
    const itemContentService = new ItemContentComponentService()
    const categoryIds = itemContentService.getAcceptedItemsCategoryId(itemCategoryId)

    // Assert
    expect(categoryIds).toStrictEqual(expected)
  })
})

const berkut: IBackpack = {
  categoryId: 'backpack',
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-icon.webp',
  id: '5ca20d5986f774331e7c9602',
  imageLink: 'https://assets.tarkov.dev/5ca20d5986f774331e7c9602-image.webp',
  marketLink: 'https://tarkov.dev/item/wartech-berkut-bb-102-backpack-a-tacs-fg',
  maxStackableAmount: 1,
  name: 'WARTECH Berkut BB-102 backpack (A-TACS FG)',
  prices: [],
  shortName: 'Berkut',
  weight: 1,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/WARTECH_Berkut_BB-102_backpack_(A-TACS_FG)',
  capacity: 20,
  ergonomicsPercentageModifier: -0.02,
  movementSpeedPercentageModifier: 0,
  presetWearableModifiers: undefined,
  turningSpeedPercentageModifier: 0
}

const bigStick: IMagazine = {
  categoryId: 'magazine',
  conflictingItemIds: [],
  iconLink: 'https://assets.tarkov.dev/5a7ad2e851dfba0016153692-icon.webp',
  id: '5a7ad2e851dfba0016153692',
  imageLink: 'https://assets.tarkov.dev/5a7ad2e851dfba0016153692-image.webp',
  marketLink: 'https://tarkov.dev/item/glock-9x19-big-stick-33-round-magazine',
  maxStackableAmount: 1,
  name: 'Glock 9x19 \'Big Stick\' 33-round magazine',
  prices: [],
  shortName: 'Big Stick',
  weight: 0.15,
  wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Glock_9x19_%22Big_Stick%22_33-round_magazine',
  capacity: 33,
  baseItemId: undefined,
  defaultPresetId: undefined,
  modSlots: [],
  ergonomicsModifier: -6,
  presetErgonomicsModifier: undefined,
  acceptedAmmunitionIds: [
    '5efb0da7a29a85116f6ea05f',
    '5c3df7d588a4501f290594e5',
    '58864a4f2459770fcc257101',
    '56d59d3ad2720bdb418b4577',
    '5c925fa22e221601da359b7b',
    '5a3c16fe86f77452b62de32a',
    '5efb0e16aeb21837e749c7ff',
    '5c0d56a986f774449d5de529',
    '64b7bbb74b75259c590fa897'
  ],
  checkSpeedPercentageModifier: -0.3,
  loadSpeedPercentageModifier: -0.1,
  malfunctionPercentage: 0.182
}

const rgd5 = {
  categoryId: 'grenade',
  id: '5448be9a4bdc2dfd2f8b456a' // RGD-5 hand grenade
} as IItem

const greenTracer = {
  categoryId: 'ammunition',
  id: '5c3df7d588a4501f290594e5' // 9x19mm Green Tracer (Mechanic 1)
} as IItem

const pso = {
  categoryId: 'ammunition',
  id: '58864a4f2459770fcc257101' // 9x19mm PSO gzh
} as IItem

const usgs = {
  categoryId: 'ammunition',
  id: '56dff4ecd2720b5f5a8b4568' // 5.45x39mm US gs
} as IItem

const ms2000 = {
  categoryId: 'special',
  id: '5991b51486f77447b112d44f' // MS2000 Marker
} as IItem