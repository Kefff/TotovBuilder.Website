import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { GeneralOptionsComponentService } from '../../services/components/GeneralOptionsComponentService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import StringUtils from '../../utils/StringUtils'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    LanguageSelector
  },
  setup: () => {
    const generalOptionsComponentService = Services.get(GeneralOptionsComponentService)

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const allowCookies = ref(true)
    const isLoading = ref(true)
    const visible = ref(false)

    onMounted(() => {
      generalOptionsComponentService.emitter.on(GeneralOptionsComponentService.openGeneralOptionsEvent, onOpenGeneralOptions)

      isLoading.value = websiteConfigurationService.initializationState === ServiceInitializationState.initializing

      if (!isLoading.value) {
        onWebsiteConfigurationServiceInitialized()
      }
    })

    onUnmounted(() => {
      generalOptionsComponentService.emitter.off(GeneralOptionsComponentService.openGeneralOptionsEvent, onOpenGeneralOptions)
    })

    /**
     * Sets the allow cookie indicator.
     */
    function onAllowCookiesChanged() {
      Services.get(GeneralOptionsService).setAllowCookiesIndicator(allowCookies.value)
    }

    /**
     * Opens the general options.
     */
    function onOpenGeneralOptions() {
      visible.value = true
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
      StringUtils,
      toggleAllowCookies,
      visible
    }
  }
})