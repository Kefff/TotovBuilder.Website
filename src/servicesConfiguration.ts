import { ItemService } from './services/ItemService'
import { TarkovValuesService } from './services/TarkovValuesService'
import { WebsiteConfigurationService } from './services/WebsiteConfigurationService'
import { ServiceInitializationState } from './services/repository/ServiceInitializationState'
import Services from './services/repository/Services'

/**
 * Initializes the first services required by the application.
 */
export async function initializeServices(): Promise<void> {
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
  await Services.get(ItemService).initialize()
}