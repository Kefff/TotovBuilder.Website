import { ApiService } from './services/ApiService'
import { BuildService } from './services/BuildService'
import { BuildPropertiesService } from './services/BuildPropertiesService'
import { CompatibilityService } from './services/compatibility/CompatibilityService'
import { BuildComponentService } from './services/components/BuildComponentService'
import { InventorySlotComponentService } from './services/components/InventorySlotComponentService'
import { ItemContentComponentService } from './services/components/ItemContentComponentService'
import { MagazineStatsComponentService } from './services/components/stats/MagazineStatsComponentService'
import { InventorySlotService } from './services/InventorySlotService'
import { ItemService } from './services/ItemService'
import { ItemPropertiesService } from './services/ItemPropertiesService'
import { LogService } from './services/LogService'
import { NotificationService } from './services/NotificationService'
import { ItemFetcherService } from './services/ItemFetcherService'
import Services from './services/repository/Services'
import { InventorySlotPropertiesService } from './services/InventorySlotPropertiesService'
import { ExportService } from './services/ExportService'
import { ImportService } from './services/ImportService'
import { InventoryItemService } from './services/InventoryItemService'
import { MerchantFilterService } from './services/MerchantFilterService'
import { ModSlotComponentService } from './services/components/ModSlotComponentService'
import { VersionService } from './services/VersionService'
import { WebsiteConfigurationService } from './services/WebsiteConfigurationService'
import { TarkovValuesService } from './services/TarkovValuesService'
import { PresetService } from './services/PresetService'

/**
 * Configures all the services used in the application.
 */
export async function configureServices(): Promise<void> {
  Services.configure(ApiService)
  Services.configure(BuildPropertiesService)
  Services.configure(BuildService)
  Services.configure(CompatibilityService)
  Services.configure(ExportService)
  Services.configure(ImportService)
  Services.configure(InventoryItemService)
  Services.configure(InventorySlotPropertiesService)
  Services.configure(InventorySlotService)
  Services.configure(ItemFetcherService)
  Services.configure(ItemPropertiesService)
  Services.configure(ItemService)
  Services.configure(LogService)
  Services.configure(MerchantFilterService)
  Services.configure(NotificationService)
  Services.configure(PresetService)
  Services.configure(VersionService)
  Services.configure(TarkovValuesService)
  Services.configure(WebsiteConfigurationService)

  // Components
  Services.configure(BuildComponentService)
  Services.configure(InventorySlotComponentService)
  Services.configure(ItemContentComponentService)
  Services.configure(MagazineStatsComponentService)
  Services.configure(ModSlotComponentService)

  // Initialization of immediatly required values
  await Services.get(WebsiteConfigurationService).initialize()
  await Services.get(TarkovValuesService).initialize()

  Services.emitter.emit('initialized')

  // Initialization of values that are not immediatly required and take time to load
  Services.get(ItemService).initialize()
}