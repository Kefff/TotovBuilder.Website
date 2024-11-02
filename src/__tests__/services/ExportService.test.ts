import { anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { FileService } from '../../services/FileService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import { build1, build2 } from '../__data__/buildMocks'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

describe('ExportService', () => {
  describe('exportAsync()', () => {
    it('should export builds and notify', async () => {
      // Arrange
      let exported = false
      const oldBuild1ExportedDate = build1.lastExported
      const oldBuild2ExportedDate = build2.lastExported

      useWebsiteConfigurationServiceMock()

      const buildServiceMock = mock<BuildService>()
      Services.configure(BuildService, undefined, buildServiceMock)

      const fileServiceMock = mock<FileService>()
      when(fileServiceMock.writeFile(anything(), anything())).thenReturn(true)
      Services.configure(FileService, undefined, instance(fileServiceMock))

      const notificationServiceMock = mock<NotificationService>()
      Services.configure(NotificationService, undefined, instance(notificationServiceMock))

      const service = new ExportService()
      service.emitter.once(ExportService.buildsExportedEvent, () => {
        exported = true
      })

      // Act
      await service.exportAsync([build1, build2])

      // Assert
      expect(exported).toBe(true)
      expect(build1.lastExported).not.toBe(oldBuild1ExportedDate)
      expect(build2.lastExported).not.toBe(oldBuild2ExportedDate)
      verify(buildServiceMock.updateAsync(build1))
      verify(buildServiceMock.updateAsync(build2))
      verify(notificationServiceMock.notify(NotificationType.success, 'Builds file saved.'))
    })

    it('should do nothing when the file save fails', async () => {
      // Arrange
      let exported = false

      useWebsiteConfigurationServiceMock()

      const fileServiceMock = mock<FileService>()
      when(fileServiceMock.writeFile(anything(), anything(), anything())).thenReturn(false)
      Services.configure(FileService, undefined, instance(fileServiceMock))

      const service = new ExportService()
      service.emitter.once(ExportService.buildsExportedEvent, () => {
        exported = true
      })

      // Act
      await service.exportAsync([build1])

      // Assert
      expect(exported).toBe(false)
    })
  })
})