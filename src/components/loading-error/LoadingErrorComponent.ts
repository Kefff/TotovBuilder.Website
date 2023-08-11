import { computed, defineComponent, onMounted } from 'vue'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'
import { ItemService } from '../../services/ItemService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import vueI18n from '../../plugins/vueI18n'

export default defineComponent({
  props: {
    hasItemsLoadingError: {
      type: Boolean,
      required: false,
      default: false
    },
    hasWebsiteConfigurationLoadingError: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: [
    'update:hasItemsLoadingError',
    'update:hasWebsiteConfigurationLoadingError'
  ],
  setup: (props, { emit }) => {
    const itemService = Services.get(ItemService)
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServiceInitialized)
    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const hasLoadingError = computed(() => {
      if (props.hasItemsLoadingError || props.hasWebsiteConfigurationLoadingError) {
        Services.get(NotificationService).notify(NotificationType.error, vueI18n.t('message.websiteLoadingError'), true)

        return true
      }

      return false
    })

    onMounted(() => {
      onWebsiteConfigurationServiceInitialized()
      onItemServiceInitialized()
    })

    /**
     * Checks whether an item loading error has occured and emits to its parent component.
     */
    function onItemServiceInitialized() {
      const hasError = itemService.initializationState === ServiceInitializationState.error
      emit('update:hasItemsLoadingError', hasError)
    }

    /**
     * Checks whether a website configuration loading error has occured and emits to its parent component.
     */
    function onWebsiteConfigurationServiceInitialized() {
      const hasError = websiteConfigurationService.initializationState === ServiceInitializationState.error
      emit('update:hasWebsiteConfigurationLoadingError', hasError)
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
      reload,
      signal
    }
  }
})