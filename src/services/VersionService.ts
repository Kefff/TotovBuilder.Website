import { IChangelogEntry } from '../models/configuration/IChangelogEntry'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import { ApiService } from './ApiService'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import i18n from '../plugins/vueI18n'

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
   * Changelog.
   */
  private changelog: IChangelogEntry[] = []

  /**
   * Initialization task.
   */
  private initializationPromise: Promise<void>

  /**
   * Determines whether the service is initializing or not.
   */
  private isInitializing = false

  /**
   * New versions since the last visit.
   */
  private newVersions: string[] = []

  /**
   * Initializes a new instance of the VersionService class.
   */
  public constructor() {
    this.initializationPromise = this.initialize()
    this.checkNewVersion()
  }

  /**
   * Gets the changelogs.
   * @returns Changelogs.
   */
  public async getChangelogs(): Promise<IChangelogEntry[]> {
    if (this.isInitializing) {
      await this.initializationPromise
    }

    const changelogs: IChangelogEntry[] = []
    const hasChangelogsInCurrentLanguage = this.changelog.some(cl => cl.changes.some(c => c.language === vueI18n.locale.value))

    for (const changelog of this.changelog) {
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
  private checkNewVersion() {
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration
    const versionStorageKey = websiteConfiguration.versionStorageKey
    const lastVersion = localStorage.getItem(versionStorageKey)

    if (lastVersion != undefined) {
      this._currentVersion = lastVersion
    }

    this.newVersions = this.changelog.filter(c => this.compareVersions(c.version, this._currentVersion)).map(c => c.version)

    if (this.newVersions.length > 0) {
      this.hasNewVersion = true
      this._currentVersion = this.newVersions[0]
    }

    localStorage.setItem(versionStorageKey, this._currentVersion)
  }

  /**
   * Compares two versions.
   * @param version1 - First version.
   * @param version2 - Second version.
   * @returns true if the first version is more recent that the second version; otherwise false.
   */
  private compareVersions(version1: string, version2: string): boolean {
    const version1AsNumber = Number(version1.replace(/[.]/g, ''))
    const version2AsNumber = Number(version2.replace(/[.]/g, ''))

    return version1AsNumber > version2AsNumber
  }

  /**
   * Fetchs items.
   */
  private async fetchChangelog(): Promise<Result<void>> {
    const apiService = Services.get(ApiService)
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration
    const changelogResult = await apiService.get<IChangelogEntry[]>(websiteConfiguration.changelogApi)

    if (!changelogResult.success) {
      return Result.failFrom(changelogResult)
    }

    if (changelogResult.value.length === 0) {
      return Result.fail(FailureType.error, 'ApiItemFetcher.get()', i18n.t('message.itemsNotFetched'))
    }

    this.changelog = changelogResult.value

    return Result.ok()
  }

  /**
   * Initializes the data used by the service.
   */
  private async initialize(): Promise<void> {
    const fetchResult = await this.fetchChangelog()

    if (!fetchResult.success) {
      throw new Error()
    }
  }
}