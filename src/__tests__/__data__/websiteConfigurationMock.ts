import { IWebsiteConfiguration } from '../../models/configuration/IWebsiteConfiguration'

const websiteConfiguration: IWebsiteConfiguration = {
  allowCookiesStorageKey: 'allow_cookies',
  bugReportUrl: 'https://discord.gg/bugreport',
  buildSharingUrl: 's/',
  buildsSortFieldStorageKey: 'builds_sort_field',
  buildsSortOrderStorageKey: 'builds_sort_order',
  buildStorageKeyPrefix: 'build_',
  cacheDuration: 3600,
  contactAddress: 'contact@address.com',
  discordUrl: 'https://discord.gg/server',
  endpointChangelog: 'data/changelog.json',
  endpointItemCategories: 'data/item-categories.json',
  endpointItems: 'data/items.json',
  endpointPresets: 'data/presets.json',
  endpointPrices: 'data/prices.json',
  endpointTarkovValues: 'data/tarkov-values.json',
  exportFileExtension: '.ttb',
  exportFileNamePrefix: 'TotovBuilder',
  exportWarningShowedStorageKey: 'export_warning',
  fetchMaxTries: 3,
  fetchTimeout: 30,
  fetchWaitTimeBetweenRetries: 2,
  githubUrl: 'https://github.com/User/Reposiory',
  globalFilterStorageKey: 'global_filter',
  languageStorageKey: 'language',
  notificationErrorDuration: 10,
  notificationInformationDuration: 5,
  notificationSuccessDuration: 5,
  notificationWarningDuration: 10,
  postUpdatePeriod: false,
  version: '1.6.0',
  versionStorageKey: 'version'
}

export default websiteConfiguration