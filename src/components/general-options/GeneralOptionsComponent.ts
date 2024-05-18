import { PropType, computed, defineComponent, onMounted, ref } from 'vue'
import { IGeneralOption } from '../../models/utils/IGeneralOption'
import { IGeneralOptionsGroup } from '../../models/utils/IGeneralOptionsGroup'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import StringUtils from '../../utils/StringUtils'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    LanguageSelector
  },
  props: {
    parameters: {
      type: Array as PropType<IGeneralOptionsGroup[]>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)
    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const additionalDisplayOptions = computed(() => props.parameters?.filter(og => og.name === 'display-options').flatMap(og => og.options) ?? [])
    const additionalGeneralOptions = computed(() => props.parameters?.filter(og => og.name === 'general-options').flatMap(og => og.options) ?? [])
    const additionalsOptionGroups = computed(() => props.parameters?.filter(og => og.name !== 'display-options' && og.name !== 'general-options') ?? [])

    const allowCookies = ref(true)
    const isLoading = ref(true)

    onMounted(() => {
      isLoading.value = websiteConfigurationService.initializationState === ServiceInitializationState.initializing

      if (!isLoading.value) {
        onWebsiteConfigurationServiceInitialized()
      }
    })

    /**
     * Gets the CSS classes to apply to an option.
     */
    function getAdditionalOptionCssClasses(option: IGeneralOption) {
      let classes = 'sidebar-option'

      if (option.enabled != null && !option.enabled()) {
        classes += ' sidebar-option-disabled'
      } else {
        classes += ' sidebar-option-clickable'
      }

      return classes
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
      additionalDisplayOptions,
      additionalGeneralOptions,
      additionalsOptionGroups,
      allowCookies,
      getAdditionalOptionCssClasses,
      onAllowCookiesChanged,
      StringUtils,
      toggleAllowCookies
    }
  }
})