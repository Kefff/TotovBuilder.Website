import { computed, defineComponent, ref, watch } from 'vue'
import { IChangelog } from '../../models/utils/IChangelog'
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

    const currentVersion = versionService.currentVersion
    const hasNewVersion = ref(versionService.hasNewVersion)
    const changelogs = ref<IChangelog[]>([])

    const hasChangelogDisplayed = computed({
      get: () => props.modelValue,
      set: (value: boolean) => emit('update:modelValue', value)
    })

    watch(() => props.modelValue, () => {
      if (props.modelValue) {
        showChangelog()
      }
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
      versionService.hasNewVersion = false
    }

    /**
     * Shows the changelog.
     */
    function showChangelog() {
      hasChangelogDisplayed.value = true
      changelogs.value = versionService.getChangelogs()
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
