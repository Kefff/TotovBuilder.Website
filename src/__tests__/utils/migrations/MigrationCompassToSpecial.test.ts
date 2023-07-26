import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'
import { IBuild } from '../../../models/build/IBuild'
import { MigrationCompassToSpecial } from '../../../utils/migrations/MigrationCompassToSpecial'
import { describe, expect, it } from 'vitest'

describe('migrateBuildUnrelatedData() and migrateBuild()', () => {
  it('should replaces the compass inventory slot by the special inventory slots in obsolete builds.', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const originalUpdatedDate = new Date(1)
    const obsoleteBuild = {
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5f4f9eb969cdc30ff33f09db', // EYE MK.2 professional hand-held compass
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'compass'
        }
      ],
      lastExported: new Date(1),
      lastUpdated: originalUpdatedDate,
      lastWebsiteVersion: undefined,
      name: 'Obsolete build'
    } as IBuild

    const migration = new MigrationCompassToSpecial()

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
              itemId: '5f4f9eb969cdc30ff33f09db', // EYE MK.2 professional hand-held compass
              modSlots: [],
              quantity: 1
            },
            undefined,
            undefined
          ],
          typeId: 'special'
        }
      ],
      lastExported: new Date(1),
      lastUpdated: obsoleteBuild.lastUpdated, // Needed as the date changes at each execution
      lastWebsiteVersion: undefined,
      name: 'Obsolete build'
    } as IBuild)
  })

  it('should do nothing to builds without compass inventory slot', async () => {
    // Arrange
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
        }
      ],
      lastExported: new Date(1),
      lastUpdated: new Date(1),
      lastWebsiteVersion: undefined,
      name: 'Obsolete build'
    } as IBuild

    const migration = new MigrationCompassToSpecial()

    // Act
    const result = await migration.migrateBuild(obsoleteBuild)

    // Assert
    expect(result.success).toBe(true)
    expect(obsoleteBuild).toStrictEqual(obsoleteBuild)
  })
})