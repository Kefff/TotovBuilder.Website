import { anyString, anything, instance, mock, verify, when } from 'ts-mockito'
import { describe, expect, it } from 'vitest'
import { Router } from 'vue-router'
import { IBuild } from '../../../models/build/IBuild'
import { BuildService } from '../../../services/BuildService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import { BuildComponentService } from '../../../services/components/BuildComponentService'
import Services from '../../../services/repository/Services'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'

describe('getBuild()', () => {
  it('should get a build', () => {
    // Arrange
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.get('123')).thenReturn({
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Test'
    } as IBuild)
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const buildComponentService = new BuildComponentService()

    // Act
    const build = buildComponentService.getBuild('123')

    // Assert
    expect(build).toStrictEqual({
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Test'
    })
    verify(buildServiceMock.get('123')).once()
  })

  it('should return a new build when no build id is provided', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.create()).thenReturn({
      id: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    })
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    // Act
    const build = buildComponentService.getBuild(undefined)

    // Assert
    expect(build).toStrictEqual({
      id: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    } as IBuild)
  })

  it('should return a new build the build is not found', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.get('123')).thenReturn(undefined)
    when(buildServiceMock.create()).thenReturn({
      id: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    })
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    // Act
    const build = buildComponentService.getBuild('123')

    // Assert
    expect(build).toStrictEqual({
      id: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    } as IBuild)
    verify(buildServiceMock.get('123')).once()
    verify(buildServiceMock.create()).once()
  })
})

describe('saveBuild()', () => {
  it('should add a new build', async () => {
    // Arrange
    const buildServiceMock = mock<BuildService>()
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const routerMock = mock<Router>()

    const build: IBuild = {
      id: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Test'
    }

    const buildComponentService = new BuildComponentService()

    // Act
    await buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.add(build)).once()
    verify(notificationServiceMock.notify(NotificationType.success, anyString())).once()
    verify(routerMock.push(anything())).once()
  })

  it('should update an existing build', async () => {
    // Arrange
    const buildServiceMock = mock<BuildService>()
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const routerMock = mock<Router>()

    const buildComponentService = new BuildComponentService()
    const build: IBuild = {
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Test'
    }

    // Act
    await buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.update(build)).once()
    verify(notificationServiceMock.notify(NotificationType.success, anyString())).once()
    verify(routerMock.push(anything())).never()
  })
})

describe('deleteBuild()', () => {
  it('should delete a build', () => {
    // Arrange
    const buildServiceMock = mock<BuildService>()
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const routerMock = mock<Router>()

    const build: IBuild = {
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    }

    const buildComponentService = new BuildComponentService()

    // Act
    buildComponentService.deleteBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.delete('123')).once()
    verify(notificationServiceMock.notify(NotificationType.information, anyString())).once()
    verify(routerMock.push(anything())).once()
  })
})