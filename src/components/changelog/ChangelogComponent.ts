import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { IChangelogEntry } from '../../models/configuration/IChangelogEntry'
import Services from '../../services/repository/Services'
import { VersionService } from '../../services/VersionService'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const versionService = Services.get(VersionService)

    const changelogs = ref<IChangelogEntry[]>([])
    const currentVersion = ref('1.0.0')
    const hasNewVersion = ref(false)

    const hasChangelogDisplayed = computed({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        showChangelog()
      }
    })

    onMounted(() => {
      versionService.getVersion().then((v) => currentVersion.value = v)
      versionService.checkHasNewVersion().then((hnv) => hasNewVersion.value = hnv)
    })

    /**
     * Closes the changelog dialog.
     */
    function closeChangelog() {
      hasChangelogDisplayed.value = false
    }

    /**
     * Dismisses the new version notification.
     */
    function dismissNotification() {
      hasNewVersion.value = false
      versionService.dismissNewVersion()
    }

    /**
     * Shows the changelog.
     */
    async function showChangelog() {
      hasChangelogDisplayed.value = true
      changelogs.value = await versionService.getChangelog()
    }

    return {
      changelogs,
      closeChangelog,
      currentVersion,
      dismissNotification,
      hasChangelogDisplayed,
      hasNewVersion,
      showChangelog
    }
  }
})
