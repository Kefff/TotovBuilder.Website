import Configuration from '../../test-data/configuration.json'
import Changelogs from '../../public/changelog.json'
import { IChangelog } from '../models/utils/IChangelog'
import vueI18n from '../plugins/vueI18n'

export class VersionService {
  /**
   * Current version.
   */
  public get currentVersion(): string {
    return this._currentVersion
  }
  private _currentVersion = '1.0.0'

  /**
   * Indicates whether the website has changed of version since the last visit.
   */
  public hasNewVersion = false

  /**
   * New versions since the last visit.
   */
  private newVersions: string[] = []

  /**
   * Initializes a new instance of the VersionService class.
   */
  public constructor() {
    this.checkNewVersion()
    this.getChangelogs()
  }

  /**
   * Gets the changelogs.
   * @returns Changelogs.
   */
  public getChangelogs(): IChangelog[] {
    const changelogs: IChangelog[] = []
    const hasChangelogsInCurrentLanguage = Changelogs.some(cl => cl.changes.some(c => c.language === vueI18n.locale.value))

    for (const changelog of Changelogs) {
      changelogs.push({
        changes: changelog.changes.filter(c => c.language === (hasChangelogsInCurrentLanguage ? vueI18n.locale.value : vueI18n.fallbackLocale.value)),
        date: new Date(changelog.date),
        isNew: this.newVersions.some(nv => nv === changelog.version),
        version: changelog.version
      })
    }

    return changelogs
  }

  /**
   * Checks if the website has changed of version since the last visit.
   */
  private checkNewVersion(): void {
    const lastVersion = localStorage.getItem(Configuration.VITE_VERSION_KEY)

    if (lastVersion != undefined) {
      this._currentVersion = lastVersion
    }

    this.newVersions = Changelogs.filter(c => c.version > this._currentVersion).map(c => c.version)

    if (this.newVersions.length > 0) {
      this.hasNewVersion = true
      this._currentVersion = this.newVersions[0]
    }

    localStorage.setItem(Configuration.VITE_VERSION_KEY, this._currentVersion)
  }
}