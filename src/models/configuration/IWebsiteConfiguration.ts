/**
 * Provides the functionalities of the Totov Builder website configuration.
 */
export interface IWebsiteConfiguration {
  /**
   * Storage key for the allow cookies indicator.
   */
  allowCookiesStorageKey: string

  /**
   * Bug report URL.
   */
  bugReportUrl: string

  /**
   * URL for sharing builds.
   */
  buildSharingUrl: string

  /**
   * Storage key for the current page in the builds list.
   */
  buildsPageStorageKey: string,

  /**
   * Storage key for the current build filter.
   */
  buildsFilterStorageKey: string,

  /**
   * Storage key for the current build sorting colum.
   */
  buildsSortPropertyStorageKey: string

  /**
   * Storage key for the current build sort order.
   */
  buildsSortOrderStorageKey: string

  /**
   * Storage key prefix for builds.
   */
  buildStorageKeyPrefix: string

  /**
   * Cache dureation (in seconds).
   */
  cacheDuration: number

  /**
   * Contact mail address.
   */
  contactAddress: string

  /**
   * Discord server URL.
   */
  discordUrl: string

  /**
   * Changelog endpoint.
   */
  endpointChangelog: string

  /**
   * Items endpoint.
   */
  endpointItems: string

  /**
   * Presets endpoint.
   */
  endpointPresets: string

  /**
   * Prices endpoint.
   */
  endpointPrices: string

  /**
   * Tarkov values endpoint.
   */
  endpointTarkovValues: string

  /**
   * Website configuration endpoint.
   */
  endpointWebsiteConfiguration: string

  /**
   * Export file extension.
   */
  exportFileExtension: string

  /**
   * Export file prefix.
   */
  exportFileNamePrefix: string

  /**
   * Storage key for the value indicating whether the warning about builds not exported has been displayed.
   */
  exportWarningShowedStorageKey: string

  /**
   * Maximum number of tries when an error occurs when fetching data.
   */
  fetchMaxTries: number

  /**
   * Fetch timeout (in seconds).
   */
  fetchTimeout: number

  /**
   * Time to wait between retries when an error occurs whent fetching data (in seconds).
   */
  fetchWaitTimeBetweenRetries: number

  /**
   * Github project URL.
   */
  githubUrl: string

  /**
   * Storage key for the current global filter.
   */
  globalFilterStorageKey: string

  /**
   * Suffix of the storage key for the current sort field of each item category.
   */
  itemCategorySortPropertyStorageKeySuffix: string

  /**
   * Suffix of the storage key for the current sort order of each item category.
   */
  itemCategorySortOrderStorageKeySuffix: string

  /**
   * Storage key for the current item filter.
   */
  itemsFilterStorageKey: string

  /**
   * Storage key for the current item category filter and sort order.
   */
  itemsFilterAndSortCategoryStorageKey: string

  /**
   * Storage key for the current item sorting colum.
   */
  itemsSortPropertyStorageKey: string

  /**
   * Storage key for the current item sort order.
   */
  itemsSortOrderStorageKey: string

  /**
   * Storage key for the current language.
   */
  languageStorageKey: string

  /**
   * Error notifications duration (in seconds).
   */
  notificationErrorDuration: number

  /**
   * Information notifications duration (in seconds).
   */
  notificationInformationDuration: number

  /**
   * Success notifications duration (in seconds).
   */
  notificationSuccessDuration: number

  /**
   * Warning notifications duration (in seconds).
   */
  notificationWarningDuration: number

  /**
   * Indicates whether we are in a post-update period and items and prices are being updated.
   */
  postUpdatePeriod: boolean

  /**
   * Version of the website.
   */
  version: string,

  /**
   * Storage key for the current version.
   */
  versionStorageKey: string
}