import { computed, defineComponent, ref } from 'vue'
import Notification from '../notification/NotificationComponent.vue'
import Configuration from '../../../test-data/configuration.json'
import Changelog from '../changelog/ChangelogComponent.vue'

export default defineComponent({
  components: {
    Notification,
    Changelog
  },
  setup() {
    const contactAddress = Configuration.VITE_CONTACT_ADDRESS as string
    const discordLink = Configuration.VITE_DISCORD_LINK as string
    const githubAddress = Configuration.VITE_GITHUB_ADDRESS as string
    const reportBugAddress = Configuration.VITE_REPORT_BUG_ADDRESS as string

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
      isSanta,
      reportBugAddress
    }
  }
})