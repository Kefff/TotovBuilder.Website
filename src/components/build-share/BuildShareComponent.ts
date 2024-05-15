import { defineComponent, inject, PropType, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IBuild } from '../../models/build/IBuild'
import { BuildService } from '../../services/BuildService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import InputTextField from '../input-text-field/InputTextFieldComponent.vue'

export default defineComponent({
  components: {
    InputTextField
  },
  props: {
    build: {
      type: Object as PropType<IBuild>,
      required: true
    }
  },
  setup: (props) => {
    const editing = inject<Ref<boolean>>('editing')

    const i18n = useI18n()

    const isSharing = ref(false)
    const shareLink = ref<string>()

    /**
     * Closes he link sharing dialog.
     */
    function closeSharingDialog() {
      isSharing.value = false
      shareLink.value = undefined
    }

    /**
     * Copies the share link to the clipboard.
     */
    function copyLink() {
      if (shareLink.value == null) {
        return
      }

      navigator.clipboard.writeText(shareLink.value)
        .then(() => {
          Services.get(NotificationService).notify(NotificationType.information, i18n.t('message.shareLinkCopied'))
          closeSharingDialog()
        })
        .catch(() => {
          Services.get(LogService).logError('message.shareLinkCopyError')
          Services.get(NotificationService).notify(NotificationType.error, i18n.t('message.shareLinkCopyError'))
        })
    }

    /**
     * Generates a URL to share the build.
     */
    async function share() {
      shareLink.value = await Services.get(BuildService).toSharableURL(props.build)

      if (shareLink.value != null) {
        // Only displaying the share modal when a URL has successfuly been generated
        isSharing.value = true
      }

    }

    return {
      closeSharingDialog,
      copyLink,
      editing,
      isSharing,
      share,
      shareLink
    }
  }
})