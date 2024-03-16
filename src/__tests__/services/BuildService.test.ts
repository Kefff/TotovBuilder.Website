import { anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import WebsiteConfigurationMock from '../../../public/data/website-configuration.json'
import { IBuild } from '../../models/build/IBuild'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { BuildService } from '../../services/BuildService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { ReductionService } from '../../services/ReductionService'
import { VersionService } from '../../services/VersionService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import Result, { FailureType } from '../../utils/Result'
import Migrations from '../../utils/migrations/Migrations'
import { build1, build2 } from '../__data__/buildMocks'
import { useItemServiceMock } from '../__mocks__/ItemServiceMock'
import { useVersionServiceMock } from '../__mocks__/VersionServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

const newBuild: IBuild = {
  id: 'build_3',
  name: 'Kaptain Kolpak',
  inventorySlots: [
    {
      items: Array<IInventoryItem>(1),
      typeId: 'onBack'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'backpack'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'bodyArmor'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'earpiece'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'eyewear'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'faceCover'
    },
    {
      items: [
        {
          content: [],
          ignorePrice: false,
          itemId: '59e7711e86f7746cae05fbe1', // Kolpak-1S riot helmet
          modSlots: [
            {
              item: {
                content: [],
                ignorePrice: false,
                itemId: '5ac4c50d5acfc40019262e87', // K1S Visor
                modSlots: [],
                quantity: 1
              },
              modSlotName: 'mod_equipment'
            }
          ],
          quantity: 1
        }
      ],
      typeId: 'headwear'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'holster'
    },
    {
      items: Array<IInventoryItem>(4),
      typeId: 'pockets'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'pouch'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'scabbard'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'onSling'
    },
    {
      items: Array<IInventoryItem>(1),
      typeId: 'tacticalRig'
    }
  ],
  lastExported: undefined,
  lastUpdated: undefined,
  lastWebsiteVersion: undefined
}

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


describe('add()', () => {
  it('should add a build', async () => {
    // Arrange
    useItemServiceMock()
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const id = await service.add(newBuild)
    const result = service.get(id)

    // Assert
    expect(id).toBeDefined()
    expect(id).not.toBe('')
    expect(result.success).toBe(true)
    expect(result.value.id).toBe(id)
    expect(result.value.name).toBe(newBuild.name)
    expect(JSON.stringify(result.value.inventorySlots)).toBe(
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
      itemId: '544a11ac4bdc2d470e8b456a',
      modSlots: [],
      quantity: 1
    }
    const scabbardDefaultItem = ignoreDefaultSlotItems ? undefined : {
      content: [],
      ignorePrice: false,
      itemId: '54491bb74bdc2d09088b4567',
      modSlots: [],
      quantity: 1
    }
    const expected: IBuild = {
      id: '',
      name: '',
      inventorySlots: [
        {
          items: [undefined],
          typeId: 'onSling'
        },
        {
          items: [undefined],
          typeId: 'onBack'
        },
        {
          items: [undefined],
          typeId: 'holster'
        },
        {
          items: [undefined],
          typeId: 'bodyArmor'
        },
        {
          items: [undefined],
          typeId: 'tacticalRig'
        },
        {
          items: [undefined],
          typeId: 'headwear'
        },
        {
          items: [undefined],
          typeId: 'earpiece'
        },
        {
          items: [undefined, undefined, undefined, undefined],
          typeId: 'pockets'
        },
        {
          items: [undefined],
          typeId: 'backpack'
        },
        {
          items: [pouchDefaultItem],
          typeId: 'pouch'
        },
        {
          items: [scabbardDefaultItem],
          typeId: 'scabbard'
        },
        {
          items: [undefined],
          typeId: 'faceCover'
        },
        {
          items: [undefined],
          typeId: 'eyewear'
        },
        {
          items: [undefined],
          typeId: 'armband'
        },
        {
          items: [undefined, undefined, undefined],
          typeId: 'special'
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

    const service = new BuildService()

    // Act
    service.delete(build2.id)
    const result = service.get(build2.id)

    // Assert
    expect(service.getAll().length).toBe(1)
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(
      'Build "build_2" not found. It may have been deleted.'
    )
  })
})

describe('fromSharableString()', () => {
  it.each(
    [
      [
        'XQAAAAKwBAAAAAAAAABAqEppdBKy3f2nWA1_4C5z8-v7-PB2PnO4T0FRqHCrunbQ824T11fLD0MMgpKzuGdnO-8eB5yHCYkn0JYO3VCC50O9MYgvuOr49cS5mtaJVptsaMiETu4-0oYouMfztK97JVyQiamvJHdA2W5i9dVVx7tG6R4CkXyLtwbAxz74UOVoRKsDpGU0H7BJshLAPue1edTU7OnozNCY5jfRvLYt8y_qwxB6Ol-uaqk4oI3cEDW9c94UKDSU8MVdPtA8P481abbFxOaLOXrDXvokQOpIV5t3nPBsd3EC-zc0p0C9miVd4PO9JJAGoS7c05hy5VxDyKAAC_MgjRgha9avVCb8UKrza2hWTiJRezgEmnBOip-6n2xY2JgD5E0KtCWg0w0jiA1gzqKs9AEfWiBesVfFcFto3Ni7YYqaWLjb4oeFTpI1UOaA89s8PwxYkFushiS2AWBA_pxTyrsgBBEwPRqQiEsgSp7QxqJX1mg1mc1ANj_K4bwv0roz9QGHB6RMz2Y4taQJ84R2EZkz1UrXHKzG46-gEoSRl563T5Zyd5u2bIw9VyY28KQ8Wax6YqxrRWGbnWcE7GlRFy5sVMlWaaATnenRHy6kUeVz1wXQHDL6P_QiRp6BHwaUWCg7go1K_zWSEGCil-qRNpCHLW6CItKv_KVUbBOG6vYq0myx9pmdaLJ7I0YixZWYXijwjjDlww0-zrGqNPW7_itHRo6qo86ugfFCv8qTuLUpQJZjXS_jhK4kUcOU1EK0NirDG7axwLlPjg7qKwX_qNdogCVenlUJa5EL02vEO8xufufi_xealgA',
        {
          ...build1,
          lastExported: undefined,
          lastUpdated: undefined,
          lastWebsiteVersion: undefined
        }
      ],
      [
        'XQAAAAL0AgAAAAAAAABAqEppVBKy3f2f62vW6NGnAzQifk3h2Szo0R24FxL00kBK4cKfdwtejcfMvTZIkJ34NasHofmbTM8Q6MdRJEhOusAF9jlw3ZzCROr5jIUf6dnXgo5QhJNPM8S2XDQCtRsLoH_yAAk5q_Fz3NTbnXwpMGMiwSb51keeDYqXqVdUbdbgQOyEf84s_Z3auRsIsZpTBV8LOmcVfCw5ImzWr8-nVttGF6uqAvlwCDhNSOwT4tubwigtQO48c9XjLARE-vHiDHSzEsW3AOTRd0iuTt3Ldko4cgEMawl75mtaLVf8G8VvIBADnYoKPrxx0DGh-NAUmey_NRiPruQjfa_tLLaI1RqsZ9CtaExm1xvQPLHCJeDMyypXjBtucFYpvcEhMk3n1MLaH9VH4ZdBecR4rCQKJtBZl7OFKCbEelz9lZ5uv61W2oBy_y2cV_eHYseV2vaLR8Y3eLw4Bw6NOILeBfSS1v3nn_U_FGkHC72NhmMGBlV2y0KQ9gK-t4soj78addY-BMNymmwCHNw44I0UWjFUHXBprg0FBPaHojovgsWm0PuHZafHLDNRFBblnC9idPCxlodWjO3gg7cqGbKp_1ypMAA',
        build2
      ]
    ]
  )('should get a build from a sharable string and execute migrations on it', async (sharableString: string, expectedBuild: IBuild) => {
    // Arrange
    Services.configure(BuildService)
    Services.configure(ReductionService)
    Services.configure(VersionService)

    Migrations.splice(0)
    Migrations.push(
      {
        migrateBuild: (build: IBuild) => {
          build.name = build.name + '1.5.0'
          return Promise.resolve(Result.ok())
        },
        migrateBuildUnrelatedData: () => {
          return Promise.resolve(Result.ok())
        },
        version: '1.5.0'
      },
      {
        migrateBuild: (build: IBuild) => {
          build.name = build.name + '|' + '1.6.0'
          return Promise.resolve(Result.ok())
        },
        migrateBuildUnrelatedData: () => {
          return Promise.resolve(Result.ok())
        },
        version: '1.6.0'
      })

    const service = Services.get(BuildService)

    // Act
    const buildResult = await service.fromSharableString(sharableString)
    const expected = {
      ...expectedBuild,
      id: '',
      name: '1.5.0|1.6.0'
    } as IBuild

    // Assert
    expect(buildResult.success).toBe(true)
    expect(buildResult.value).toEqual(expected)
  })

  it('should fail when the sharable string is corrupted', async () => {
    // Arrange
    Services.configure(ReductionService)

    const service = new BuildService()
    const sharableString = 'corrupted'

    // Act
    const buildResult = await service.fromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe('Error while reading the shared link.\nIt seems to be corrupted.')
  })

  it('should fail when the parsing of the reduced build fails', async () => {
    // Arrange
    const reductionServiceMock = mock<ReductionService>()
    when(reductionServiceMock.parseReducedBuild(anything())).thenReturn(Result.fail(FailureType.error, '', 'Error'))

    Services.configure(ReductionService, undefined, instance(reductionServiceMock))

    const service = new BuildService()
    const sharableString = 'XQAAAAIEAQAAAAAAAABAqEppJBKy3f2nWA1_4C5z8-v7-QmsFsh3-Xw5A4r6cKv_m0sfj0O9x9XIb5ScojjRsy4huWDxzBSG1zyaOOej9yI6eVsg6yXMNsehKkbkF4IxN4W52Wr0SPOgjzuUFCVV1O-07KKY5H2MxwF8NvWFSy9VOl89axpWIZlA4rMaW8zwrHUAdC7epHLneT1sKyazlWteJ--ZEOyd3csaogRVGPNtylBhm8wqX_KVr5aLtkpJU-9ba2mmXnpWUf_-OHdA'

    // Act
    const buildResult = await service.fromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(false)
    expect(buildResult.failureMessage).toBe('Error while reading the shared link.\nIt seems to be corrupted.')
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
        migrateBuild: () => {
          return Promise.resolve(Result.fail(FailureType.error, undefined, 'Error'))
        },
        migrateBuildUnrelatedData: () => {
          return Promise.resolve(Result.ok())
        },
        version: '1.6.0'
      })

    const service = Services.get(BuildService)
    const sharableString = 'XQAAAAJ5BAAAAAAAAABAqEppdBKy3f2nWA1_4C5z8-v7-PB2PnO4T0FRqHCrunbQ824T11fLD0MMgpKzuGdnO-8eB5yHCYkn0JYO3VCC50O9MYgvuOr49cS5mtaJVptsaMiETu4-0oYouMfztK97JVyQiamvJHdA2W5i9dVVx7tG6R4CkXyLtwbAxz74UOVoRKsDpGU0H7BJshLAPue1edTU7OnozNCY5jfRvLYt8y_qwxB6Ol-uaqk4oI3cEDW9c94UKDSU8MVdPtA8P481abbFxOaLOXrDXvokQOpIV5t3nPBsd3EC-zc0p0C9miVd4PO9JJAGoS7c05hy5VxDyKAAC_MgjRgha9avVCb8UKrza2hWTiJRezgEmnBOip-6n2xY2JgD5E0KtCWg0w0jiA1gzqKs9AEfWiBesVfFcFto3Ni7YYqaWLjb4oeFTpI1UOaA89s8PwxYkFlBErCbjBXKPYcNIOvqAU-p4NTO7X_3tMRPbzSZNVIcDu7Mq0zGn5IndeMyy-2aZulriecUtbL17JaE86mPQfaNe3DjKO0CmnqWf_LOvEAEPEHPimdpWCw8njwoqZF5uvGDsonEHU43POFgSVhXRB4cjppaxhKYb7XcJZDvNk1mZ-_SvOAtS70IE59cHGM7xBF_I74CpodKJstWTusp-qM_gDRAbpcqQm-ysqFXE9suINiKo0MmvEEcZSBU-iXFYHs-ezSDx9XYyn_suJkHXkgDkf4b0GzNnWPTrhWN-t4yTreDObhrm5M82k3njxXsKz_6__1B5U0'

    // Act
    const buildResult = await service.fromSharableString(sharableString)

    // Assert
    expect(buildResult.success).toBe(true)
    verify(notificationServiceSpy.notify(NotificationType.error, 'Error while updating build to version "1.6.0".')).once()
  })
})

describe('get()', () => {
  it('should get a build', () => {
    // Arrange
    useItemServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const result = service.get(build2.id)

    // Assert
    expect(result.success).toBe(true)
    expect(JSON.stringify(result.value)).toBe(JSON.stringify(build2)) // stringify() used because undefined is serialized to null and then deserialized to null so equality comparison doesn't work
  })

  it('should fail if the build does not exist', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()

    // Act
    const result = service.get('invalid')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(
      'Build "invalid" not found. It may have been deleted.'
    )
  })

  it('should fail if the build cannot be parsed', () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    localStorage.setItem(
      WebsiteConfigurationMock.buildStorageKeyPrefix + 'not_parsable',
      '{ "name"=\'not_parsable\',  }'
    )

    const service = new BuildService()

    // Act
    const result = service.get('not_parsable')

    // Assert
    expect(result.success).toBe(false)
    expect(result.failureMessage).toBe(
      'Cannot parse build "not_parsable".'
    )
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

describe('toSharableURL()', () => {
  it.each([
    [
      build1,
      'XQAAAAKwBAAAAAAAAABAqEppdBKy3f2nWA1_4C5z8-v7-PB2PnO4T0FRqHCrunbQ824T11fLD0MMgpKzuGdnO-8eB5yHCYkn0JYO3VCC50O9MYgvuOr49cS5mtaJVptsaMiETu4-0oYouMfztK97JVyQiamvJHdA2W5i9dVVx7tG6R4CkXyLtwbAxz74UOVoRKsDpGU0H7BJshLAPue1edTU7OnozNCY5jfRvLYt8y_qwxB6Ol-uaqk4oI3cEDW9c94UKDSU8MVdPtA8P481abbFxOaLOXrDXvokQOpIV5t3nPBsd3EC-zc0p0C9miVd4PO9JJAGoS7c05hy5VxDyKAAC_MgjRgha9avVCb8UKrza2hWTiJRezgEmnBOip-6n2xY2JgD5E0KtCWg0w0jiA1gzqKs9AEfWiBesVfFcFto3Ni7YYqaWLjb4oeFTpI1UOaA89s8PwxYkFushiS2AWBA_pxTyrsgBBEwPRqQiEsgSp7QxqJX1mg1mc1ANj_K4bwv0roz9QGHB6RMz2Y4taQJ84R2EZkz1UrXHKzG46-gEoSRl563T5Zyd5u2bIw9VyY28KQ8Wax6YqxrRWGbnWcE7GlRFy5sVMlWaaATnenRHy6kUeVz1wXQHDL6P_QiRp6BHwaUWCg7go1K_zWSEGCil-qRNpCHLW6CItKv_KVUbBOG6vYq0myx9pmdaLJ7I0YixZWYXijwjjDlww0-zrGqNPW7_itHRo6qo86ugfFCv8qTuLUpQJZjXS_jhK4kUcOU1EK0NirDG7axwLlPjg7qKwX_qNdogCVenlUJa5EL02vEO8xufufi_xealgA'],
    [
      build2,
      'XQAAAAL0AgAAAAAAAABAqEppVBKy3f2f62vW6NGnAzQifk3h2Szo0R24FxL00kBK4cKfdwtejcfMvTZIkJ34NasHofmbTM8Q6MdRJEhOusAF9jlw3ZzCROr5jIUf6dnXgo5QhJNPM8S2XDQCtRsLoH_yAAk5q_Fz3NTbnXwpMGMiwSb51keeDYqXqVdUbdbgQOyEf84s_Z3auRsIsZpTBV8LOmcVfCw5ImzWr8-nVttGF6uqAvlwCDhNSOwT4tubwigtQO48c9XjLARE-vHiDHSzEsW3AOTRd0iuTt3Ldko4cgEMawl75mtaLVf8G8VvIBADnYoKPrxx0DGh-NAUmey_NRiPruQjfa_tLLaI1RqsZ9CtaExm1xvQPLHCJeDMyypXjBtucFYpvcEhMk3n1MLaH9VH4ZdBecR4rCQKJtBZl7OFKCbEelz9lZ5uv61W2oBy_y2cV_eHYseV2vaLR8Y3eLw4Bw6NOILeBfSS1v3nn_U_FGkHC72NhmMGBlV2y0KQ9gK-t4soj78addY-BMNymmwCHNw44I0UWjFUHXBprg0FBPaHojovgsWm0PuHZafHLDNRFBblnC9idPCxlodWjO3gg7cqGbKp_1ypMAA'
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
    const sharableStringResult = await service.toSharableURL(build)

    // Assert
    expect(sharableStringResult.success).toBe(true)
    expect(sharableStringResult.value).toBe(`localhost:3000/s/${expectedSharableString}`)
  })

  it('should fail when the URL is longer thant 2048 characters', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.get(WebsiteConfigurationService).configuration.buildSharingUrl = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

    Services.configure(ReductionService)

    const service = new BuildService()

    // Act
    const sharableStringResult = await service.toSharableURL(build1)

    // Assert
    expect(sharableStringResult.success).toBe(false)
    expect(sharableStringResult.failureMessage).toBe('Cannot share build "Build 1" by link because it is too large. You can still share it by using the "Export builds to a file" button to export it as a file that can be imported by another person.')
  })
})

describe('update()', () => {
  it('should update a build', async () => {
    // Arrange
    useItemServiceMock()
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()
    const build = service.get(build1.id).value
    build.name = 'New name'

    // Act / Assert
    const updateResult = await service.update(build1.id, build)
    expect(updateResult.success).toBe(true)

    const getUpdatedBuildResult = service.get(build1.id)
    expect(getUpdatedBuildResult.success).toBe(true)
    expect(getUpdatedBuildResult.value.name).toBe('New name')
  })

  it('should fail if the build does not exist', async () => {
    // Arrange
    useVersionServiceMock()
    useWebsiteConfigurationServiceMock()

    const service = new BuildService()
    const build = service.get(build1.id).value
    build.id = 'invalid'
    build.name = 'New name'

    // Act / Assert
    const updateResult = await service.update(build.id, build)
    expect(updateResult.success).toBe(false)
    expect(updateResult.failureMessage).toBe('Build "invalid" not found. It may have been deleted.')

    const getResult = service.get(build.id)
    expect(getResult.success).toBe(false)
    expect(getResult.failureMessage).toBe('Build "invalid" not found. It may have been deleted.')
  })
})