import { defineComponent, onMounted, ref, watch } from 'vue'
import Services from '../../services/repository/Services'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import StringUtils from '../../utils/StringUtils'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    LanguageSelector
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:visible'],
  setup: (props, { emit }) => {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const sidebarVisible = ref(false)
    const allowCookies = ref(true)
    const isLoading = ref(true)

    watch(() => props.visible, newValue => sidebarVisible.value = newValue)

    watch(() => sidebarVisible.value, newValue => emit('update:visible', newValue))

    onMounted(() => {
      isLoading.value = websiteConfigurationService.initializationState === ServiceInitializationState.initializing

      if (!isLoading.value) {
        onWebsiteConfigurationServiceInitialized()
      }
    })

    /**
     * Displays the side bar.
     */
    function display() {
      sidebarVisible.value = true
      emit('update:visible', sidebarVisible.value)
    }

    /**
     * Sets the allow cookie indicator.
     */
    function onAllowCookiesChanged() {
      Services.get(GeneralOptionsService).setAllowCookiesIndicator(allowCookies.value)
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
      display,
      onAllowCookiesChanged,
      sidebarVisible,
      StringUtils,
      toggleAllowCookies
    }
  }
})