import { describe, expect, it } from 'vitest'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { Migration171 } from '../../../utils/migrations/Migration1.7.1'
import { IBuild } from '../../../models/build/IBuild'
import { IArmor } from '../../../models/item/IArmor'
import Services from '../../../services/repository/Services'
import { ItemService } from '../../../services/ItemService'
import { anyString, anything, instance, mock, when } from 'ts-mockito'
import Result, { FailureType } from '../../../utils/Result'
import ItemsMock from '../../__data__/items'
import { IItem } from '../../../models/item/IItem'

describe('migrateBuildUnrelatedData() and migrateBuild()', () => {
  it('should update obsolete builds to use the default preset item instead of the base item for their armored items', async () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const obsoleteBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5c0e53c886f7747fa54205c7', // 6B13 assault armor (Digital Flora)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'bodyArmor'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5d5d646386f7742797261fd9', // 6B3TM-01 armored rig (Khaki)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'tacticalRig'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5aa7cfc0e5b5b00015693143', // 6B47 Ratnik-BSh helmet (Digital Flora cover)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'headwear'
        },
        {
          items: [
            {
              ignorePrice: false,
              itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack (A-TACS FG)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'backpack'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.7.0',
      name: 'Obsolete build'
    } as IBuild

    const migration = new Migration171()

    // Act
    const result1 = await migration.migrateBuildUnrelatedData()
    const result2 = await migration.migrateBuild(obsoleteBuild)

    // Assert
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
    expect(obsoleteBuild).toStrictEqual({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '657123216d197c216005b354', // 6B13 assault armor (Digital Flora) Default
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'bodyArmor'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '6576600186f11bca4106d331', // 6B3TM-01 armored rig (Khaki) Default
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'tacticalRig'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '657bc6ceaab96fccee08beb2', // 6B47 Ratnik-BSh helmet (Digital Flora cover) Default
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'headwear'
        },
        {
          items: [
            {
              ignorePrice: false,
              itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack (A-TACS FG)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'backpack'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.7.0',
      name: 'Obsolete build'
    } as IBuild)
  })

  it('should do nothing to invalid items and items without a preset that contains "Default" in its name', async () => {
    // Arrange
    useItemServiceMock(
      true,
      [
        {
          armorClass: 0,
          armoredAreas: [
            'Thorax',
            'Stomach'
          ],
          durability: 0,
          ergonomicsPercentageModifier: 0,
          material: 'Aramid',
          movementSpeedPercentageModifier: 0,
          ricochetChance: '',
          turningSpeedPercentageModifier: 0,
          categoryId: 'armor',
          presetWearableModifiers: undefined,
          conflictingItemIds: [],
          iconLink: '',
          id: 'itemWithoutPresetWithDefaultInName',
          imageLink: '',
          maxStackableAmount: 1,
          marketLink: 'https://tarkov.dev/item/paca-soft-armor',
          name: 'Item without preset with "Default" in name',
          prices: [],
          shortName: 'IWPWDIN',
          weight: 0,
          wikiLink: ''
        } as IArmor])
    useWebsiteConfigurationServiceMock()

    const obsoleteBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            null,
            {
              content: [],
              ignorePrice: false,
              itemId: 'invalid',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'tacticalRig'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'itemWithoutPresetWithDefaultInName',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'bodyArmor'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.7.0',
      name: 'Obsolete build'
    } as IBuild

    const migration = new Migration171()

    // Act
    const result = await migration.migrateBuild(obsoleteBuild)

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('Item "invalid" not found.')
    expect(obsoleteBuild).toStrictEqual(obsoleteBuild)
  })

  it('should do nothing to an item when fetching items of its type fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.getItem(anyString())).thenCall((id: string) => Result.ok(ItemsMock.find(i => i.id === id) as IItem))
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenCall((ids: string[]) => {
      if (ids[0] === 'armor') {
        return Result.fail(FailureType.error, undefined, 'Error')
      }

      return Result.ok(ItemsMock.filter(i => ids.some(id => i.categoryId === id)) as IItem[])
    })
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    const obsoleteBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5c0e53c886f7747fa54205c7', // 6B13 assault armor (Digital Flora)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'bodyArmor'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5d5d646386f7742797261fd9', // 6B3TM-01 armored rig (Khaki)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'tacticalRig'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.7.0',
      name: 'Obsolete build'
    } as IBuild

    const migration = new Migration171()

    // Act
    const result1 = await migration.migrateBuildUnrelatedData()
    const result2 = await migration.migrateBuild(obsoleteBuild)

    // Assert
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(false)
    expect(result2.failureMessage).toBe('Error')
    expect(obsoleteBuild).toStrictEqual({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5c0e53c886f7747fa54205c7', // 6B13 assault armor (Digital Flora)
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'bodyArmor'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '6576600186f11bca4106d331', // 6B3TM-01 armored rig (Khaki) Default
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'tacticalRig'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.7.0',
      name: 'Obsolete build'
    } as IBuild)
  })
})