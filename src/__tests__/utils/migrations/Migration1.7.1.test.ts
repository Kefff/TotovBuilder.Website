import { anyString, anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../../models/build/IBuild'
import { IArmor } from '../../../models/item/IArmor'
import { IItem } from '../../../models/item/IItem'
import { ItemService } from '../../../services/ItemService'
import Services from '../../../services/repository/Services'
import Result, { FailureType } from '../../../utils/Result'
import { Migration171 } from '../../../utils/migrations/Migration1.7.1'
import { ItemMocks, armor6b13Fl, armor6b13FlDefault, banshee, bansheeDefault, berkut, lshZ2dtm } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

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
              itemId: armor6b13Fl.id,
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
              itemId: banshee.id,
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
              itemId: lshZ2dtm.id,
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
              itemId: berkut.id,
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
              itemId: armor6b13FlDefault.id,
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
              itemId: bansheeDefault.id,
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
              itemId: lshZ2dtm.id,
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
              itemId: berkut.id,
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
        } as unknown as IArmor])
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
    when(itemServiceMock.getItem(anyString())).thenCall((id: string) => Result.ok(ItemMocks.find(i => i.id === id) as IItem))
    when(itemServiceMock.getItemsOfCategories(anything(), anything())).thenCall((ids: string[]) => {
      if (ids[0] === 'armor') {
        return Result.fail(FailureType.error, undefined, 'Error')
      }

      return Result.ok(ItemMocks.filter(i => ids.some(id => i.categoryId === id)) as IItem[])
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
              itemId: armor6b13Fl.id,
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
              itemId: banshee.id,
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
              itemId: armor6b13Fl.id,
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
              itemId: bansheeDefault.id,
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