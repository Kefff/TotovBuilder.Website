/**
 * Provides the functionalities of the Totov Builder website configuration.
 */
export interface IWebsiteConfiguration {
  /**
   * Storage key for the allow cookies indicator.
   */
  allowCookiesStorageKey: string

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
   * Changelog endpoint.
   */
  endpointChangelog: string

  /*
   * Item categories endpoint.
   */
  endpointItemCategories: string

  /*
   * Items endpoint.
   */
  endpointItems: string

  /*
   * Presets endpoint.
   */
  endpointPresets: string

  /*
   * Prices endpoint.
   */
  endpointPrices: string

  /**
   * Tarkov values endpoint.
   */
  endpointTarkovValues: string

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
  exportWarningShowedStorageKey: string

  /**
   * Maximum number of tries when an error occurs when fetching data.
   */
  fetchMaxTries: number

  /*
   * Fetch timeout (in seconds).
   */
  fetchTimeout: number

  /**
   * Time to wait between retries when an error occurs whent fetching data (in seconds).
   */
  fetchWaitTimeBetweenRetries: number

  /*
   * Github project URL.
   */
  githubUrl: string

  /*
   * Storage key for the current global filter.
   */
  globalFilterStorageKey: string

  /*
   * Storage key for the current language.
   */
  languageStorageKey: string

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

  /**
   * Indicates whether we are in a post-update period and items and prices are being updated.
   */
  postUpdatePeriod: boolean

  /**
   * Version of the website.
   */
  version: string,

  /*
   * Storage key for the current version.
   */
  versionStorageKey: string
}