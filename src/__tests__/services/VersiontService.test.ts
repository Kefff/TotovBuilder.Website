import { VersionService } from '../../services/VersionService'
import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'
import vueI18n from '../../plugins/vueI18n'
import WebsiteConfigurationMock from '../../../test-data/website-configuration.json'
import { useWebsiteConfigurationServiceMock } from '../../__mocks__/WebsiteConfigurationServiceMock'
import ChangelogMock from '../../../test-data/changelog.json'
import { useApiServiceMock } from '../../__mocks__/ApiServiceMock'

beforeEach(() => {
  localStorage.setItem(WebsiteConfigurationMock.languageStorageKey, 'en')
})

afterEach(() => {
  localStorage.clear()
})

describe('constructor', () => {
  it.each([
    [
      '1.2.0',
      'en',
      '1.3.2',
      true,
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Changed the API used to get data to tarkov.dev since Tarkov-Tools has been shutdown.'
            },
            {
              language: 'en',
              text: 'Changed light encumberment value from 28kg to 26kg.'
            }
          ],
          date: new Date('2022-03-24T23:00:00.000Z'),
          isNew: true,
          version: '1.3.2'
        },
        {
          changes: [{ language: 'en', text: 'Updated item list.' }],
          date: new Date('2022-01-19T23:00:00.000Z'),
          isNew: true,
          version: '1.3.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added the ability to manually ignore the price of items. To do so, edit a build, click on the "Cog" icon next to an item and check "Ignore price".'
            },
            {
              language: 'en',
              text: 'Added a message when an error occurs while fetching prices.'
            }
          ],
          date: new Date('2022-01-14T23:00:00.000Z'),
          isNew: true,
          version: '1.3.0'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Improved internal code for better performances.'
            },
            { language: 'en', text: 'Improved text readability.' },
            {
              language: 'en',
              text: 'Changed the calculation of the total recoil of weapons. The recoil modifier of the chambered ammunition is now applied after the calculation of the recoil of the weapon with its mods instead of being applied during this calculation. For example, a default MP-133 with Magnum buckshot has now a vertical recoil of 705 instead of 926.'
            },
            {
              language: 'en',
              text: 'Fixed item incompatibility messages not displaying.'
            },
            {
              language: 'en',
              text: 'Fixed imported builds that were being flagged as not exported.'
            },
            { language: 'en', text: 'Fixed text alignment in item stats.' }
          ],
          date: new Date('2022-01-06T23:00:00.000Z'),
          isNew: false,
          version: '1.2.0'
        },
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
      '1.2.0',
      'fr',
      '1.3.2',
      true,
      [
        {
          changes: [
            {
              language: 'fr',
              text: 'Changement de l\'API utilisée pour obtenir les données pour utiliser tarkov.dev suite à l\'arrêt de Tarkov-Tools.'
            },
            {
              language: 'fr',
              text: 'Changement de la valeur d\'emcombrement léger de 28kg à 26kg.'
            }
          ],
          date: new Date('2022-03-24T23:00:00.000Z'),
          isNew: true,
          version: '1.3.2'
        },
        {
          changes: [{ language: 'fr', text: 'Mise à jour de la liste des objets.' }],
          date: new Date('2022-01-19T23:00:00.000Z'),
          isNew: true,
          version: '1.3.1'
        },
        {
          changes: [
            {
              language: 'fr',
              text: 'Ajout de la possibilité d\'ignorer manuellement le prix des objets. Pour ce faire, modifier un équipement, cliquer sur l\'icône "Roue crantée" à côté d\'un objet et cocher "Ignorer le prix".'
            },
            {
              language: 'fr',
              text: 'Ajout d\'un message lorsque qu\'une erreur se produit pendant la récupération des prix.'
            }
          ],
          date: new Date('2022-01-14T23:00:00.000Z'),
          isNew: true,
          version: '1.3.0'
        },
        {
          changes: [
            {
              language: 'fr',
              text: 'Amélioration du code interne pour de meilleures performances.'
            },
            { language: 'fr', text: 'Amélioration de la lisibilité des textes.' },
            {
              language: 'fr',
              text: 'Changement du calcul de recul total des armes. Le modificateur de recul de la munition dans la chambre de l\'arme est maintenant appliqué après le calcul du recul de l\'arme avec ses mods au lieu d\'être appliqué pendant ce calcul. Par exemple, un MP-133 standard avec Magnum buckshot a maintenant un recul vertical de 705 au lieu de 926.'
            },
            {
              language: 'fr',
              text: 'Correction des messages d\'incompatibilité entre objets qui ne s\'affichaient pas.'
            },
            {
              language: 'fr',
              text: 'Correction des équipements importés qui étaient marqués comme non exportés.'
            },
            {
              language: 'fr',
              text: 'Correction de l\'alignement des textes dans les statistiques des objets.'
            }
          ],
          date: new Date('2022-01-06T23:00:00.000Z'),
          isNew: false,
          version: '1.2.0'
        },
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
          isNew: false,
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
      '1.2.0',
      'de',
      '1.3.2',
      true,
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Changed the API used to get data to tarkov.dev since Tarkov-Tools has been shutdown.'
            },
            {
              language: 'en',
              text: 'Changed light encumberment value from 28kg to 26kg.'
            }
          ],
          date: new Date('2022-03-24T23:00:00.000Z'),
          isNew: true,
          version: '1.3.2'
        },
        {
          changes: [{ language: 'en', text: 'Updated item list.' }],
          date: new Date('2022-01-19T23:00:00.000Z'),
          isNew: true,
          version: '1.3.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added the ability to manually ignore the price of items. To do so, edit a build, click on the "Cog" icon next to an item and check "Ignore price".'
            },
            {
              language: 'en',
              text: 'Added a message when an error occurs while fetching prices.'
            }
          ],
          date: new Date('2022-01-14T23:00:00.000Z'),
          isNew: true,
          version: '1.3.0'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Improved internal code for better performances.'
            },
            { language: 'en', text: 'Improved text readability.' },
            {
              language: 'en',
              text: 'Changed the calculation of the total recoil of weapons. The recoil modifier of the chambered ammunition is now applied after the calculation of the recoil of the weapon with its mods instead of being applied during this calculation. For example, a default MP-133 with Magnum buckshot has now a vertical recoil of 705 instead of 926.'
            },
            {
              language: 'en',
              text: 'Fixed item incompatibility messages not displaying.'
            },
            {
              language: 'en',
              text: 'Fixed imported builds that were being flagged as not exported.'
            },
            { language: 'en', text: 'Fixed text alignment in item stats.' }
          ],
          date: new Date('2022-01-06T23:00:00.000Z'),
          isNew: false,
          version: '1.2.0'
        },
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
      undefined,
      'en',
      '1.3.2',
      true,
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Changed the API used to get data to tarkov.dev since Tarkov-Tools has been shutdown.'
            },
            {
              language: 'en',
              text: 'Changed light encumberment value from 28kg to 26kg.'
            }
          ],
          date: new Date('2022-03-24T23:00:00.000Z'),
          isNew: true,
          version: '1.3.2'
        },
        {
          changes: [{ language: 'en', text: 'Updated item list.' }],
          date: new Date('2022-01-19T23:00:00.000Z'),
          isNew: true,
          version: '1.3.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added the ability to manually ignore the price of items. To do so, edit a build, click on the "Cog" icon next to an item and check "Ignore price".'
            },
            {
              language: 'en',
              text: 'Added a message when an error occurs while fetching prices.'
            }
          ],
          date: new Date('2022-01-14T23:00:00.000Z'),
          isNew: true,
          version: '1.3.0'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Improved internal code for better performances.'
            },
            { language: 'en', text: 'Improved text readability.' },
            {
              language: 'en',
              text: 'Changed the calculation of the total recoil of weapons. The recoil modifier of the chambered ammunition is now applied after the calculation of the recoil of the weapon with its mods instead of being applied during this calculation. For example, a default MP-133 with Magnum buckshot has now a vertical recoil of 705 instead of 926.'
            },
            {
              language: 'en',
              text: 'Fixed item incompatibility messages not displaying.'
            },
            {
              language: 'en',
              text: 'Fixed imported builds that were being flagged as not exported.'
            },
            { language: 'en', text: 'Fixed text alignment in item stats.' }
          ],
          date: new Date('2022-01-06T23:00:00.000Z'),
          isNew: true,
          version: '1.2.0'
        },
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
    ]/*,
    [
      '1.12.0',
      'en',
      '1.12.0',
      false,
      [
        {
          changes: [
            {
              language: 'en',
              text: 'Changed the API used to get data to tarkov.dev since Tarkov-Tools has been shutdown.'
            },
            {
              language: 'en',
              text: 'Changed light encumberment value from 28kg to 26kg.'
            }
          ],
          date: new Date('2022-03-24T23:00:00.000Z'),
          isNew: false,
          version: '1.3.2'
        },
        {
          changes: [{ language: 'en', text: 'Updated item list.' }],
          date: new Date('2022-01-19T23:00:00.000Z'),
          isNew: false,
          version: '1.3.1'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Added the ability to manually ignore the price of items. To do so, edit a build, click on the "Cog" icon next to an item and check "Ignore price".'
            },
            {
              language: 'en',
              text: 'Added a message when an error occurs while fetching prices.'
            }
          ],
          date: new Date('2022-01-14T23:00:00.000Z'),
          isNew: false,
          version: '1.3.0'
        },
        {
          changes: [
            {
              language: 'en',
              text: 'Improved internal code for better performances.'
            },
            { language: 'en', text: 'Improved text readability.' },
            {
              language: 'en',
              text: 'Changed the calculation of the total recoil of weapons. The recoil modifier of the chambered ammunition is now applied after the calculation of the recoil of the weapon with its mods instead of being applied during this calculation. For example, a default MP-133 with Magnum buckshot has now a vertical recoil of 705 instead of 926.'
            },
            {
              language: 'en',
              text: 'Fixed item incompatibility messages not displaying.'
            },
            {
              language: 'en',
              text: 'Fixed imported builds that were being flagged as not exported.'
            },
            { language: 'en', text: 'Fixed text alignment in item stats.' }
          ],
          date: new Date('2022-01-06T23:00:00.000Z'),
          isNew: false,
          version: '1.2.0'
        },
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
    ]*/
  ])('should get the current version and changelogs', async (version: string | undefined, language: string, expectedVersion: string, expectedHasNewVersion: boolean, expectedChangelogs: IChangelogEntry[]) => {
    // Arrange
    useApiServiceMock(ChangelogMock as unknown as IChangelogEntry)
    useWebsiteConfigurationServiceMock()
    vueI18n.locale.value = language

    if (version !== undefined) {
      localStorage.setItem(WebsiteConfigurationMock.versionStorageKey, version)
    }

    // Act
    const service = new VersionService()
    const changelogs = await service.getChangelogs()

    // Assert
    expect(service.currentVersion).toBe(expectedVersion)
    expect(service.hasNewVersion).toBe(expectedHasNewVersion)
    expect(changelogs).toStrictEqual(expectedChangelogs)
  })
})