import { anyString, anything, instance, mock, spy, verify, when } from 'ts-mockito'
import { beforeEach, describe, expect, it } from 'vitest'
import { IBuild } from '../../models/build/IBuild'
import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'
import vueI18n from '../../plugins/vueI18n'
import { BuildService } from '../../services/BuildService'
import { FetchService } from '../../services/FetchService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { VersionService } from '../../services/VersionService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import Migrations from '../../utils/migrations/Migrations'
import ChangelogMock from '../__data__/changelogMock'
import WebsiteConfigurationMock from '../__data__/websiteConfigurationMock'
import { useFetchServiceMock } from '../__mocks__/FetchServiceMock'
import { useWebsiteConfigurationServiceMock } from '../__mocks__/WebsiteConfigurationServiceMock'

beforeEach(() => {
  localStorage.setItem(WebsiteConfigurationMock.languageStorageKey, 'en')
  Migrations.splice(0)
})

describe('checkHasNewVersion()', () => {
  it.each([
    [false, false],
    [true, true]
  ])('should indicate whether the version is newer than the last visit version', async (hasVersionStored: boolean, expected: boolean) => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    if (hasVersionStored) {
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      localStorage.setItem(websiteConfigurationService.configuration.versionStorageKey, '1.0.0')
    }

    const service = new VersionService()

    // Act
    const hasNewVersion = await service.checkHasNewVersion()

    // Assert
    expect(hasNewVersion).toBe(expected)
  })
})

describe('compareVersions()', () => {
  it.each([
    ['0.0.1', undefined, -1],
    ['0.1.0', undefined, -1],
    ['1.0.0', undefined, 0],
    ['1.0.1', undefined, 1],
    ['1.1.0', undefined, 1],
    [undefined, '0.0.1', 1],
    [undefined, '0.1.0', 1],
    [undefined, '1.0.0', 0],
    [undefined, '1.0.1', -1],
    [undefined, '1.1.0', -1],
    ['1.1.1', '0.0.2', 1],
    ['1.1.1', '0.2.0', 1],
    ['1.1.1', '2.0.0', -1],
    ['1.1.1', '1.1.0', 1],
    ['1.1.1', '1.0.1', 1],
    ['1.1.1', '0.1.1', 1],
    ['1.1.1', '1.1.1', 0],
    ['1.1.1', '1.1.2', -1],
    ['1.1.1', '1.2.1', -1],
    ['1.1.1', '2.1.1', -1],
    ['1.1.1', '1.1.10', -1],
    ['1.1.1', '1.10.1', -1],
    ['1.1.1', '10.1.1', -1],
    ['1.1.10', '10.1.1', -1],
    ['1.1.10', '1.10.1', -1],
    ['1.1.10', '1.1.10', 0],
    ['1.10.1', '10.1.1', -1],
    ['1.10.1', '1.10.1', 0],
    ['1.10.1', '1.1.10', 1],
    ['10.1.1', '10.1.1', 0],
    ['10.1.1', '1.10.1', 1],
    ['10.1.1', '1.1.10', 1]
  ])('should compare two versions (%s, %s)', (version1: string | undefined, version2: string | undefined, expected: number) => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()

    const service = new VersionService()

    // Act
    const result = service.compareVersions(version1, version2)

    // Assert
    expect(result).toBe(expected)
  })
})

describe('executeBuildMigrations()', () => {
  it('should execute build migrations in the correct order', async () => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()

    Services.configure(BuildService)

    const service = new VersionService()
    await service.initialize() // Initializing without migrations to be able to execute them afterwards

    const migrationResults: string[] = []
    const builds: IBuild[] = [
      {
        id: 'build1',
        name: 'build1',
        lastWebsiteVersion: '1.4.0'
      } as IBuild,
      {
        id: 'build2',
        name: 'build2',
        lastWebsiteVersion: '1.5.0'
      } as IBuild,
      {
        id: 'build3',
        name: 'build3',
        lastWebsiteVersion: '1.6.0'
      } as IBuild,
      {
        id: 'build4',
        name: 'build4',
        lastWebsiteVersion: undefined
      } as IBuild
    ]

    Migrations.push(
      {
        migrateBuild: (build: IBuild) => {
          build.name = build.name + '|' + '1.6.0'
          migrationResults.push('b1.6.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.6.0')
          return Promise.resolve(true)
        },
        version: '1.6.0'
      },
      {
        migrateBuild: (build: IBuild) => {
          build.name = build.name + '|' + '1.4.0'
          migrationResults.push('b1.4.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.4.0')
          return Promise.resolve(true)
        },
        version: '1.4.0'
      },
      {
        migrateBuild: (build: IBuild) => {
          build.name = build.name + '|' + '1.5.0'
          migrationResults.push('b1.5.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.5.0')
          return Promise.resolve(true)
        },
        version: '1.5.0'
      },
      {
        migrateBuild: (build: IBuild) => {
          build.name = build.name + '|' + '1.3.0'
          migrationResults.push('b1.3.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.3.0')
          return Promise.resolve(true)
        },
        version: '1.3.0'
      }
    )

    // Act
    for (const build of builds) {
      await service.executeBuildMigrations(build)
    }

    // Assert
    expect(builds).toStrictEqual([
      {
        id: 'build1',
        name: 'build1|1.5.0|1.6.0',
        lastWebsiteVersion: '1.4.0'
      } as IBuild,
      {
        id: 'build2',
        name: 'build2|1.6.0',
        lastWebsiteVersion: '1.5.0'
      } as IBuild,
      {
        id: 'build3',
        name: 'build3',
        lastWebsiteVersion: '1.6.0'
      } as IBuild,
      {
        id: 'build4',
        name: 'build4|1.3.0|1.4.0|1.5.0|1.6.0',
        lastWebsiteVersion: undefined
      } as IBuild
    ])
    expect(migrationResults).toStrictEqual(['b1.5.0', 'b1.6.0', 'b1.6.0', 'b1.3.0', 'b1.4.0', 'b1.5.0', 'b1.6.0'])
  })

  it.each([
    [
      'Build 1',
      'Error while updating build "Build 1" (Build 1) from version "1.4.0" to "1.6.0".'
    ],
    [
      '',
      'Error while updating build to version "1.6.0".'
    ]
  ])('should return false when a migration fails', async (buildId: string, expected: string) => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()

    Services.configure(BuildService)
    Services.configure(NotificationService)

    const notificationServiceSpy = spy(Services.get(NotificationService))

    const service = new VersionService()
    await service.initialize()

    Migrations.push(
      {
        migrateBuild: () => Promise.resolve(false),
        migrateBuildUnrelatedData: () => Promise.resolve(true),
        version: '1.6.0'
      })

    const build = {
      id: buildId,
      name: 'Build 1',
      lastWebsiteVersion: '1.4.0'
    } as IBuild

    // Act
    const result = await service.executeBuildMigrations(build)

    // Assert
    expect(result).toBe(false)
    verify(notificationServiceSpy.notify(NotificationType.error, expected)).once()
  })
})

describe('getChangelog()', () => {
  it.each([
    [
      '1.1.0',
      'en',
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Removed the text of the "Back to builds" button in the build editing screen in order to improve readability.'
            },
            { language: 'en', text: 'Fixed build toolbar items alignment.' }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: true,
          version: '1.1.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added a "Share" button in the build editing screen for sharing a build with a link. The link allows another person to get a copy of the build.'
            },
            {
              language: 'en',
              text: 'Added a "Changelog" button at the bottom of the page to display the list of changes made in each new version of the website.'
            }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.0'
        },
        {
          changes: [{ language: 'en', text: 'Launch of Totov Builder.' }],
          date: new Date('2021-12-29T23:00:00.000Z'),
          isNew: false,
          version: '1.0.0'
        }
      ]
    ],
    [
      '1.1.0',
      'fr',
      [
        {
          changes: [
            {
              language: 'fr',
              text: 'Suppression du texte du bouton "Retour aux équipements" dans l\'écran de saisie d\'équipement afin d\'améliorer la lisibilité.'
            },
            {
              language: 'fr',
              text: 'Correction de l\'alignement des éléments de la barre d\'outils.'
            }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: true,
          version: '1.1.1'
        },
        {
          changes: [
            {
              language: 'fr',
              text: 'Ajout d\'un bouton "Partager" dans l\'écran de saisie d\'équipement pour partager un équipement grâce à un lien. Le lien permet à une autre personne d\'obtenir une copie de l\'équipement.'
            },
            {
              language: 'fr',
              text: 'Ajout d\'un bouton "Liste des changements" en bas de page pour afficher la liste des changements effectués à chaque nouvelle version du site web.'
            }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.0'
        },
        {
          changes: [{ language: 'fr', text: 'Lancement de Totov Builder.' }],
          date: new Date('2021-12-29T23:00:00.000Z'),
          isNew: false,
          version: '1.0.0'
        }
      ]
    ],
    [
      '1.1.0',
      'de',
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Removed the text of the "Back to builds" button in the build editing screen in order to improve readability.'
            },
            { language: 'en', text: 'Fixed build toolbar items alignment.' }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: true,
          version: '1.1.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added a "Share" button in the build editing screen for sharing a build with a link. The link allows another person to get a copy of the build.'
            },
            {
              language: 'en',
              text: 'Added a "Changelog" button at the bottom of the page to display the list of changes made in each new version of the website.'
            }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.0'
        },
        {
          changes: [{ language: 'en', text: 'Launch of Totov Builder.' }],
          date: new Date('2021-12-29T23:00:00.000Z'),
          isNew: false,
          version: '1.0.0'
        }
      ]
    ],
    [
      undefined,
      'en',
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Removed the text of the "Back to builds" button in the build editing screen in order to improve readability.'
            },
            { language: 'en', text: 'Fixed build toolbar items alignment.' }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added a "Share" button in the build editing screen for sharing a build with a link. The link allows another person to get a copy of the build.'
            },
            {
              language: 'en',
              text: 'Added a "Changelog" button at the bottom of the page to display the list of changes made in each new version of the website.'
            }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.0'
        },
        {
          changes: [{ language: 'en', text: 'Launch of Totov Builder.' }],
          date: new Date('2021-12-29T23:00:00.000Z'),
          isNew: false,
          version: '1.0.0'
        }
      ]
    ],
    [
      '1.1.1',
      'en',
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Removed the text of the "Back to builds" button in the build editing screen in order to improve readability.'
            },
            { language: 'en', text: 'Fixed build toolbar items alignment.' }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added a "Share" button in the build editing screen for sharing a build with a link. The link allows another person to get a copy of the build.'
            },
            {
              language: 'en',
              text: 'Added a "Changelog" button at the bottom of the page to display the list of changes made in each new version of the website.'
            }
          ],
          date: new Date('2022-01-01T23:00:00.000Z'),
          isNew: false,
          version: '1.1.0'
        },
        {
          changes: [{ language: 'en', text: 'Launch of Totov Builder.' }],
          date: new Date('2021-12-29T23:00:00.000Z'),
          isNew: false,
          version: '1.0.0'
        }
      ]
    ]
  ])('should get the changelog', async (version: string | undefined, language: string, expectedChangelogs: IChangelogEntry[]) => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    vueI18n.locale.value = language as 'en' | 'fr'

    if (version != null) {
      localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, version)
    }

    const service = new VersionService()

    // Act
    const changelog = await service.getChangelog()

    // Assert
    expect(changelog).toStrictEqual(expectedChangelogs)
  })

  it('should return an empty list and notify when fetching fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const fetchServiceMock = mock<FetchService>()
    when(fetchServiceMock.get(anything())).thenResolve(undefined)
    Services.configure(FetchService, undefined, instance(fetchServiceMock))

    const logServiceMock = mock<LogService>()
    Services.configure(LogService, undefined, instance(logServiceMock))

    const notificationServiceMock = mock<NotificationService>()
    Services.configure(NotificationService, undefined, instance(notificationServiceMock))

    const service = new VersionService()

    // Act
    const changelog = await service.getChangelog()

    // Assert
    expect(changelog).toStrictEqual([])
    verify(logServiceMock.logException('message.changelogNotFetched')).once()
    verify(notificationServiceMock.notify(NotificationType.error, 'Something went wrong while loading the changelog.\nWait a bit and before trying to open it again.')).once()
  })

  it('should not fetch the changelog if already fetched', async () => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const fetchSpy = spy(Services.get(FetchService))

    const service = new VersionService()

    // Act
    await service.getChangelog()
    await service.getChangelog()

    // Assert
    verify(fetchSpy.get(anyString())).once()
  })

  it('should not fetch the changelog while it is already being fetched', async () => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const fetchSpy = spy(Services.get(FetchService))

    const service = new VersionService()

    // Act
    const promise = service.getChangelog()
    await service.getChangelog()
    await promise

    // Assert
    verify(fetchSpy.get(anyString())).once()
  })
})

describe('getVersion()', () => {
  it('should wait for the initialization to end', async () => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const service = new VersionService()

    // Act
    const currentVersion = await service.getVersion()

    // Assert
    expect(currentVersion).toBe('1.6.0')
  })
})

describe('initialize()', () => {
  it.each([
    [
      '1.1.0',
      '1.6.0',
      true
    ],
    [
      undefined,
      '1.6.0',
      false
    ],
    [
      '1.6.0',
      '1.6.0',
      false
    ]
  ])('should fetch version data', async (lastVisitVersion: string | undefined, expectedVersion: string, expectedHasNewVersion: boolean) => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()

    Services.configure(BuildService)

    if (lastVisitVersion != null) {
      localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, lastVisitVersion)
    }

    const service = new VersionService()
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration

    // Act
    await service.initialize()
    const version = await service.getVersion()
    const hasNewVersion = await service.checkHasNewVersion()
    const savedVersion = localStorage.getItem(websiteConfiguration.versionStorageKey)

    // Assert
    expect(version).toBe(expectedVersion)
    expect(hasNewVersion).toBe(expectedHasNewVersion)
    expect(savedVersion).toBe(expectedVersion)
  })

  it('should execute migrations in the correct order', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()

    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.getAll()).thenReturn([
      {
        id: 'build1',
        lastWebsiteVersion: '1.4.0'
      } as IBuild,
      {
        id: 'build1',
        lastWebsiteVersion: '1.0.0'
      } as IBuild
    ])

    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const migrationResults: string[] = []

    localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, '1.4.0')
    Migrations.push(
      {
        migrateBuild: () => {
          migrationResults.push('b1.6.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.6.0')
          return Promise.resolve(true)
        },
        version: '1.6.0'
      },
      {
        migrateBuild: () => {
          migrationResults.push('b1.4.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.4.0')
          return Promise.resolve(true)
        },
        version: '1.4.0'
      },
      {
        migrateBuild: () => {
          migrationResults.push('b1.5.0')
          return Promise.resolve(true)
        },
        migrateBuildUnrelatedData: () => {
          migrationResults.push('bud1.5.0')
          return Promise.resolve(true)
        },
        version: '1.5.0'
      }
    )

    const service = new VersionService()
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration

    // Act
    await service.initialize()
    const savedVersion = localStorage.getItem(websiteConfiguration.versionStorageKey)

    // Assert
    expect(migrationResults).toStrictEqual(['bud1.5.0', 'bud1.6.0', 'b1.5.0', 'b1.6.0', 'b1.4.0', 'b1.5.0', 'b1.6.0'])
    expect(savedVersion).toBe('1.6.0')
  })

  it('should not save the new version when a build unrelated migration fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, '1.5.0')
    Migrations.push(
      {
        migrateBuild: () => Promise.resolve(true),
        migrateBuildUnrelatedData: () => Promise.resolve(false),
        version: '1.6.0'
      }
    )

    const service = new VersionService()

    // Act
    await service.initialize()
    const version = await service.getVersion()
    const savedVersion = localStorage.getItem('version')

    // Assert
    expect(version).toBe('1.6.0')
    expect(savedVersion).toBe('1.5.0')
  })

  it('should not save the new version when a build migration fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const buildServiceMock = mock<BuildService>()
    when(buildServiceMock.getAll()).thenReturn([
      {
        id: 'build1',
        lastWebsiteVersion: '1.5.0',
        name: 'Build 1'
      } as IBuild
    ])
    Services.configure(BuildService, undefined, instance(buildServiceMock))

    const notificationServiceSpy = spy(Services.get(NotificationService))

    localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, '1.5.0')
    Migrations.push(
      {
        migrateBuild: () => Promise.resolve(false),
        migrateBuildUnrelatedData: () => Promise.resolve(true),
        version: '1.6.0'
      }
    )

    const service = new VersionService()

    // Act
    await service.initialize()
    const version = await service.getVersion()
    const savedVersion = localStorage.getItem(WebsiteConfigurationMock.versionStorageKey)

    // Assert
    expect(version).toBe('1.6.0')
    expect(savedVersion).toBe('1.5.0')
    verify(notificationServiceSpy.notify(NotificationType.error, 'Error while updating build "Build 1" (build1) from version "1.5.0" to "1.6.0".')).once()
  })

  it('should not initialize if it is already initialized', async () => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const service = new VersionService()

    // Act
    await service.initialize()
    await service.initialize()

    // Nothing to assert here, we just cover the case where return immediatly when already initialized in the initialize() method
  })

  it('should wait for the previous initialization to finish before returning', async () => {
    // Arrange
    useFetchServiceMock(ChangelogMock)
    useWebsiteConfigurationServiceMock()
    Services.configure(BuildService)

    const service = new VersionService()

    // Act
    const promise = service.initialize()
    await service.initialize()
    await promise

    // Nothing to assert here, we just cover the case where we await the previous initialization call to end before returning in the initialize() method
  })
})