import { VersionService } from '../../services/VersionService'
import Configuration from '../../../test-data/configuration.json'
import { IChangelog } from '../../models/utils/IChangelog'
import vueI18n from '../../plugins/vueI18n'

beforeEach(() => {
  localStorage.setItem(Configuration.VITE_LANGUAGE_KEY, 'en')
})

afterEach(() => {
  localStorage.clear()
})

describe('constructor', () => {
  it.each([
    [
      '1.2.0',
      'en',
      '1.12.0',
      true,
      [
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 3'
            },
            {
              'language': 'en',
              'text': 'Changelog 4'
            }
          ],
          'date': new Date('2022-01-01T00:00:00+01:00'),
          'isNew': true,
          'version': '1.12.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 2'
            }
          ],
          'date': new Date('2021-12-30T00:00:00+01:00'),
          'isNew': false,
          'version': '1.2.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 1'
            }
          ],
          'date': new Date('2021-12-29T00:00:00+01:00'),
          'isNew': false,
          'version': '1.0.0'
        }
      ]
    ],
    [
      '1.2.0',
      'fr',
      '1.12.0',
      true,
      [
        {
          'changes': [
            {
              'language': 'fr',
              'text': 'Liste de changements 3'
            },
            {
              'language': 'fr',
              'text': 'Liste de changements 4'
            }
          ],
          'date': new Date('2022-01-01T00:00:00+01:00'),
          'isNew': true,
          'version': '1.12.0'
        },
        {
          'changes': [
            {
              'language': 'fr',
              'text': 'Liste de changements 2'
            }
          ],
          'date': new Date('2021-12-30T00:00:00+01:00'),
          'isNew': false,
          'version': '1.2.0'
        },
        {
          'changes': [
            {
              'language': 'fr',
              'text': 'Liste de changements 1'
            }
          ],
          'date': new Date('2021-12-29T00:00:00+01:00'),
          'isNew': false,
          'version': '1.0.0'
        }
      ]
    ],
    [
      '1.2.0',
      'de',
      '1.12.0',
      true,
      [
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 3'
            },
            {
              'language': 'en',
              'text': 'Changelog 4'
            }
          ],
          'date': new Date('2022-01-01T00:00:00+01:00'),
          'isNew': true,
          'version': '1.12.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 2'
            }
          ],
          'date': new Date('2021-12-30T00:00:00+01:00'),
          'isNew': false,
          'version': '1.2.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 1'
            }
          ],
          'date': new Date('2021-12-29T00:00:00+01:00'),
          'isNew': false,
          'version': '1.0.0'
        }
      ]
    ],
    [
      undefined,
      'en',
      '1.12.0',
      true,
      [
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 3'
            },
            {
              'language': 'en',
              'text': 'Changelog 4'
            }
          ],
          'date': new Date('2022-01-01T00:00:00+01:00'),
          'isNew': true,
          'version': '1.12.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 2'
            }
          ],
          'date': new Date('2021-12-30T00:00:00+01:00'),
          'isNew': true,
          'version': '1.2.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 1'
            }
          ],
          'date': new Date('2021-12-29T00:00:00+01:00'),
          'isNew': false,
          'version': '1.0.0'
        }
      ]
    ],
    [
      '1.12.0',
      'en',
      '1.12.0',
      false,
      [
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 3'
            },
            {
              'language': 'en',
              'text': 'Changelog 4'
            }
          ],
          'date': new Date('2022-01-01T00:00:00+01:00'),
          'isNew': false,
          'version': '1.12.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 2'
            }
          ],
          'date': new Date('2021-12-30T00:00:00+01:00'),
          'isNew': false,
          'version': '1.2.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 1'
            }
          ],
          'date': new Date('2021-12-29T00:00:00+01:00'),
          'isNew': false,
          'version': '1.0.0'
        }
      ]
    ],
    [
      '1.12.0',
      'en',
      '1.12.0',
      false,
      [
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 3'
            },
            {
              'language': 'en',
              'text': 'Changelog 4'
            }
          ],
          'date': new Date('2022-01-01T00:00:00+01:00'),
          'isNew': false,
          'version': '1.12.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 2'
            }
          ],
          'date': new Date('2021-12-30T00:00:00+01:00'),
          'isNew': false,
          'version': '1.2.0'
        },
        {
          'changes': [
            {
              'language': 'en',
              'text': 'Changelog 1'
            }
          ],
          'date': new Date('2021-12-29T00:00:00+01:00'),
          'isNew': false,
          'version': '1.0.0'
        }
      ]
    ]
  ])('should get the current version and changelogs', (version: string | undefined, language: string, expectedVersion: string, expectedHasNewVersion: boolean, expectedChangelogs: IChangelog[]) => {
    // Arrange
    vueI18n.locale.value = language

    if (version !== undefined) {
      localStorage.setItem(Configuration.VITE_VERSION_KEY, version)
    }

    // Act
    const service = new VersionService()
    const changelogs = service.getChangelogs()

    // Assert
    expect(service.currentVersion).toBe(expectedVersion)
    expect(service.hasNewVersion).toBe(expectedHasNewVersion)
    expect(changelogs).toStrictEqual(expectedChangelogs)
  })
})