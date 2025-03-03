import { anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { FileService } from '../../services/FileService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { ImportService } from '../../services/ImportService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { VersionService } from '../../services/VersionService'
import Services from '../../services/repository/Services'
import { alpha, bayonet6Kh5, berkut, rgd5 } from '../__data__/itemMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { usePresetServiceMock } from '../__mocks__/PresetServiceMock'
import { useTarkovValuesServiceMock } from '../__mocks__/TarkovValuesServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('ImportService', () => {
  describe('getBuildsFromFileAsync', () => {
    it('should read builds from a file and execute migrations on them', async () => {
      // Arrange
      useItemServiceMock()
      usePresetServiceMock()
      useTarkovValuesServiceMock()
      useWebsiteConfigurationServiceMock()

      const fileServiceMock = mock<FileService>()
      when(fileServiceMock.readFile(anything())).thenResolve('[{"id":"3135f838-cc8b-f82c-b3c9-1ade1d890d50","name":"Build 1","inventorySlots":[{"items":[null],"typeId":"onSling"},{"items":[null],"typeId":"onBack"},{"items":[null],"typeId":"holster"},{"items":[null],"typeId":"bodyArmor"},{"items":[null],"typeId":"tacticalRig"},{"items":[null],"typeId":"headwear"},{"items":[null],"typeId":"earpiece"},{"items":[{"content":[],"ignorePrice":false,"itemId":"5ca20d5986f774331e7c9602","modSlots":[],"quantity":1}],"typeId":"backpack"},{"items":[null,null,null,null],"typeId":"pockets"},{"items":[null],"typeId":"eyewear"},{"items":[null],"typeId":"faceCover"},{"items":[{"content":[],"ignorePrice":false,"itemId":"544a11ac4bdc2d470e8b456a","modSlots":[],"quantity":1}],"typeId":"pouch"},{"items":[{"content":[],"ignorePrice":false,"itemId":"5bffdc370db834001d23eca8","modSlots":[],"quantity":1}],"typeId":"scabbard"},{"items":[null],"typeId":"armband"},{"items":[null,null,null],"typeId":"special"}],"lastWebsiteVersion":"1.8.1"},{"id":"d19ce943-ea1c-d808-f486-592287eb7b22","name":"Build 2","inventorySlots":[{"items":[null],"typeId":"onSling"},{"items":[null],"typeId":"onBack"},{"items":[null],"typeId":"holster"},{"items":[null],"typeId":"bodyArmor"},{"items":[null],"typeId":"tacticalRig"},{"items":[null],"typeId":"headwear"},{"items":[null],"typeId":"earpiece"},{"items":[null],"typeId":"backpack"},{"items":[{"content":[],"ignorePrice":false,"itemId":"5448be9a4bdc2dfd2f8b456a","modSlots":[],"quantity":1},null,null,null],"typeId":"pockets"},{"items":[null],"typeId":"eyewear"},{"items":[null],"typeId":"faceCover"},{"items":[{"content":[],"ignorePrice":false,"itemId":"544a11ac4bdc2d470e8b456a","modSlots":[],"quantity":1}],"typeId":"pouch"},{"items":[{"content":[],"ignorePrice":false,"itemId":"5bffdc370db834001d23eca8","modSlots":[],"quantity":1}],"typeId":"scabbard"},{"items":[null],"typeId":"armband"},{"items":[null,null,null],"typeId":"special"}],"lastWebsiteVersion":"1.8.1"}]')
      Services.configure(FileService, undefined, instance(fileServiceMock))

      const logServiceMock = mock<LogService>()
      Services.configure(LogService, undefined, instance(logServiceMock))

      const versionServiceMock = mock<VersionService>()
      when(versionServiceMock.executeBuildMigrationsAsync(anything())).thenResolve(true)
      Services.configure(VersionService, undefined, instance(versionServiceMock))

      Services.configure(BuildPropertiesService)
      Services.configure(GlobalFilterService)
      Services.configure(InventoryItemService)
      Services.configure(InventorySlotPropertiesService)
      Services.configure(ItemPropertiesService)

      const fileMock = mock<File>()

      const service = new ImportService()

      // Act
      const result = await service.getBuildsFromFileAsync(instance(fileMock))

      // Assert
      expect(result).not.toBeUndefined()
      expect(result).toMatchObject([ // toMatchObject used because the dates of the builds are set with the date of the import
        {
          id: '3135f838-cc8b-f82c-b3c9-1ade1d890d50',
          inventorySlots: [
            {
              items: [null],
              typeId: 'onSling'
            },
            {
              items: [null],
              typeId: 'onBack'
            },
            {
              items: [null],
              typeId: 'holster'
            },
            {
              items: [null],
              typeId: 'bodyArmor'
            },
            {
              items: [null],
              typeId: 'tacticalRig'
            },
            {
              items: [null],
              typeId: 'headwear'
            },
            {
              items: [null],
              typeId: 'earpiece'
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
            },
            {
              items: [
                null,
                null,
                null,
                null
              ],
              typeId: 'pockets'
            },
            {
              items: [null],
              typeId: 'eyewear'
            },
            {
              items: [null],
              typeId: 'faceCover'
            },
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: alpha.id,
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'pouch'
            },
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: bayonet6Kh5.id,
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'scabbard'
            },
            {
              items: [null],
              typeId: 'armband'
            },
            {
              items: [
                null,
                null,
                null
              ],
              typeId: 'special'
            }
          ],
          lastWebsiteVersion: '1.8.1',
          name: 'Build 1'
        },
        {
          id: 'd19ce943-ea1c-d808-f486-592287eb7b22',
          inventorySlots: [
            {
              items: [null],
              typeId: 'onSling'
            },
            {
              items: [null],
              typeId: 'onBack'
            },
            {
              items: [null],
              typeId: 'holster'
            },
            {
              items: [null],
              typeId: 'bodyArmor'
            },
            {
              items: [null],
              typeId: 'tacticalRig'
            },
            {
              items: [null],
              typeId: 'headwear'
            },
            {
              items: [null],
              typeId: 'earpiece'
            },
            {
              items: [null],
              typeId: 'backpack'
            },
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: rgd5.id,
                  modSlots: [],
                  quantity: 1
                },
                null,
                null,
                null
              ],
              typeId: 'pockets'
            },
            {
              items: [null],
              typeId: 'eyewear'
            },
            {
              items: [null],
              typeId: 'faceCover'
            },
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: alpha.id,
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'pouch'
            },
            {
              items: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: bayonet6Kh5.id,
                  modSlots: [],
                  quantity: 1
                }
              ],
              typeId: 'scabbard'
            },
            {
              items: [null],
              typeId: 'armband'
            },
            {
              items: [
                null,
                null,
                null
              ],
              typeId: 'special'
            }
          ],
          lastWebsiteVersion: '1.8.1',
          name: 'Build 2'
        }
      ])
      verify(versionServiceMock.executeBuildMigrationsAsync(anything())).twice()
    })

    it('should log an error and notify when the file is null', async () => {
      // Arrange
      const logServiceMock = mock<LogService>()
      Services.configure(LogService, undefined, instance(logServiceMock))

      const notificationServiceMock = mock<NotificationService>()
      Services.configure(NotificationService, undefined, instance(notificationServiceMock))

      useWebsiteConfigurationServiceMock()

      const service = new ImportService()

      // Act
      const result = await service.getBuildsFromFileAsync(undefined)

      // Assert
      expect(result).toBeUndefined()
      verify(logServiceMock.logError('message.invalidBuildFile'))
      verify(notificationServiceMock.notify(NotificationType.error, 'Error while importing builds.'))
    })

    it('should do nothing when the file content is null', async () => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const fileServiceMock = mock<FileService>()
      when(fileServiceMock.readFile(anything())).thenResolve(undefined)
      Services.configure(FileService, undefined, instance(fileServiceMock))

      Services.configure(NotificationService)

      const fileMock = mock<File>()

      const service = new ImportService()

      // Act
      const result = await service.getBuildsFromFileAsync(instance(fileMock))

      // Assert
      expect(result).toBeUndefined()
    })

    it.each([
      [''],
      ['{}'],
      ['[]']
    ])('should log an error and notify when builds cannot be parsed', async (fileContent: string) => {
      // Arrange
      useWebsiteConfigurationServiceMock()

      const fileServiceMock = mock<FileService>()
      when(fileServiceMock.readFile(anything())).thenResolve(fileContent)
      Services.configure(FileService, undefined, instance(fileServiceMock))

      const logServiceMock = mock<LogService>()
      Services.configure(LogService, undefined, instance(logServiceMock))

      const notificationServiceMock = mock<NotificationService>()
      Services.configure(NotificationService, undefined, instance(notificationServiceMock))

      const fileMock = mock<File>()

      const service = new ImportService()

      // Act
      const result = await service.getBuildsFromFileAsync(instance(fileMock))

      // Assert
      expect(result).toBeUndefined()
      verify(logServiceMock.logError('Error while importing builds.'))
      verify(notificationServiceMock.notify(NotificationType.error, 'Error while importing builds.'))
    })
  })

  describe('importAsync', () => {
    it('should import builds', async () => {
      // Arrange
      let imported = false
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

      const buildServiceMock = mock<BuildService>()
      when(buildServiceMock.addAsync(anything())).thenCall((build: IBuild) => {
        importedBuilds.push(build)
        return ''
      })
      Services.configure(BuildService, undefined, instance(buildServiceMock))

      const notificationServiceMock = mock<NotificationService>()
      Services.configure(NotificationService, undefined, instance(notificationServiceMock))

      const importedBuilds: IBuild[] = []

      const importService = new ImportService()
      importService.emitter.once(ImportService.buildsImportedEvent, () => {
        imported = true
      })

      // Act
      await importService.importAsync(builds)

      // Assert
      expect(imported).toBe(true)
      expect(importedBuilds).toStrictEqual(builds)
      verify(notificationServiceMock.notify(NotificationType.success, 'Builds imported'))
    })
  })
})