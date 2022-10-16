import { computed, defineComponent, ref } from 'vue'
import Notification from '../notification/NotificationComponent.vue'
import Changelog from '../changelog/ChangelogComponent.vue'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import Loading from '../loading/LoadingComponent.vue'

export default defineComponent({
  components: {
    Loading,
    Notification,
    Changelog
  },
  setup() {
    const isLoading = ref(true)
    Services.emitter.once('initialized', () => isLoading.value = false)

    const websiteConfigurationService = Services.get(WebsiteConfigurationService)

    const contactAddress = computed(() => websiteConfigurationService.configuration.contactAddress)
    const discordLink = computed(() => websiteConfigurationService.configuration.discordUrl)
    const githubAddress = computed(() => websiteConfigurationService.configuration.githubUrl)
    const reportBugAddress = computed(() => websiteConfigurationService.configuration.bugReportUrl)

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

    const hasChangelogDisplayed = ref(false)

    function displayChangelog() {
      hasChangelogDisplayed.value = true
    }

    return {
      contactAddress,
      copyrightYear,
      discordLink,
      displayChangelog,
      githubAddress,
      hasChangelogDisplayed,
      isLoading,
      isSanta,
      reportBugAddress
    }
  }
})