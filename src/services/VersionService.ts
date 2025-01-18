import { IBuild } from '../models/build/IBuild'
import { IChangelogEntry } from '../models/configuration/IChangelogEntry'
import { IMigration } from '../models/utils/IMigration'
import vueI18n from '../plugins/vueI18n'
import Migrations from '../utils/migrations/Migrations'
import { BuildService } from './BuildService'
import { FetchService } from './FetchService'
import { LogService } from './LogService'
import { NotificationService, NotificationType } from './NotificationService'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import Services from './repository/Services'

export class VersionService {
  /**
   * Changelog.
   */
  private changelog: IChangelogEntry[] = []

  /**
   * Indicates whether changelog have been fetched.
   */
  private changelogFetched = false

  /**
   * Changelog fetching promise.
   */
  private changelogFetchingPromise: Promise<IChangelogEntry[] | undefined> = Promise.resolve([])

  /**
   * Indicates whether the website has changed of version since the last visit.
   */
  private hasNewVersion = false

  /**
   * Initialization promise.
   */
  private initializationPromise: Promise<void> = Promise.resolve()

  /**
   * Indicates whether the changelog is being fetched.
   */
  private isFetchingChangelogs = false

  /**
   * Indicates whether the service is initialized.
   */
  private isInitialized = false

  /**
   * Indicates whether the service is initializing.
   */
  private isInitializing = false

  /**
   * Version during the last visit.
   */
  private lastVisitVersion: string | undefined

  /**
   * Current version.
   */
  private version: string = ''

  /**
   * Indicates whether the website has changed of version since the last visit.
   */
  public async checkHasNewVersionAsync(): Promise<boolean> {
    await this.initializeAsync()

    return this.hasNewVersion
  }

  /**
   * Compares two versions.
   * @param version1 - First version.
   * @param version2 - Second version.
   * @returns -1 if the version is older that the second one; 0 if they are identical; 1 if the first version is newer thant the second one.
   */
  public compareVersions(version1: string | undefined, version2: string | undefined): number {
    if (version1 == null) {
      version1 = '1.0.0'
    }

    if (version2 == null) {
      version2 = '1.0.0'
    }

    const splitVersion1AsNumber = version1.split('.')
    const splitVersion2AsNumber = version2.split('.')

    for (let i = 0; i < splitVersion1AsNumber.length; i++) {
      const numberVersion1 = Number(splitVersion1AsNumber[i])
      const numberVersion2 = Number(splitVersion2AsNumber[i])

      if (numberVersion1 < numberVersion2) {
        return -1
      } else if (numberVersion1 > numberVersion2) {
        return 1
      }
    }

    return 0
  }

  /**
   * Executes migrations required to update a build since the last connection to the website.
   * @param build - Build to update.
   * @returns `true` when all the required migrations have successfuly been executed; otherwise `false`.
   */
  public async executeBuildMigrationsAsync(build: IBuild): Promise<boolean> {
    let success = true
    const migrationsToExecute = this.getMigrationsToExecute(build.lastWebsiteVersion)

    for (const migration of migrationsToExecute) {
      const migrationSuccess = await migration.migrateBuildPromise(build)

      if (!migrationSuccess) {
        const errorMessage = build.id !== ''
          ? vueI18n.t('message.buildMigrationErrorNotification', { buildName: build.name, buildId: build.id, oldVersion: build.lastWebsiteVersion, newVersion: migration.version })
          : vueI18n.t('message.sharedBuildMigrationErrorNotification', { newVersion: migration.version })

        Services.get(LogService).logError(errorMessage)
        Services.get(NotificationService).notify(NotificationType.error, errorMessage)

        success = false
      }
    }

    return success
  }

  /**
   * Gets the changelog.
   * Displays a notification when no changelog could be fetched.
   * @returns Changelog.
   */
  public async getChangelogAsync(): Promise<IChangelogEntry[]> {
    await this.initializeAsync()

    if (!this.changelogFetched) {
      this.changelogFetched = await this.fetchChangelogAsync()

      if (!this.changelogFetched) {
        Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.changelogLoadingError'))
      }
    }

    const changelogs: IChangelogEntry[] = []
    const hasChangelogsInCurrentLanguage = this.changelog.some(cl => cl.changes.some(c => c.language === vueI18n.locale.value))

    for (const changelog of this.changelog) {
      changelogs.push({
        changes: changelog.changes.filter(c => c.language === (hasChangelogsInCurrentLanguage ? vueI18n.locale.value : vueI18n.fallbackLocale.value)),
        date: new Date(changelog.date),
        isNew: this.isNew(changelog.version),
        version: changelog.version
      })
    }

    return changelogs
  }

  /**
   * Gets the current version.
   */
  public async getVersionAsync(): Promise<string> {
    await this.initializeAsync()

    return this.version
  }

  /**
   * Initializes the data used by the service.
   */
  public async initializeAsync(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    if (!this.isInitializing) {
      this.initializationPromise = this.startInitializationAsync()
    }

    await this.initializationPromise
  }

  /**
   * Executes migrations required to update data not related to builds since the last connection to the website.
   * @returns `true` when the migrations have successfully been executed; otherwise `false`.
   */
  private async executeBuildUnrelatedMigrationsAsync(): Promise<boolean> {
    const migrationsToExecute = this.getMigrationsToExecute(this.lastVisitVersion)

    let hasSucceeded = true

    for (const migration of migrationsToExecute) {
      const migrationSuccess = await migration.migrateBuildUnrelatedDataPromise()

      if (!migrationSuccess) {
        hasSucceeded = false
      }
    }

    return hasSucceeded
  }

  /**
   * Executes the migrations.
   */
  private async executeMigrationsAsync(): Promise<void> {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    if (!this.hasNewVersion) {
      if (this.lastVisitVersion == null) {
        // Storing the version during the first visit
        localStorage.setItem(websiteConfigurationService.configuration.versionStorageKey, this.version)
      }

      return
    }

    const buildUnrelatedMigrationsResult = await this.executeBuildUnrelatedMigrationsAsync()

    const buidService = Services.get(BuildService)
    let buildsMigrationsResult = true

    for (const build of buidService.getAll()) {
      const buildMigrationsResult = await this.executeBuildMigrationsAsync(build)

      if (!buildMigrationsResult) {
        buildsMigrationsResult = false
        continue
      }

      await buidService.updateAsync(build)
    }

    if (buildUnrelatedMigrationsResult && buildsMigrationsResult) {
      // Only storing the new version as the effective last visit version when the migration is successful to be able to replay migrations that could fail
      localStorage.setItem(websiteConfigurationService.configuration.versionStorageKey, this.version)
    }
  }

  /**
   * Fetches the changelog.
   * @returns
   */
  private async fetchChangelogAsync(): Promise<boolean> {
    if (!this.isFetchingChangelogs) {
      this.changelogFetchingPromise = this.startChangelogFetchingAsync()
    }

    const changelog = await this.changelogFetchingPromise

    if (changelog == undefined) {
      return false
    }

    this.changelog = changelog

    return true
  }

  /**
   * Gets the migrations to execute that are posterior to the specified version.
   * @param version - Current version.
   * @returns Migrations to execute .
   */
  private getMigrationsToExecute(version: string | undefined): IMigration[] {
    if (version == null) {
      version = '1.0.0'
    }

    const migrationsToExecute = Migrations.filter(m => this.compareVersions(m.version, version) > 0)
    migrationsToExecute.sort((a, b) => this.compareVersions(a.version, b.version))

    return migrationsToExecute
  }

  /**
   * Indicates whether a version is newer than the last visit version.
   * @param version - Version.
   * @returns `true` when the version is newer than the last visit version; otherwise `false`.
   */
  private isNew(version: string): boolean {
    const isNew =
      this.lastVisitVersion != null
      && this.compareVersions(version, this.lastVisitVersion) > 0

    return isNew
  }

  /**
   * Starts the fetching of the changelog.
   * @returns Changelog.
   */
  private async startChangelogFetchingAsync(): Promise<IChangelogEntry[] | undefined> {
    this.isFetchingChangelogs = true

    const isDebug = import.meta.env.VITE_DEBUG === 'true'
    const fetchService = Services.get(FetchService)
    const endpoint = '/' + Services.get(WebsiteConfigurationService).configuration.endpointChangelog

    if (isDebug) {
      Services.get(LogService).logInformation('message.fetchingChangelog', { date: new Date().toISOString() })
    }

    const changelog = await fetchService.getAsync<IChangelogEntry[]>(endpoint)

    if (changelog == null || changelog.length === 0) {
      Services.get(LogService).logException('message.changelogNotFetched')

      return undefined
    }

    if (isDebug) {
      Services.get(LogService).logInformation('message.changelogFetched', { date: new Date().toISOString() })
    }

    this.isFetchingChangelogs = false

    return changelog
  }

  /**
   * Starts the initialization of the service.
   */
  private async startInitializationAsync(): Promise<void> {
    this.isInitializing = true

    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration

    this.version = websiteConfiguration.version
    this.lastVisitVersion = localStorage.getItem(websiteConfiguration.versionStorageKey) ?? undefined
    this.hasNewVersion = this.isNew(this.version)

    await this.executeMigrationsAsync()

    this.isInitializing = false
    this.isInitialized = true
  }
}