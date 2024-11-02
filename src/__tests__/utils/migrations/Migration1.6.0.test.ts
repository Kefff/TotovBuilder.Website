import { describe, expect, it } from 'vitest'
import { IBuild } from '../../../models/build/IBuild'
import { ItemCategoryId } from '../../../models/item/IItem'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { Migration160 } from '../../../utils/migrations/Migration1.6.0'
import { berkut, m9a3, m9a3Default, rpk16, rpk16Default } from '../../__data__/itemMocks'
import { useItemServiceMock } from '../../__mocks__/ItemServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('migrateBuildUnrelatedData() and migrateBuild()', () => {
  it('should update obsolete builds to use the default preset item instead of the base item for their weapons', async () => {
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
              itemId: rpk16.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: m9a3.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'holster'
        },
        {
          items: [
            {
              content: [],
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
      lastWebsiteVersion: '1.5.3',
      name: 'Obsolete build'
    } as IBuild

    const migration = new Migration160()

    // Act
    const result1 = await migration.migrateBuildUnrelatedDataPromise()
    const result2 = await migration.migrateBuildPromise(obsoleteBuild)

    // Assert
    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(obsoleteBuild).toStrictEqual({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: rpk16Default.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: m9a3Default.id,
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'holster'
        },
        {
          items: [
            {
              content: [],
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
      lastWebsiteVersion: '1.5.3',
      name: 'Obsolete build'
    } as IBuild)
  })

  it('should do nothing to invalid items and items without default preset id', async () => {
    // Arrange
    useItemServiceMock(
      true,
      [
        {
          baseItemId: undefined,
          caliber: '',
          categoryId: ItemCategoryId.mainWeapon,
          conflictingItemIds: [],
          defaultPresetId: undefined,
          ergonomics: 0,
          fireModes: [],
          fireRate: 0,
          horizontalRecoil: 0,
          iconLink: '',
          id: 'itemWithoutDefaultPresetId',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          minuteOfAngle: undefined,
          modSlots: [],
          name: 'Item without default preset id',
          presetRangedWeaponModifiers: undefined,
          prices: [],
          shortName: 'IWDPI',
          verticalRecoil: 0,
          weight: 0,
          wikiLink: ''
        } as IRangedWeapon])
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
          typeId: 'onSling'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: 'itemWithoutDefaultPresetId',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onBack'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.5.3',
      name: 'Obsolete build'
    } as IBuild

    const migration = new Migration160()

    // Act
    const result = await migration.migrateBuildPromise(obsoleteBuild)

    // Assert
    expect(result).toBe(false)
    expect(obsoleteBuild).toStrictEqual(obsoleteBuild)
  })
})