import { VersionService } from '../../services/VersionService'
import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'
import vueI18n from '../../plugins/vueI18n'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import ChangelogMock from '../../../test-data/changelog.json'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'
import { ApiService } from '../../services/ApiService'
import { anyString, instance, mock, spy, verify, when } from 'ts-mockito'
import Result, { FailureType } from '../../utils/Result'
import Services from '../../services/repository/Services'
import { NotificationService } from '../../services/NotificationService'

beforeEach(() => {
  localStorage.setItem(WebsiteConfigurationMock.languageStorageKey, 'en')
})

afterEach(() => {
  localStorage.clear()
})

describe('checkHasNewVersion()', () => {
  it('should wait for the initialization to end', async () => {
    // Arrange
    useApiServiceMock(ChangelogMock as unknown as IChangelogEntry)
    useWebsiteConfigurationServiceMock()

    // Act
    const service = new VersionService()
    const hasNewVersion = await service.checkHasNewVersion()

    // Assert
    expect(hasNewVersion).toBe(true)
  })
})

describe('constructor', () => {
  it.each([
    [
      '1.1.0',
      'en',
      '1.1.1',
      true,
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
      '1.1.1',
      true,
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
      '1.1.1',
      true,
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
      '1.1.1',
      true,
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
          isNew: true,
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
      '1.1.1',
      false,
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
  ])('should get the current version and changelogs', async (version: string | undefined, language: string, expectedVersion: string, expectedHasNewVersion: boolean, expectedChangelogs: IChangelogEntry[]) => {
    // Arrange
    useApiServiceMock(ChangelogMock as unknown as IChangelogEntry)
    useWebsiteConfigurationServiceMock()
    vueI18n.locale.value = language as 'en' | 'fr'

    if (version != null) {
      localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, version)
    }

    // Act
    const service = new VersionService()
    const changelog = await service.getChangelogs()
    const currentVersion = await service.getCurrentVersion()
    const hasNewVersion = await service.checkHasNewVersion()

    // Assert
    expect(currentVersion).toBe(expectedVersion)
    expect(hasNewVersion).toBe(expectedHasNewVersion)
    expect(changelog).toStrictEqual(expectedChangelogs)
  })

  it('should fail the initialization when the API fails', async () => {
    // Arrange
    useWebsiteConfigurationServiceMock()
    Services.configure(NotificationService)

    const apiServiceMock = mock<ApiService>()
    when(apiServiceMock.get(anyString())).thenReturn(Promise.resolve(Result.fail(FailureType.error, undefined, 'API error')))

    Services.configure(ApiService, undefined, instance(apiServiceMock))


    // Act
    const service = new VersionService()
    const changelog = await service.getChangelogs()
    const currentVersion = await service.getCurrentVersion()
    const hasNewVersion = await service.checkHasNewVersion()

    // Assert
    expect(currentVersion).toBe('1.0.0')
    expect(hasNewVersion).toBe(false)
    expect(changelog).toStrictEqual([])
  })
})

describe('dismissNewVersion()', () => {
  it('should set the hasNewVersion property to false', async () => {
    // Arrange
    useApiServiceMock(ChangelogMock as unknown as IChangelogEntry)
    useWebsiteConfigurationServiceMock()

    // Act / Assert
    const service = new VersionService()

    let hasNewVersion = await service.checkHasNewVersion()
    expect(hasNewVersion).toBe(true)

    service.dismissNewVersion()
    hasNewVersion = await service.checkHasNewVersion()
    expect(hasNewVersion).toBe(false)
  })
})

describe('getChangelog()', () => {
  it('should not fetch the changelog API after being initialized', async () => {
    // Arrange
    jest.useRealTimers()

    useApiServiceMock(ChangelogMock as unknown as IChangelogEntry[])
    useWebsiteConfigurationServiceMock()

    const apiSpy = spy(Services.get(ApiService))

    vueI18n.locale.value = 'en'
    localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, '1.1.1')

    // Act
    const service = new VersionService()

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 1000))
    await delayPromise

    const changelog = await service.getChangelogs()

    // Assert
    verify(apiSpy.get(anyString())).once()
    expect(changelog).toStrictEqual([
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
    ])
  })
})

describe('getCurrentVersion()', () => {
  it('should wait for the initialization to end', async () => {
    // Arrange
    useApiServiceMock(ChangelogMock as unknown as IChangelogEntry)
    useWebsiteConfigurationServiceMock()

    // Act
    const service = new VersionService()
    const currentVersion = await service.getCurrentVersion()

    // Assert
    expect(currentVersion).toBe('1.1.1')
  })
})
