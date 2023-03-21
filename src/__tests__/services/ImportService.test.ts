import { anything, instance, mock, when } from 'ts-mockito'
import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
import { ImportService } from '../../services/ImportService'
import Services from '../../services/repository/Services'

describe('import()', () => {
  it('should import builds', async () => {
    // Arrange
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.add(anything())).thenCall((build: IBuild) => {
      importedBuilds.push(build)
      return ''
    })
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const importedBuilds: IBuild[] = []

    const importService = new ImportService()
    const builds: IBuild[] = [
      {
        id: '1',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: '1.0.0',
        name: '1'
      },
      {
        id: '2',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: '1.0.0',
        name: '2'
      }
    ]

    // Act
    await importService.import(builds)

    // Assert
    expect(importedBuilds).toStrictEqual(builds)
  })
})