import { computed, defineComponent, onMounted, ref } from 'vue'
import Images from '../../images'
import { ItemService } from '../../services/ItemService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'

export default defineComponent({
  setup: () => {
    const itemService = Services.get(ItemService)
    itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServiceInitialized)

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const hasItemError = ref(false)
    const hasWebsiteConfigurationError = ref(false)

    const hasLoadingError = computed(() => hasItemError.value || hasWebsiteConfigurationError.value)

    onMounted(() => {
      onItemServiceInitialized()
      onWebsiteConfigurationServiceInitialized()
    })

    /**
     * Checks whether an item loading error has occured and emits to its parent component.
     */
    function onItemServiceInitialized() {
      hasItemError.value = itemService.initializationState === ServiceInitializationState.error
    }

    /**
     * Checks whether a website configuration loading error has occured and emits to its parent component.
     */
    function onWebsiteConfigurationServiceInitialized() {
      hasWebsiteConfigurationError.value = websiteConfigurationService.initializationState === ServiceInitializationState.error
    }

    /**
     * Reloads the page.
     */
    function reload() {
      location.reload()
    }

    /**
     * Opens the report a bug link.
     */
    function signal() {
      const url = Services.get(WebsiteConfigurationService).configuration.bugReportUrl
      window.open(url)
    }

    return {
      hasLoadingError,
      Images,
      reload,
      signal
    }
  }
})