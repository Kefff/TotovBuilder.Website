import { BuildPropertiesService } from './services/BuildPropertiesService'
import { BuildService } from './services/BuildService'
import { ExportService } from './services/ExportService'
import { FetchService } from './services/FetchService'
import { GeneralOptionsService } from './services/GeneralOptionsService'
import { GlobalFilterService } from './services/GlobalFilterService'
import { ImportService } from './services/ImportService'
import { InventoryItemService } from './services/InventoryItemService'
import { InventorySlotPropertiesService } from './services/InventorySlotPropertiesService'
import { InventorySlotService } from './services/InventorySlotService'
import { ItemFetcherService } from './services/ItemFetcherService'
import { ItemPropertiesService } from './services/ItemPropertiesService'
import { ItemService } from './services/ItemService'
import { LogService } from './services/LogService'
import { NotificationService } from './services/NotificationService'
import { PresetService } from './services/PresetService'
import { ReductionService } from './services/ReductionService'
import { TarkovValuesService } from './services/TarkovValuesService'
import { VersionService } from './services/VersionService'
import { WebsiteConfigurationService } from './services/WebsiteConfigurationService'
import { CompatibilityService } from './services/compatibility/CompatibilityService'
import { BuildComponentService } from './services/components/BuildComponentService'
import { BuildsImportComponentService } from './services/components/BuildsImportComponentService'
import { GlobalSidebarComponentService } from './services/components/GlobalSidebarComponentService'
import { InventorySlotComponentService } from './services/components/InventorySlotComponentService'
import { ItemContentComponentService } from './services/components/ItemContentComponentService'
import { ModSlotComponentService } from './services/components/ModSlotComponentService'
import { MagazineStatsComponentService } from './services/components/stats/MagazineStatsComponentService'
import { ServiceInitializationState } from './services/repository/ServiceInitializationState'
import Services from './services/repository/Services'

/**
 * Configures all the services used in the application.
 */
export function configureServices() {
  Services.configure(BuildPropertiesService)
  Services.configure(BuildService)
  Services.configure(CompatibilityService)
  Services.configure(ExportService)
  Services.configure(FetchService)
  Services.configure(GeneralOptionsService)
  Services.configure(GlobalFilterService)
  Services.configure(ImportService)
  Services.configure(InventoryItemService)
  Services.configure(InventorySlotPropertiesService)
  Services.configure(InventorySlotService)
  Services.configure(ItemFetcherService)
  Services.configure(ItemPropertiesService)
  Services.configure(ItemService)
  Services.configure(LogService)
  Services.configure(NotificationService)
  Services.configure(PresetService)
  Services.configure(ReductionService)
  Services.configure(TarkovValuesService)
  Services.configure(VersionService)
  Services.configure(WebsiteConfigurationService)

  // Components
  Services.configure(BuildComponentService)
  Services.configure(BuildsImportComponentService)
  Services.configure(GlobalSidebarComponentService)
  Services.configure(InventorySlotComponentService)
  Services.configure(ItemContentComponentService)
  Services.configure(MagazineStatsComponentService)
  Services.configure(ModSlotComponentService)

  initialize()
}

async function initialize() {
  // Initialization of immediatly required values
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)
  const websiteConfigurationServiceInitialized = await websiteConfigurationService.initialize()

  if (!websiteConfigurationServiceInitialized) {
    websiteConfigurationService.initializationState = ServiceInitializationState.error

    return
  }

  const tarkovValuesServiceInitialized = await Services.get(TarkovValuesService).initialize()

  if (!tarkovValuesServiceInitialized) {
    websiteConfigurationService.initializationState = ServiceInitializationState.error

    return
  }

  websiteConfigurationService.initializationState = ServiceInitializationState.initialized

  // Initialization of values that are not immediatly required and take time to load
  Services.get(ItemService).initialize()
}