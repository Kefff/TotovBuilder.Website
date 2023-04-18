import { IChangelogEntry } from '../models/configuration/IChangelogEntry'
import vueI18n from '../plugins/vueI18n'
import Result, { FailureType } from '../utils/Result'
import { ApiService } from './ApiService'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import i18n from '../plugins/vueI18n'
import { NotificationService, NotificationType } from './NotificationService'

export class VersionService {
  /**
   * Changelog.
   */
  private changelog: IChangelogEntry[] = []

  /**
   * Current version.
   */
  private currentVersion = '1.0.0'

  /**
   * Indicates whether the website has changed of version since the last visit.
   */
  private hasNewVersion = false

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
    this.initializationPromise = this.initialize().then(() => this.checkNewVersion())
  }

  /**
   * Indicates whether the website has changed of version since the last visit.
   */
  public async checkHasNewVersion(): Promise<boolean> {
    if (this.isInitializing) {
      await this.initializationPromise
    }

    return this.hasNewVersion
  }

  /**
   * Indicates that the new version notification has been dismissed by the user indicating that he is aware that a new version exists and should not be displayed anymore.
   */
  public dismissNewVersion(): void {
    this.hasNewVersion = false
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
   * Gets the current version.
   */
  public async getCurrentVersion(): Promise<string> {
    if (this.isInitializing) {
      await this.initializationPromise
    }

    return this.currentVersion
  }

  /**
   * Checks if the website has changed of version since the last visit.
   */
  private checkNewVersion() {
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration
    const versionStorageKey = websiteConfiguration.versionStorageKey
    const lastVersion = localStorage.getItem(versionStorageKey)

    if (lastVersion != null) {
      this.currentVersion = lastVersion
    }

    this.newVersions = this.changelog.filter(c => this.compareVersions(c.version, this.currentVersion)).map(c => c.version)

    if (this.newVersions.length > 0) {
      this.hasNewVersion = true
      this.currentVersion = this.newVersions[0]
    }

    localStorage.setItem(versionStorageKey, this.currentVersion)
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
   * Fetches changelogs.
   */
  private async fetchChangelog(): Promise<Result<void>> {
    const apiService = Services.get(ApiService)
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration
    const changelogResult = await apiService.get<IChangelogEntry[]>(websiteConfiguration.changelogApi)

    if (!changelogResult.success || changelogResult.value.length === 0) {
      return Result.fail(FailureType.error, 'VersionService.fetchChangelog()', i18n.t('message.changelogNotFetched'))
    }

    this.changelog = changelogResult.value

    return Result.ok()
  }

  /**
   * Initializes the data used by the service.
   */
  private async initialize(): Promise<void> {
    this.isInitializing = true
    const changelogResult = await this.fetchChangelog()
    this.isInitializing = false

    if (!changelogResult.success) {
      Services.get(NotificationService).notify(NotificationType.error, changelogResult.failureMessage, true)
    }
  }
}