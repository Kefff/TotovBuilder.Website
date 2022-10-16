/**
 * Provides the functionalities of the Totov Builder website configuration.
 */
export interface IWebsiteConfiguration {
  /*
   * Bug report URL.
   */
  bugReportUrl: string

  /**
   * URL for sharing builds.
   */
  buildSharingUrl: string

  /*
   * Storage key for the current build sorting colum.
   */
  buildsSortFieldStorageKey: string

  /*
   * Storage key for the current build sort order.
   */
  buildsSortOrderStorageKey: string

  /*
   * Storage key prefix for builds.
   */
  buildStorageKeyPrefix: string

  /*
   * Changelog API name.
   */
  changelogApi: string

  /*
   * Cache dureation (in seconds).
   */
  cacheDuration: number

  /*
   * Contact mail address.
   */
  contactAddress: string

  /*
   * Discord server URL.
   */
  discordUrl: string

  /*
   * Export file extension.
   */
  exportFileExtension: string

  /*
   * Export file prefix.
   */
  exportFileNamePrefix: string

  /*
   * Storage key for the value indicating whether the warning about builds not exported has been displayed.
   */
  exportWarningShowedStoregeKey: string

  /*
   * Fetch timeout (in seconds).
   */
  fetchTimeout: number

  /*
   * Github project URL.
   */
  githubUrl: string

  /*
   * Item categories API name.
   */
  itemCategoriesApi: string

  /*
   * Items API name.
   */
  itemsApi: string

  /*
   * Storage key for the current language.
   */
  languageStorageKey: string

  /*
   * Storage key for the current merchant filter.
   */
  merchantFilterStorageKey: string

  /*
   * Error notifications duration (in seconds).
   */
  notificationErrorDuration: number

  /*
   * Information notifications duration (in seconds).
   */
  notificationInformationDuration: number

  /*
   * Success notifications duration (in seconds).
   */
  notificationSuccessDuration: number

  /*
   * Warning notifications duration (in seconds).
   */
  notificationWarningDuration: number

  /*
   * Presets API name.
   */
  presetsApi: string

  /*
   * Prices API name.
   */
  pricesApi: string

  /*
   * Quests API name.
   */
  questsApi: string

  /**
   * Tarkov values API name.
   */
  tarkovValuesApi: string,

  /*
   * Storage key for the current version.
   */
  versionStorageKey: string
}