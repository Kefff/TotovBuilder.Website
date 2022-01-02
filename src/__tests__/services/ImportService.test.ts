import { anything, spy, when } from 'ts-mockito'
import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
import { ImportService } from '../../services/ImportService'
import Services from '../../services/repository/Services'

describe('import()', () => {
  it('should import builds', async () => {
    // Arrange
    const importedBuilds: IBuild[] = []

    const buildService = Services.get(BuildService)
    const buildServiceSpy = spy(buildService)
    when(buildServiceSpy.add(anything())).thenCall((build: IBuild) => {
      importedBuilds.push(build)
      return ''
    })

    const importService = new ImportService()
    const builds: IBuild[] = [
      {
        id: '1',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: new Date(1),
        name: '1'
      },
      {
        id: '2',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: new Date(1),
        name: '2'
      }
    ]

    // Act
    importService.import(builds)

    // Assert
    expect(importedBuilds).toStrictEqual(builds)
  })
})