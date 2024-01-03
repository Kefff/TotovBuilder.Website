import { computed, defineComponent, onMounted, ref } from 'vue'
import Notification from '../notification/NotificationComponent.vue'
import Changelog from '../changelog/ChangelogComponent.vue'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import LanguageUtils from '../../utils/LanguageUtils'
import Images from '../../images'

export default defineComponent({
  components: {
    Notification,
    Changelog
  },
  setup() {
    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

    const bugReportUrl = ref<string>()
    const contactAddress = ref<string>()
    const discordUrl = ref<string>()
    const githubUrl = ref<string>()
    const hasChangelogDisplayed = ref(false)
    const isLoading = ref(true)

    const isSanta = computed(() => {
      const date = new Date()
      const santaMinDate = new Date(date.getFullYear(), 11, 21).getTime()
      const santaMaxDate = new Date(date.getFullYear(), 11, 29, 23, 59, 59).getTime()

      return date.getTime() >= santaMinDate && date.getTime() <= santaMaxDate
    })

    const copyrightYear = computed(() => {
      const year = new Date().getFullYear()
      let text = '2021'

      if (year > 2021) {
        text += '-' + year
      }

      return text
    })

    onMounted(() => setLanguage())

    function displayChangelog() {
      hasChangelogDisplayed.value = true
    }

    function onWebsiteConfigurationServiceInitialized() {
      bugReportUrl.value = websiteConfigurationService.configuration.bugReportUrl
      contactAddress.value = websiteConfigurationService.configuration.contactAddress
      discordUrl.value = websiteConfigurationService.configuration.discordUrl
      githubUrl.value = websiteConfigurationService.configuration.githubUrl

      isLoading.value = false
    }

    /**
     * Sets the language.
     */
    function setLanguage() {
      const language = localStorage.getItem(Services.get(WebsiteConfigurationService).configuration.languageStorageKey) ?? 'en'
      LanguageUtils.setLanguage(language)
    }

    return {
      bugReportUrl,
      contactAddress,
      copyrightYear,
      discordUrl,
      displayChangelog,
      githubUrl,
      hasChangelogDisplayed,
      Images,
      isLoading,
      isSanta
    }
  }
})