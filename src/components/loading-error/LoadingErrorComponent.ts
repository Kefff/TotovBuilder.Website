import { defineComponent } from 'vue'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Services from '../../services/repository/Services'

export default defineComponent({
  setup: () => {
    const hasLoadingError = true

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