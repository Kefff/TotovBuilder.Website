import { IBuild } from '../../../models/build/IBuild'
import { BuildService } from '../../../services/BuildService'
import Result, { FailureType } from '../../../utils/Result'
import { Router } from 'vue-router'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito'
import Services from '../../../services/repository/Services'
import { BuildComponentService } from '../../../services/components/BuildComponentService'

describe('getBuild()', () => {
  it('should get a build', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.get('123')).thenReturn(
      Result.ok({
        id: '123',
        name: 'Test',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: new Date(1)
      } as IBuild))
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    // Act
    const build = buildComponentService.getBuild('123')

    // Assert
    expect(build).toStrictEqual({
      id: '123',
      name: 'Test',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })
    verify(buildServiceMock.get('123')).once()
  })

  it('should return a new build when no build id is provided', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.create()).thenReturn({
      id: '',
      name: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    // Act
    const build = buildComponentService.getBuild(undefined)

    // Assert
    expect(build).toStrictEqual({
      id: '',
      name: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })
  })

  it('should return a new build when an error occurs', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.get('123')).thenReturn(Result.fail(FailureType.hidden, 'Context', 'Error'))
    when(buildServiceMock.create()).thenReturn({
      id: '',
      name: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    // Act
    const build = buildComponentService.getBuild('123')

    // Assert
    expect(build).toStrictEqual({
      id: '',
      name: '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    })
    verify(buildServiceMock.get('123')).once()
    verify(buildServiceMock.create()).once()
  })
})

describe('getBuildFromSharableString()', () => {
  it('should get a build from a sharable string', async () => {
    // Arrange
    const service = new BuildComponentService()
    const sharableString = 'XQAAAAIEAQAAAAAAAABAqEppJBKy3f2nWA1_4C5z8-v7-QmsFsh3-Xw5A4r6cKv_m0sfj0O9x9XIb5ScojjRsy4huWDxzBSG1zyaOOej9yI6eVsg6yXMNsehKkbkF4IxN4W52Wr0SPOgjzuUFCVV1O-07KKY5H2MxwF8NvWFSy9VOl89axpWIZlA4rMaW8zwrHUAdC7epHLneT1sKyazlWteJ--ZEOyd3csaogRVGPNtylBhm8wqX_KVr5aLtkpJU-9ba2mmXnpWUf_-OHdA'

    // Act
    const buildResult = await service.getBuildFromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toMatchObject({
      'id': '',
      'inventorySlots': [
        {
          'items': [
            {
              'content': [],
              'itemId': '574d967124597745970e7c94',
              'modSlots': [
                {
                  'item': {
                    'content': [],
                    'itemId': '574dad8024597745964bf05c',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_stock'
                },
                {
                  'item': {
                    'content': [],
                    'itemId': '574db213245977459a2f3f5d',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_sight_rear'
                },
                {
                  'item': {
                    'content': [],
                    'itemId': '587df3a12459772c28142567',
                    'modSlots': [],
                    'quantity': 1
                  },
                  'modSlotName': 'mod_magazine'
                }
              ],
              'quantity': 1
            }
          ],
          'typeId': 'onSling'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'onBack'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'holster'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'bodyArmor'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'tacticalRig'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'headwear'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'earpiece'
        },
        {
          'items': [
            undefined,
            undefined,
            undefined,
            undefined
          ],
          'typeId': 'pockets'
        },
        {
          'items': [
            {
              'content': [
                {
                  'content': [],
                  'itemId': '5448fee04bdc2dbc018b4567',
                  'modSlots': [],
                  'quantity': 1
                }
              ],
              'itemId': '5c0e805e86f774683f3dd637',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'backpack'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '544a11ac4bdc2d470e8b456a',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'pouch'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '54491bb74bdc2d09088b4567',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'scabbard'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'faceCover'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'eyewear'
        },
        {
          'items': [
            undefined
          ],
          'typeId': 'armband'
        },
        {
          'items': [
            {
              'content': [],
              'itemId': '5f4f9eb969cdc30ff33f09db',
              'modSlots': [],
              'quantity': 1
            }
          ],
          'typeId': 'compass'
        }
      ],
      'lastExported': undefined,
      'name': ''
    })
  })

  it('should fail when build parsing fails', async () => {
    // Arrange
    const service = new BuildComponentService()
    const sharableString = 'X'

    // Act
    const buildResult = await service.getBuildFromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe('Cannot read the shared link. It seems to be corrupted.')
  })
})

describe('saveBuild()', () => {
  it('should add a new build', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    Services.configure(BuildService, undefined, instance(buildServiceMock))
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))
    const routerMock = mock<Router>()

    const build: IBuild = {
      id: '',
      name: 'Test',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    }

    // Act
    buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.add(build)).once()
    verify(notificationServiceMock.notify(NotificationType.success, anyString(), true)).once()
    verify(routerMock.push(anything())).once()
  })

  it('should update an existing build', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.update('123', anything())).thenReturn(Result.ok())
    Services.configure(BuildService, undefined, instance(buildServiceMock))
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))
    const routerMock = mock<Router>()

    const build: IBuild = {
      id: '123',
      name: 'Test',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    }

    // Act
    buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.update('123', build)).once()
    verify(notificationServiceMock.notify(NotificationType.success, anyString(), true)).once()
    verify(routerMock.push(anything())).never()
  })

  it('should fail if an error occurs', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.update('123', anything())).thenReturn(Result.fail())
    Services.configure(BuildService, undefined, instance(buildServiceMock))
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))
    const routerMock = mock<Router>()

    const build: IBuild = {
      id: '123',
      name: 'Test',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    }

    // Act
    buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.update('123', build)).once()
    verify(notificationServiceMock.notify(NotificationType.error, anyString())).once()
    verify(routerMock.push(anything())).never()
  })
})

describe('deleteBuild()', () => {
  it('should delete a build', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    Services.configure(BuildService, undefined, instance(buildServiceMock))
    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))
    const routerMock = mock<Router>()

    const build: IBuild = {
      name: '',
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: new Date(1)
    }

    // Act
    buildComponentService.deleteBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.delete('123')).once()
    verify(notificationServiceMock.notify(NotificationType.information, anyString(), true)).once()
    verify(routerMock.push(anything())).once()
  })
})