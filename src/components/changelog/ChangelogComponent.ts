import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'
import vueI18n from '../../plugins/vueI18n'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { VersionService } from '../../services/VersionService'
import Services from '../../services/repository/Services'
import Loading from '../loading/LoadingComponent.vue'

export default defineComponent({
  components: {
    Loading
  },
  props: {
    hasChangelogDisplayed: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:hasChangelogDisplayed'],
  setup(props, { emit }) {
    const versionService = Services.get(VersionService)

    const changelogs = ref<IChangelogEntry[]>([])
    const hasNewVersion = ref(false)
    const isLoading = ref(true)
    const version = ref('1.0.0')

    const hasChangelogDisplayedInternal = computed({
      get: () => props.hasChangelogDisplayed,
      set: (value: boolean) => emit('update:hasChangelogDisplayed', value)
    })

    watch(() => props.hasChangelogDisplayed, () => {
      if (props.hasChangelogDisplayed) {
        showChangelog()
      }
    })

    onMounted(() => {
      versionService.getVersion().then(v => version.value = v)
      versionService.checkHasNewVersion().then(hnv => {
        hasNewVersion.value = hnv
        displayNewVersionNotification()
      })
    })

    /**
     * Displays the new version notification if needed.
     */
    function displayNewVersionNotification() {
      if (hasNewVersion.value) {
        Services.get(NotificationService).notify(
          NotificationType.information,
          vueI18n.t('message.newVersion', { newVersion: version.value }),
          0,
          [
            {
              action: () => showChangelog(),
              caption: vueI18n.t('caption.seeChanges'),
              icon: undefined,
              name: 'seeChanges',
              type: NotificationType.success
            }
          ],
          true)
      }
    }

    /**
     * Shows the changelog.
     */
    async function showChangelog() {
      hasChangelogDisplayedInternal.value = true

      isLoading.value = true
      const fetchedChangelogs = await versionService.getChangelog()
      isLoading.value = false

      if (fetchedChangelogs == null) {
        // TODO: AFFICHER UNE ERREUR QUAND LES CHANGELOGS NE SONT PAS CHARES

        return
      }

      changelogs.value = fetchedChangelogs
    }

    return {
      changelogs,
      hasChangelogDisplayedInternal,
      isLoading,
      showChangelog
    }
  }
})
