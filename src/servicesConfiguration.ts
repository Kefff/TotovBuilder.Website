import { ApiService } from './services/ApiService'
import { BuildComponentService } from './services/components/BuildComponentService'
import { BuildPropertiesService } from './services/BuildPropertiesService'
import { BuildService } from './services/BuildService'
import { BuildsImportComponentService } from './services/components/BuildsImportComponentService'
import { CompatibilityService } from './services/compatibility/CompatibilityService'
import { ExportService } from './services/ExportService'
import { GeneralOptionsService } from './services/GeneralOptionsService'
import { GlobalFilterService } from './services/GlobalFilterService'
import { ImportService } from './services/ImportService'
import { InventoryItemService } from './services/InventoryItemService'
import { InventorySlotComponentService } from './services/components/InventorySlotComponentService'
import { InventorySlotPropertiesService } from './services/InventorySlotPropertiesService'
import { InventorySlotService } from './services/InventorySlotService'
import { ItemContentComponentService } from './services/components/ItemContentComponentService'
import { ItemFetcherService } from './services/ItemFetcherService'
import { ItemPropertiesService } from './services/ItemPropertiesService'
import { ItemService } from './services/ItemService'
import { LogService } from './services/LogService'
import { MagazineStatsComponentService } from './services/components/stats/MagazineStatsComponentService'
import { ModSlotComponentService } from './services/components/ModSlotComponentService'
import { NotificationService } from './services/NotificationService'
import { PresetService } from './services/PresetService'
import { TarkovValuesService } from './services/TarkovValuesService'
import { VersionService } from './services/VersionService'
import { WebsiteConfigurationService } from './services/WebsiteConfigurationService'
import Services from './services/repository/Services'

/**
 * Configures all the services used in the application.
 */
export async function configureServices(): Promise<void> {
  Services.configure(ApiService)
  Services.configure(BuildPropertiesService)
  Services.configure(BuildService)
  Services.configure(CompatibilityService)
  Services.configure(ExportService)
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
  Services.configure(TarkovValuesService)
  Services.configure(VersionService)
  Services.configure(WebsiteConfigurationService)

  // Components
  Services.configure(BuildComponentService)
  Services.configure(BuildsImportComponentService)
  Services.configure(InventorySlotComponentService)
  Services.configure(ItemContentComponentService)
  Services.configure(MagazineStatsComponentService)
  Services.configure(ModSlotComponentService)

  // Initialization of immediatly required values
  const versionService = Services.get(VersionService)

  await Services.get(WebsiteConfigurationService).initialize()
  await Services.get(TarkovValuesService).initialize()
  await versionService.initialize()

  Services.setInitializationFinished()

  // Initialization of values that are not immediatly required and take time to load
  Services.get(ItemService).initialize()
}