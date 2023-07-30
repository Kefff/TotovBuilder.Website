import { IChangelogEntry } from '../models/configuration/IChangelogEntry'
import vueI18n from '../plugins/vueI18n'
import { ApiService } from './ApiService'
import Services from './repository/Services'
import { WebsiteConfigurationService } from './WebsiteConfigurationService'
import i18n from '../plugins/vueI18n'
import { NotificationService, NotificationType } from './NotificationService'
import Migrations from '../utils/migrations/Migrations'
import { BuildService } from './BuildService'
import { IMigration } from '../models/utils/IMigration'
import { IBuild } from '../models/build/IBuild'

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
  private changelogFetchingPromise: Promise<void> = Promise.resolve()

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
  private lastVisitVersion: string | undefined = undefined

  /**
   * Current version.
   */
  private version = '1.0.0'

  /**
   * Indicates whether the website has changed of version since the last visit.
   */
  public async checkHasNewVersion(): Promise<boolean> {
    await this.initialize()

    return this.hasNewVersion
  }

  /**
   * Compares two versions.
   * @param version1 - First version.
   * @param version2 - Second version.
   * @returns -1 if the version is older that the second one; 0 if they are identical; 1 if the first version is newer thant the second one.
   */
  public compareVersions(version1: string | undefined, version2: string | undefined): number {
    if (version1 == undefined) {
      version1 = '1.0.0'
    }

    if (version2 == undefined) {
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
   * @returns true when all the required migrations have successfuly been executed; otherwise false.
   */
  public async executeBuildMigrations(build: IBuild): Promise<boolean> {
    const migrationsToExecute = this.getMigrationsToExecute(build.lastWebsiteVersion)

    for (const migration of migrationsToExecute) {
      const migrationResult = await migration.migrateBuild(build)

      if (!migrationResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.buildMigrationError', { buildId: build.id, version: migration.version }), true)

        return false
      }
    }

    return true
  }

  /**
   * Gets the changelog.
   * @returns Changelog.
   */
  public async getChangelog(): Promise<IChangelogEntry[]> {
    await this.fetchChangelog()

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
  public async getVersion(): Promise<string> {
    await this.initialize()

    return this.version
  }

  /**
   * Initializes the data used by the service.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    if (!this.isInitializing) {
      this.initializationPromise = this.startInitialization()
    }

    await this.initializationPromise
  }

  /**
   * Executes migrations required to update data not related to builds since the last connection to the website.
   * @returns true when the migrations have successfully been executed; otherwise false.
   */
  private async executeBuildUnrelatedMigrations(): Promise<boolean> {
    const migrationsToExecute = this.getMigrationsToExecute(this.lastVisitVersion)

    for (const migration of migrationsToExecute) {
      const migrationResult = await migration.migrateBuildUnrelatedData()

      if (!migrationResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.migrationError', { version: migration.version }), true)

        return false
      }
    }

    return true
  }

  /**
   * Executes the migrations.
   */
  private async executeMigrations(): Promise<void> {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    if (!this.hasNewVersion) {
      if (this.lastVisitVersion == null) {
        // Storing the version during the first visit
        localStorage.setItem(websiteConfigurationService.configuration.versionStorageKey, this.version)
      }

      return
    }

    const buildUnrelatedMigrationsResult = await this.executeBuildUnrelatedMigrations()

    const buidService = Services.get(BuildService)
    let buildsMigrationsResult = true

    for (const build of buidService.getAll()) {
      const buildMigrationsResult = await this.executeBuildMigrations(build)

      if (!buildMigrationsResult) {
        buildsMigrationsResult = false
        continue
      }

      buidService.update(build.id, build)
    }

    if (buildUnrelatedMigrationsResult && buildsMigrationsResult) {
      // Only storing the new version as the effective last visit version when the migration is successful to be able to replay migrations that could fail
      localStorage.setItem(websiteConfigurationService.configuration.versionStorageKey, this.version)
    }
  }

  /**
   * Fetches the changelog.
   */
  private async fetchChangelog(): Promise<void> {
    await this.initialize()

    if (!this.changelogFetched) {
      if (!this.isFetchingChangelogs) {
        this.changelogFetchingPromise = this.startFetchingChangelog()
      }

      await this.changelogFetchingPromise
    }
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
   * @returns true when the version is newer than the last visit version; otherwise false.
   */
  private isNew(version: string) {
    const isNew =
      this.lastVisitVersion != null
      && this.compareVersions(version, this.lastVisitVersion) > 0

    return isNew
  }

  /**
   * Starts the fetching of the changelog.
   */
  private async startFetchingChangelog(): Promise<void> {
    this.isFetchingChangelogs = true

    const apiService = Services.get(ApiService)
    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration
    const changelogResult = await apiService.get<IChangelogEntry[]>(websiteConfiguration.changelogApi)

    if (changelogResult.success && changelogResult.value.length > 0) {
      this.changelog = changelogResult.value
      this.changelogFetched = true
    } else {
      Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.changelogNotFetched'), true)
    }

    this.isFetchingChangelogs = false
  }

  /**
   * Starts the initialization of the service.
   */
  private async startInitialization(): Promise<void> {
    this.isInitializing = true

    const websiteConfiguration = Services.get(WebsiteConfigurationService).configuration

    this.version = websiteConfiguration.version
    this.lastVisitVersion = localStorage.getItem(websiteConfiguration.versionStorageKey) ?? undefined
    this.hasNewVersion = this.isNew(this.version)

    await this.executeMigrations()

    this.isInitializing = false
    this.isInitialized = true
  }
}