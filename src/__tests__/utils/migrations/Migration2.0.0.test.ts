import { TinyEmitter } from 'tiny-emitter'
import { anything, instance, mock, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IGlobalFilter } from '../../../models/utils/IGlobalFilter'
import { GlobalFilterService } from '../../../services/GlobalFilterService'
import { ItemService } from '../../../services/ItemService'
import Services from '../../../services/repository/Services'
import { Migration200 } from '../../../utils/migrations/Migration2.0.0'
import { useTarkovValuesServiceMock } from '../../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('migrateBuildUnrelatedData and migrateBuild', () => {
  it('should update initialize the new properties of the global filter', async () => {
    // Arrange
    useTarkovValuesServiceMock()
    useWebsiteConfigurationServiceMock()

    const originalGlobalFilter: IGlobalFilter = {
      excludeItemsWithoutMatchingPrice: false,
      excludePresetBaseItems: false,
      merchantFilters: [
        {
          enabled: true,
          merchant: 'prapor',
          merchantLevel: 1
        },
        {
          enabled: false,
          merchant: 'mechanic',
          merchantLevel: 2
        }
      ]
    }
    let savedGlobalFilter: IGlobalFilter | undefined = undefined

    const globalFilterServiceMock = mock<GlobalFilterService>()
    when(globalFilterServiceMock.get()).thenReturn({
      excludeItemsWithoutMatchingPrice: false,
      excludePresetBaseItems: false,
      merchantFilters: [
        {
          enabled: true,
          merchant: 'prapor',
          merchantLevel: 1
        },
        {
          enabled: false,
          merchant: 'mechanic',
          merchantLevel: 2
        }
      ]
    })
    when(globalFilterServiceMock.save(anything())).thenCall((gf: IGlobalFilter) => savedGlobalFilter = gf)
    Services.configure(GlobalFilterService, undefined, instance(globalFilterServiceMock))

    const itemServiceMockEmitter = new TinyEmitter()
    const itemServiceMock = mock<ItemService>()
    when(itemServiceMock.emitter).thenReturn(itemServiceMockEmitter)
    Services.configure(ItemService, undefined, instance(itemServiceMock))

    const migration = new Migration200()

    // Act
    const result1 = await migration.migrateBuildUnrelatedDataPromise()
    const result2 = await migration.migrateBuildPromise()
    itemServiceMockEmitter.emit(ItemService.initializationFinishedEvent)

    // Assert
    expect(result1).toBe(true)
    expect(result2).toBe(true)
    expect(savedGlobalFilter).not.toBe(undefined)
    expect(savedGlobalFilter!.excludeItemsWithoutMatchingPrice).toBe(true)
    expect(savedGlobalFilter!.excludePresetBaseItems).toBe(true)
    expect(savedGlobalFilter!.merchantFilters).toStrictEqual(originalGlobalFilter.merchantFilters)
  })
})