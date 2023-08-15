import { IBuild } from '../../../models/build/IBuild'
import { BuildService } from '../../../services/BuildService'
import Result, { FailureType } from '../../../utils/Result'
import { Router } from 'vue-router'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito'
import Services from '../../../services/repository/Services'
import { BuildComponentService } from '../../../services/components/BuildComponentService'
import { useWebsiteConfigurationServiceMock } from '../../../__mocks__/WebsiteConfigurationServiceMock'
import { VersionService } from '../../../services/VersionService'
import { useVersionServiceMock } from '../../../__mocks__/VersionServiceMock'
import { describe, expect, it } from 'vitest'

describe('getBuild()', () => {
  it('should get a build', () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.get('123')).thenReturn(
      Result.ok({
        id: '123',
        inventorySlots: [],
        lastExported: undefined,
        lastUpdated: undefined,
        lastWebsiteVersion: undefined,
        name: 'Test'
      } as IBuild))
    Services.configure(BuildService, undefined, instance(buildServiceMock))

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

  it('should return a new build when an error occurs', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.get('123')).thenReturn(Result.fail(FailureType.hidden, 'Context', 'Error'))
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

describe('getBuildFromSharableString()', () => {
  it('should get a build from a sharable string', async () => {
    // Arrange
    useVersionServiceMock()
    Services.configure(BuildService)
    Services.configure(VersionService)

    const service = new BuildComponentService()
    const sharableString = 'XQAAAAKBAQAAAAAAAABAqEppVBKy3f2nWA1_4C5z8-v7-PB2PnO3yE24i4uplQNOe2AQti9qfQ3vHsOnTKDq2nEEFb79VsBzBnD-pb-5Nb0_87qgYNgUqN-kUzC-ixXoaUIxP5bVjrq-YghBtAFQa_O4inxq3hwebGM3jUCTpB0ou_BCcoJymajYEBQ2OvPuy_aF8Vtf4UR8KYA6nugVJv5Kd0v6DWN94D7Kgaza5GFSYqrRHItjPLx6krp0SGceYjtn1RNUBX-ea41hpKDXlBkYuxoBe-ZT10P4Ouq0e2Mmn82YwcUUBrZvQhh3uG6Dn_YU1No29Qi4js2uAwpm-nroMnPbxOd9jDkNeED-9xXjIA'

    // Act
    const buildResult = await service.getBuildFromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toEqual({
      id: '',
      inventorySlots: [
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '574d967124597745970e7c94',
              modSlots: [
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '574dad8024597745964bf05c',
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_stock'
                },
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '574db213245977459a2f3f5d',
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_sight_rear'
                },
                {
                  item: {
                    content: [],
                    ignorePrice: false,
                    itemId: '587df3a12459772c28142567',
                    modSlots: [],
                    quantity: 1
                  },
                  modSlotName: 'mod_magazine'
                }
              ],
              quantity: 1
            }
          ],
          typeId: 'onSling'
        },
        {
          items: [
            undefined
          ],
          'typeId': 'onBack'
        },
        {
          items: [
            undefined
          ],
          typeId: 'holster'
        },
        {
          items: [
            undefined
          ],
          typeId: 'bodyArmor'
        },
        {
          items: [
            undefined
          ],
          typeId: 'tacticalRig'
        },
        {
          items: [
            undefined
          ],
          typeId: 'headwear'
        },
        {
          items: [
            undefined
          ],
          typeId: 'earpiece'
        },
        {
          items: [
            undefined,
            undefined,
            undefined,
            undefined
          ],
          typeId: 'pockets'
        },
        {
          items: [
            {
              content: [
                {
                  content: [],
                  ignorePrice: false,
                  itemId: '5448fee04bdc2dbc018b4567',
                  modSlots: [],
                  quantity: 1
                }
              ],
              ignorePrice: false,
              itemId: '5c0e805e86f774683f3dd637',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'backpack'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '544a11ac4bdc2d470e8b456a',
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
              itemId: '54491bb74bdc2d09088b4567',
              modSlots: [],
              quantity: 1
            }
          ],
          typeId: 'scabbard'
        },
        {
          items: [
            undefined
          ],
          typeId: 'faceCover'
        },
        {
          items: [
            undefined
          ],
          typeId: 'eyewear'
        },
        {
          items: [
            undefined
          ],
          typeId: 'armband'
        },
        {
          items: [
            {
              content: [],
              ignorePrice: false,
              itemId: '5f4f9eb969cdc30ff33f09db',
              modSlots: [],
              quantity: 1
            },
            undefined,
            undefined
          ],
          typeId: 'special'
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    } as IBuild)
  })

  it('should fail when build parsing fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)
    Services.configure(NotificationService)

    const service = new BuildComponentService()
    const sharableString = 'X'

    // Act
    const buildResult = await service.getBuildFromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe('Error while reading the shared link.\nIt seems to be corrupted.')
  })
})

describe('saveBuild()', () => {
  it('should add a new build', async () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
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

    // Act
    await buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.add(build)).once()
    verify(notificationServiceMock.notify(NotificationType.success, anyString(), true)).once()
    verify(routerMock.push(anything())).once()
  })

  it('should update an existing build', async () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.update('123', anything())).thenReturn(Promise.resolve(Result.ok()))
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
      name: 'Test'
    }

    // Act
    await buildComponentService.saveBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.update('123', build)).once()
    verify(notificationServiceMock.notify(NotificationType.success, anyString(), true)).once()
    verify(routerMock.push(anything())).never()
  })

  it('should fail if an error occurs', async () => {
    // Arrange
    const buildComponentService = new BuildComponentService()
    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.update('123', anything())).thenReturn(Promise.resolve(Result.fail()))
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
      name: 'Test'
    }

    // Act
    await buildComponentService.saveBuild(instance(routerMock), build)

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
      id: '123',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    }

    // Act
    buildComponentService.deleteBuild(instance(routerMock), build)

    // Assert
    verify(buildServiceMock.delete('123')).once()
    verify(notificationServiceMock.notify(NotificationType.information, anyString(), true)).once()
    verify(routerMock.push(anything())).once()
  })
})