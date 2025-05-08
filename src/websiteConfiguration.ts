import { IWebsiteConfiguration } from './models/configuration/IWebsiteConfiguration'

/**
 * Version of the website.
 * It must be updated each time a new update of the website is deployed.
 */
const version = '2.0.0'

/**
 * Part of the website configuration that cannot be changed by getting updated values from the website configuration API.
 * These values should not need to be changed.
 */
const fixedConfiguration = {
  allowCookiesStorageKey: 'allow_cookies',
  buildsFilterStorageKey: 'builds_filter_field',
  buildSharingUrl: 's/',
  buildsPageStorageKey: 'builds_page',
  buildsSortPropertyStorageKey: 'builds_sort_field',
  buildsSortOrderStorageKey: 'builds_sort_order',
  buildStorageKeyPrefix: 'build_',
  exportFileExtension: '.ttb',
  exportFileNamePrefix: 'TotovBuilder',
  exportWarningShowedStorageKey: 'export_warning_showed',
  exportWarningStorageKey: 'export_warning',
  globalFilterStorageKey: 'global_filter',
  itemCategorySortPropertyStorageKeySuffix: '_sort_field',
  itemCategorySortOrderStorageKeySuffix: '_sort_order',
  itemsFilterAndSortCategoryStorageKey: 'items_filter_sort_category',
  itemsFilterStorageKey: 'items_filter',
  itemsSortPropertyStorageKey: 'items_sort_field',
  itemsSortOrderStorageKey: 'items_sort_order',
  languageStorageKey: 'language',
  version,
  versionStorageKey: 'version'
}

/**
 * Part of the website configuration that can be changed by getting updated values from the website configuration API.
 * Values set here are the default values, they are used while the website configuration API has not yet been called.
 * Then they are replaced by the values gotten from the API.
 */
const updatableWbsiteConfiguration = {
  bugReportUrl: import.meta.env.VITE_DISCORD_URL,
  cacheDuration: 3600,
  contactAddress: import.meta.env.VITE_CONTACT_ADDRESS,
  discordUrl: import.meta.env.VITE_BUG_REPORT_URL,
  endpointChangelog: 'data/changelog.json',
  endpointItems: 'data/items.json',
  endpointPresets: 'data/presets.json',
  endpointPrices: 'data/prices.json',
  endpointTarkovValues: 'data/tarkov-values.json',
  endpointWebsiteConfiguration: 'data/website-configuration.json',
  endpointUrlShortener: 'https://spoo.me/',
  fetchMaxTries: 6,
  fetchTimeout: 9,
  fetchWaitTimeBetweenRetries: 1,
  githubUrl: import.meta.env.VITE_GITHUB_URL,
  notificationErrorDuration: 10,
  notificationInformationDuration: 5,
  notificationSuccessDuration: 5,
  notificationWarningDuration: 10,
  postUpdatePeriod: false
}

/**
 * Configuration of the website.
 * Some default values are remplaced when after fetching the website configuration from the API.
 */
const configuration: IWebsiteConfiguration = {
  ...fixedConfiguration,
  ...updatableWbsiteConfiguration
}

export default configuration