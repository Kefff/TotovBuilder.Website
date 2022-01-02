import i18n from './plugins/vueI18n'
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
import { ApiItemFetcherService } from './services/fetchers/ApiItemFetcherService'
import { LocalItemFetcherService } from './services/fetchers/LocalItemFetcherService'
import { AmmunitionReaderService } from './services/readers/AmmunitionReaderService'
import { ArmorModReaderService } from './services/readers/ArmorModReaderService'
import { ArmorReaderService } from './services/readers/ArmorReaderService'
import { ContainerReaderService } from './services/readers/ContainerReaderService'
import { EyewearReaderService } from './services/readers/EyewearReaderService'
import { GrenadeReaderService } from './services/readers/GrenadeReaderService'
import { HeadwearReaderService } from './services/readers/HeadwearReaderService'
import { ItemReaderService } from './services/readers/ItemReaderService'
import { MagazineReaderService } from './services/readers/MagazineReaderService'
import { MeleeWeaponReaderService } from './services/readers/MeleeWeaponReaderService'
import { ModdableReaderService } from './services/readers/ModdableReaderService'
import { ModReaderService } from './services/readers/ModReaderService'
import { RangedWeaponModReaderService } from './services/readers/RangedWeaponModReaderService'
import { RangedWeaponReaderService } from './services/readers/RangedWeaponReaderService'
import { VestReaderService } from './services/readers/VestReaderService'
import Services from './services/repository/Services'
import { InventorySlotPropertiesService } from './services/InventorySlotPropertiesService'
import { ExportService } from './services/ExportService'
import { ImportService } from './services/ImportService'
import { InventoryItemService } from './services/InventoryItemService'
import { MerchantFilterService } from './services/MerchantFilterService'
import { ModSlotComponentService } from './services/components/ModSlotComponentService'
import Configuration from '../test-data/configuration.json'
import { VersionService } from './services/VersionService'

/**
 * Configures all the services used in the application.
 */
export function configureServices(): void {
  Services.configure(ApiService)
  Services.configure(BuildPropertiesService)
  Services.configure(BuildService)
  Services.configure(CompatibilityService)
  Services.configure(ExportService)
  Services.configure(ImportService)
  Services.configure(InventoryItemService)
  Services.configure(InventorySlotPropertiesService)
  Services.configure(InventorySlotService)
  Services.configure(ItemPropertiesService)
  Services.configure(LogService)
  Services.configure(MerchantFilterService)
  Services.configure(NotificationService)
  Services.configure(VersionService)
  Services.configure(ItemService)

  // Fetchers
  switch (Configuration.VITE_ITEM_FETCHER as string) {
    case 'LocalItemFetcher': {
      Services.configure(LocalItemFetcherService, 'ItemFetcherService')
      break
    }
    case 'ApiItemFetcher': {
      Services.configure(ApiItemFetcherService, 'ItemFetcherService')
      break
    }
    default: {
      throw i18n.t('message.invalidItemFetcherName', { name: Configuration.VITE_ITEM_FETCHER as string })
    }
  }

  // Readers
  Services.configure(AmmunitionReaderService)
  Services.configure(ArmorModReaderService)
  Services.configure(ArmorReaderService)
  Services.configure(ContainerReaderService)
  Services.configure(EyewearReaderService)
  Services.configure(GrenadeReaderService)
  Services.configure(HeadwearReaderService)
  Services.configure(ItemReaderService)
  Services.configure(MagazineReaderService)
  Services.configure(MeleeWeaponReaderService)
  Services.configure(ModdableReaderService)
  Services.configure(ModReaderService)
  Services.configure(RangedWeaponModReaderService)
  Services.configure(RangedWeaponReaderService)
  Services.configure(VestReaderService)

  // Components
  Services.configure(BuildComponentService)
  Services.configure(InventorySlotComponentService)
  Services.configure(ItemContentComponentService)
  Services.configure(MagazineStatsComponentService)
  Services.configure(ModSlotComponentService)

  // Getting the ItemService to force its instanciation in order to start fetching items data as soon as possible
  Services.get(ItemService)
}