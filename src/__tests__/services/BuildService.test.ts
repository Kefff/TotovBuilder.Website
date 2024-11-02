import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { InventorySlotTypeId } from '../../models/build/InventorySlotTypes'
import { BuildService } from '../../services/BuildService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { ReductionService } from '../../services/ReductionService'
import { VersionService } from '../../services/VersionService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import Migrations from '../../utils/migrations/Migrations'
import { build1, build2 } from '../__data__/buildMocks'
import { alpha, erBayonet, k1s, k1sVisor } from '../__data__/itemMocks'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { useVersionServiceMock } from '../__mocks__/VersionServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

beforeEach(() => {
  localStorage.setItem(
    WebsiteConfigurationMock.buildStorageKeyPrefix + build1.id,
    JSON.stringify(build1)
  )
  localStorage.setItem(
    WebsiteConfigurationMock.buildStorageKeyPrefix + build2.id,
    JSON.stringify(build2)
  )
  localStorage.setItem(WebsiteConfigurationMock.languageStorageKey, 'en')
})


describe('addAsync()', () => {
  it('should add a build', async () => {
    // Arrange
    useItemServiceMock()
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const id = await service.addAsync(newBuild)
    const build = service.get(id)

    // Assert
    expect(id).toBeDefined()
    expect(id).not.toBe('')
    expect(build).not.toBeUndefined()
    expect(build!.id).toBe(id)
    expect(build!.name).toBe(newBuild.name)
    expect(JSON.stringify(build!.inventorySlots)).toBe(
      JSON.stringify(newBuild.inventorySlots)
    ) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
    expect(service.getAll().length).toBe(3)
  })
})

describe('create()', () => {
  it.each([
    [true],
    [false]
  ])('should create a new build', (ignoreDefaultSlotItems: boolean) => {
    // Arrange
    const service = new BuildService()

    const pouchDefaultItem = ignoreDefaultSlotItems ? undefined : {
      content: [],
      ignorePrice: false,
      itemId: alpha.id,
      modSlots: [],
      quantity: 1
    }
    const scabbardDefaultItem = ignoreDefaultSlotItems ? undefined : {
      content: [],
      ignorePrice: false,
      itemId: erBayonet.id,
      modSlots: [],
      quantity: 1
    }
    const expected: IBuild = {
      id: '',
      name: '',
      inventorySlots: [
        {
          items: [undefined],
          typeId: InventorySlotTypeId.onSling
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.onBack
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.holster
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.bodyArmor
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.tacticalRig
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.headwear
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.earpiece
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.backpack
        },
        {
          items: [undefined, undefined, undefined, undefined],
          typeId: InventorySlotTypeId.pockets
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.eyewear
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.faceCover
        },
        {
          items: [pouchDefaultItem],
          typeId: InventorySlotTypeId.pouch
        },
        {
          items: [scabbardDefaultItem],
          typeId: InventorySlotTypeId.scabbard
        },
        {
          items: [undefined],
          typeId: InventorySlotTypeId.armband
        },
        {
          items: [undefined, undefined, undefined],
          typeId: InventorySlotTypeId.special
        }
      ],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined
    }

    // Act
    const build = service.create(ignoreDefaultSlotItems)

    // Assert
    expect(build).toStrictEqual(expected)
  })
})

describe('delete()', () => {
  it('should delete a build', () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const service = new BuildService()

    // Act
    service.delete(build2.id)
    const build = service.get(build2.id)

    // Assert
    expect(service.getAll().length).toBe(1)
    expect(build).toBe(undefined)
    verify(notificationServiceMock.notify(NotificationType.information, 'Build "Build 2" deleted.')).once()
    verify(notificationServiceMock.notify(NotificationType.error, 'Build "build_2" not found. It may have been deleted.')).once()
  })
})

describe('fromSharableStringAsync()', () => {
  it.each(
    [
      [
        'XQAAAAK6BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOgqVu58gCOQB3_lygItavScD6KETjsnnqqDlYa8teT26vMr7mcA4yJzLaCaKHfPnnQM4LV5edlloSISmpvJN3hlYvrz74DQyinjTwOr26OE9Lnqe7m55nUc1D6Xfe96wXdgNVhx1u8PO2ZlQ9ijOUvKKJjWrfnb3Y_z_HX9VZ0tc-GC8TifY5MzhZfr2mwp-SnV4lSZ91gfE5MsR7GcSvroCe9Nwn41ZhdEGt-z_Lb8j_gCygg',
        {
          ...build1,
          id: '',
          name: `${build1.name}|1.5.0|1.6.0`,
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined
        }
      ],
      [
        'XQAAAAL-AgAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGtZFQI4nHXyvXeCkGDnE2yJSmmd0bDcQmx-3C2F32vOjYAWw23ezEFu9AKFIKbj4FojTuE3p0k5O-4x8UQPdF8MZxt6uQN2iguqmpNUwuma3GHEITztjySMh4BZzRXIxDIuifBYqAV3UKCQgbyu7ExKnBNb_JsU6NpGDPtI5Sv5sP_rxAFv',
        {
          ...build2,
          id: '',
          name: `${build2.name}|1.5.0|1.6.0`
        }
      ]
    ]
  )('should get a build from a sharable string and execute migrations on it', async (sharableString: string, expected: IBuild) => {
    // Arrange
    Services.configure(BuildService)
    Services.configure(ReductionService)
    Services.configure(VersionService)

    Migrations.splice(0)
    Migrations.push(
      {
        migrateBuildPromise: (build: IBuild) => {
          build.name = `${build.name}|1.5.0`
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedDataPromise: () => {
          return Promise.resolve(true)
        },
        version: '1.5.0'
      },
      {
        migrateBuildPromise: (build: IBuild) => {
          build.name = `${build.name}|1.6.0`
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedDataPromise: () => {
          return Promise.resolve(true)
        },
        version: '1.6.0'
      })

    const service = Services.get(BuildService)

    // Act
    const build = await service.fromSharableStringAsync(sharableString)

    // Assert
    expect(build).toEqual(expected)
  })

  it('should return undefined and notify when the sharable string is corrupted', async () => {
    // Arrange
    Services.configure(ReductionService)

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const service = new BuildService()
    const sharableString = 'corrupted'

    // Act
    const build = await service.fromSharableStringAsync(sharableString)

    // Assert
    expect(build).toBeUndefined()
    verify(notificationServiceMock.notify(NotificationType.error, 'Error while reading the shared link.\nIt seems to be corrupted.')).once()
  })

  it('should return undefined and notify when the parsing of the reduced build fails', async () => {
    // Arrange
    const reductionServiceMock = mock<ReductionService>()
    when(reductionServiceMock.parseReducedBuild(anything())).thenReturn(undefined)
    Services.configure(ReductionService, undefined, instance(reductionServiceMock))

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const service = new BuildService()
    const sharableString = 'XQAAAAIEAQAAAAAAAABAqEppJBKy3f2nWA1_4C5z8-v7-QmsFsh3-Xw5A4r6cKv_m0sfj0O9x9XIb5ScojjRsy4huWDxzBSG1zyaOOej9yI6eVsg6yXMNsehKkbkF4IxN4W52Wr0SPOgjzuUFCVV1O-07KKY5H2MxwF8NvWFSy9VOl89axpWIZlA4rMaW8zwrHUAdC7epHLneT1sKyazlWteJ--ZEOyd3csaogRVGPNtylBhm8wqX_KVr5aLtkpJU-9ba2mmXnpWUf_-OHdA'

    // Act
    const build = await service.fromSharableStringAsync(sharableString)

    // Assert
    expect(build).toBeUndefined()
    verify(notificationServiceMock.notify(NotificationType.error, 'Error while reading the shared link.\nIt seems to be corrupted.')).once()
  })

  it('should notify when a migration fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)
    Services.configure(NotificationService)
    Services.configure(ReductionService)
    Services.configure(VersionService)

    const notificationServiceSpy = spy(Services.get(NotificationService))

    Migrations.splice(0)
    Migrations.push(
      {
        migrateBuildPromise: () => Promise.resolve(false),
        migrateBuildUnrelatedDataPromise: () => Promise.resolve(true),
        version: '1.6.0'
      })

    const service = Services.get(BuildService)
    const sharableString = 'XQAAAAJ5BAAAAAAAAABAqEppdBKy3f2nWA1_4C5z8-v7-PB2PnO4T0FRqHCrunbQ824T11fLD0MMgpKzuGdnO-8eB5yHCYkn0JYO3VCC50O9MYgvuOr49cS5mtaJVptsaMiETu4-0oYouMfztK97JVyQiamvJHdA2W5i9dVVx7tG6R4CkXyLtwbAxz74UOVoRKsDpGU0H7BJshLAPue1edTU7OnozNCY5jfRvLYt8y_qwxB6Ol-uaqk4oI3cEDW9c94UKDSU8MVdPtA8P481abbFxOaLOXrDXvokQOpIV5t3nPBsd3EC-zc0p0C9miVd4PO9JJAGoS7c05hy5VxDyKAAC_MgjRgha9avVCb8UKrza2hWTiJRezgEmnBOip-6n2xY2JgD5E0KtCWg0w0jiA1gzqKs9AEfWiBesVfFcFto3Ni7YYqaWLjb4oeFTpI1UOaA89s8PwxYkFlBErCbjBXKPYcNIOvqAU-p4NTO7X_3tMRPbzSZNVIcDu7Mq0zGn5IndeMyy-2aZulriecUtbL17JaE86mPQfaNe3DjKO0CmnqWf_LOvEAEPEHPimdpWCw8njwoqZF5uvGDsonEHU43POFgSVhXRB4cjppaxhKYb7XcJZDvNk1mZ-_SvOAtS70IE59cHGM7xBF_I74CpodKJstWTusp-qM_gDRAbpcqQm-ysqFXE9suINiKo0MmvEEcZSBU-iXFYHs-ezSDx9XYyn_suJkHXkgDkf4b0GzNnWPTrhWN-t4yTreDObhrm5M82k3njxXsKz_6__1B5U0'

    // Act
    const build = await service.fromSharableStringAsync(sharableString)

    // Assert
    expect(build).not.toBeUndefined()
    verify(notificationServiceSpy.notify(NotificationType.error, 'Error while updating build to version "1.6.0".'))
  })
})

describe('get()', () => {
  it('should get a build', () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const build = service.get(build2.id)

    // Assert
    expect(JSON.stringify(build)).toBe(JSON.stringify(build2)) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
  })

  it('should return undefined and notify if the build does not exist', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const service = new BuildService()

    // Act
    const build = service.get('invalid')

    // Assert
    expect(build).toBeUndefined()
    verify(notificationServiceMock.notify(NotificationType.error, 'Build "invalid" not found. It may have been deleted.')).once()
  })

  it('should return undefined and notify if the build cannot be parsed', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    localStorage.setItem(
      WebsiteConfigurationMock.buildStorageKeyPrefix + 'not_parsable',
      '{ "name"=\'not_parsable\',  }'
    )

    const service = new BuildService()

    // Act
    const build = service.get('not_parsable')

    // Assert
    expect(build).toBe(undefined)
    verify(notificationServiceMock.notify(NotificationType.error, 'Error loading build "not_parsable".\nIt seems to be corrupted.')).once()
  })
})

describe('getAll()', () => {
  it('should get all builds', () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const builds = service.getAll()

    // Assert
    expect(JSON.stringify(builds)).toBe(JSON.stringify(builds)) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
  })
})

describe('toSharableUrlAsync()', () => {
  it.each([
    [
      build1,
      'XQAAAAK6BAAAAAAAAABBKEnKciJ9Ha4afmksn3IsDhJ5O4QenVHR6M9GIERw3HZt4SozAJ4ecag7fexwq5EsA3ZY3G9JALNl2jZAHroUrkr2uphzBhRzPCNtuO6Uc6K_tEMpKRwdhvxFpuse2mVINUQGFI8lUj-5pSeRRqWdF2EaM5qVY_yqoEBbG48VQ0KvuCZcXygCoBPez45CigdHq5kOCmX6JP6TdRwc3_eP85HoZKTFmKeqoueCPFEVVnRZBoEcWYM3fX8BHhr1YCeHQTJm50-vGIyQ1uLNyiIpuq1cFP_3JNTnY-hdAMnba6kb8PEY9aLk8cavZS4xq8lqn96NXF-H1_OWlOwFEWFr2VoBSI0RBwAxRMQgG0g3nX8MJ2BuAWQdz8xd6T39XBk6igferK_Ex-StaEA2Pi93OzxIlXgqPxc1HzpgWhbGiu_L9zMhr7NejxOgBy_rf8iUUmRlxGtuiUMv_6Nv35uG8rX9bl49_jHA2S5txChG3gjXBbVuReiUhsgZ9gT4xOQEQ_g33pDjRPMVC-bLbPHJcBuE2pbQOThseLH4rUjK6Sb9IbF99ZNiWHRQF4cieUYTOgqVu58gCOQB3_lygItavScD6KD6ETn76Ld4PKfNdDBTW60zKOTDUfLOKskPAvv8CJS6JIOZmG7z_bNwXWARPvkJgt24Ywgc1c_CuqrOoDN0iCO6QtaYMI3KcKgbqf16_1WH7L2-6ogCMKK0sAadxDUFJJ7BF3mvgQC_Ty9YilypMSb3oKwOpZIoK9kljWX_3NDn0DpMmjcn4bU3jMtOhFAs2j2g4z7JXCle7mzXDAUGG_6xUYU'
    ],
    [
      build2,
      'XQAAAAL-AgAAAAAAAABBKEnKciJ9Ha4afmlhjXIcBHJ5OAjWBvHRqhzsw2sFohvtE2U5Ax-ZhpnJP5jm2hvuJmbR_88c5MLjq2AZyyIReyJ-7BxYduIOn4n0fu2tfBOvPNWlcixwLZO1VGePLUD5o2Ecs8J4dbz6zB1DvdfOl7I1zHA3gjt9_78XznrP3_PAQg3DejFaHp3dULJQyxzqwNiDs3OOUfIwRGFd5S-urvsBPs1_gEtIudOzGEfBBy20xD6GrV-QjaQKiRUfU4yV1ws9tuIeuyZzbg2QP1cON2MQ8vR5D6eHm2-MWlJjwHIwf4EnifB7mO4WnufIc_i8KD9ExoEPEtbTQpEa-2hVWnVCN_Oo7fL7HxVOvER-x5ExV57LX-gjvmbJ2Fnu_NruEzqyI8kktrxs0RfNo3ZRjArb-0TGqLRhTXsA4q3PuT5_zGtZFQI4nHXyvXeCkGDnE2yJSmmd0bDcQmx-3C2F32vOjYAWw23ezEFu9AKFIKbj4FojTuE3p0k5O-4x8UQPdF8MZxt6uQN2iguqmpNUwuma3GHEITztjySMh4BZzRXIxDIuifBYqAV3UKCQgbyu7ExKnBNb_JsU6NpGDPtI5Sv5sP_rxAFv'
    ]
  ])('should reduce a build and transform it into a URL', async (build: IBuild, expectedSharableString: string) => {
    // Arrange
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    Services.configure(ReductionService)

    vi.stubGlobal(
      'window',
      {
        location: {
          origin: 'localhost:3000'
        }
      })

    const service = new BuildService()

    // Act
    const sharableString = await service.toSharableUrlAsync(build)

    // Assert
    expect(sharableString).toBe(`localhost:3000/s/${expectedSharableString}`)
  })

  it('should return undefined and notify when the URL is longer thant 2048 characters', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(ReductionService)

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    Services.get(WebsiteConfigurationService).configuration.buildSharingUrl = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

    const service = new BuildService()

    // Act
    const sharableStringResult = await service.toSharableUrlAsync(build1)

    // Assert
    expect(sharableStringResult).toBeUndefined()
    verify(notificationServiceMock.notify(NotificationType.warning, 'Cannot share build "Build 1" by link because it is too large. You can still share it by using the "Save builds to a file" button to save it as a file that can be imported by another person.')).once()
  })
})

describe('updateAsync()', () => {
  it('should update a build', async () => {
    // Arrange
    useItemServiceMock()
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    const build = service.get(build1.id)!
    build.name = 'New name'

    // Act / Assert
    await service.updateAsync(build)

    const updatedBuild = service.get(build1.id)
    expect(updatedBuild).not.toBeUndefined()
    expect(updatedBuild!.name).toBe('New name')
  })

  it('should create an new build if the build does not exist', async () => {
    // Arrange
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const build: IBuild = {
      id: 'notExistingBuild',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: 'Not existing build'
    }

    const service = new BuildService()

    // Act / Assert
    await service.updateAsync(build)
    verify(logServiceMock.logError('message.buildToUpdateNotFound', { id: build.id }))

    const updatedBuild = service.get(build.id)
    expect(updatedBuild?.name).toBe(build.name)
  })
})

const newBuild: IBuild = {
  id: '',
  name: 'Kaptain Kolpak',
  inventorySlots: [
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.onBack
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.backpack
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.bodyArmor
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.earpiece
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.eyewear
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.faceCover
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: k1s.id,
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: k1sVisor.id,
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_equipment'
            }
          ],
          quantity: 1
        }
      ],
      typeId: InventorySlotTypeId.headwear
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.holster
    },
    {
      items: Array<IInventoryItem>(4),
      typeId: InventorySlotTypeId.pockets
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.pouch
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.scabbard
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.onSling
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: InventorySlotTypeId.tacticalRig
    }
  ],
  lastExported: undefined,
  lastUpdated: undefined,
  lastWebsiteVersion: undefined
}