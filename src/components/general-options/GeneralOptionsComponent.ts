import { defineComponent, onMounted, ref } from 'vue'
import Services from '../../services/repository/Services'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import StringUtils from '../../utils/StringUtils'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'

export default defineComponent({
  setup: () => {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const allowCookies = ref(true)
    const isLoading = ref(true)
    const sidebarVisible = ref(false)

    onMounted(() => {
      isLoading.value = websiteConfigurationService.initializationState === ServiceInitializationState.initializing

      if (!isLoading.value) {
        onWebsiteConfigurationServiceInitialized()
      }
    })

    /**
     * Sets the allow cookie indicator.
     */
    function onAllowCookiesChanged() {
      Services.get(GeneralOptionsService).setAllowCookiesIndicator(allowCookies.value)
      sidebarVisible.value = false
    }

    /**
     * Gets the allow cookie indicator.
     */
    function onWebsiteConfigurationServiceInitialized() {
      isLoading.value = false
      allowCookies.value = Services.get(GeneralOptionsService).getAllowCookiesIndicator()
    }

    /**
     * Toggles a the allow cookes indicator.
     * @param filter - Filter.
     */
    function toggleAllowCookies() {
      allowCookies.value = !allowCookies.value
      onAllowCookiesChanged()
    }

    return {
      allowCookies,
      onAllowCookiesChanged,
      sidebarVisible,
      StringUtils,
      toggleAllowCookies
    }
  }
})