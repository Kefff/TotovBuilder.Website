import { useItemServiceMock } from '../../../__mocks__/ItemServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'
import { IBuild } from '../../../models/build/IBuild'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import { Migration160 } from '../../../utils/migrations/Migration1.6.0'
import { describe, expect, it } from 'vitest'

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
              itemId: '57dc2fa62459775949412633', // Kalashnikov AKS-74U 5.45x39 assault rifle
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
              itemId: '57dc2fa62459775949412633', // Kalashnikov AKS-74U 5.45x39 assault rifle
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
              itemId: '5e81c3cbac2bb513793cdc75', // Colt M1911A1 .45 ACP pistol
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
              itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
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
    const result1 = await migration.migrateBuildUnrelatedData()
    const result2 = await migration.migrateBuild(obsoleteBuild)

    // Assert
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
    expect(obsoleteBuild).to.deep.equal({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
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
              itemId: '584147732459775a2b6d9f12', // Kalashnikov AKS-74U 5.45x39 assault rifle Default
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
              itemId: '5eb2968186f7746d1f1a4fd5', // Colt M1911A1 .45 ACP pistol Default
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
              itemId: '5ca20d5986f774331e7c9602', // WARTECH Berkut BB-102 backpack
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
          baseItemId: null,
          caliber: '',
          categoryId: 'mainWeapon',
          conflictingItemIds: [],
          defaultPresetId: null,
          ergonomics: 0,
          fireModes: [],
          fireRate: 0,
          horizontalRecoil: 0,
          iconLink: '',
          id: 'itemWithoutDefaultPresetId',
          imageLink: '',
          marketLink: '',
          maxStackableAmount: 1,
          modSlots: [],
          name: 'Item without default preset id',
          presetErgonomics: undefined,
          presetHorizontalRecoil: undefined,
          presetVerticalRecoil: undefined,
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
    const result = await migration.migrateBuild(obsoleteBuild)

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe('')
    expect(obsoleteBuild).to.deep.equal(obsoleteBuild)
  })

  it('should do nothing to builds already up to date', async () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const upToDataBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '57dc2fa62459775949412633', // Kalashnikov AKS-74U 5.45x39 assault rifle
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: '1.6.0',
      name: 'Up to date build'
    } as IBuild

    const migration = new Migration160()

    // Act
    const result = await migration.migrateBuild(upToDataBuild)

    // Assert
    expect(result.success).toBe(true)
    expect(upToDataBuild).to.deep.equal(upToDataBuild)
  })
})