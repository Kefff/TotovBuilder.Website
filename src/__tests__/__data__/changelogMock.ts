import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'

const changelog: IChangelogEntry[] = [
  {
    changes: [
      {
        en: 'Removed the text of the "Back to builds" button in the build editing screen in order to improve readability.',
        fr: 'Suppression du texte du bouton "Retour aux équipements" dans l\'écran de saisie d\'équipement afin d\'améliorer la lisibilité.'
      },
      {
        en: 'Fixed build toolbar items alignment.',
        fr: 'Correction de l\'alignement des éléments de la barre d\'outils.'
      }
    ],
    date: new Date(2022, 0, 2),
    isNew: false,
    version: '1.1.1'
  },
  {
    changes: [
      {
        en: 'Added a "Share" button in the build editing screen for sharing a build with a link. The link allows another person to get a copy of the build.',
        fr: 'Ajout d\'un bouton "Partager" dans l\'écran de saisie d\'équipement pour partager un équipement grâce à un lien. Le lien permet à une autre personne d\'obtenir une copie de l\'équipement.'
      },
      {
        en: 'Added a "Changelog" button at the bottom of the page to display the list of changes made in each new version of the website.',
        fr: 'Ajout d\'un bouton "Liste des changements" en bas de page pour afficher la liste des changements effectués à chaque nouvelle version du site web.'
      }
    ],
    date: new Date(2022, 0, 2),
    isNew: false,
    version: '1.1.0'
  },
  {
    changes: [
      {
        en: 'Launch of Totov Builder.',
        fr: 'Lancement de Totov Builder.'
      }
    ],
    date: new Date(2021, 11, 30),
    isNew: false,
    version: '1.0.0'
  }
]

export default changelog