import { defineComponent, inject, nextTick, PropType, ref, Ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import Services from '../../services/repository/Services'
import { BuildService } from '../../services/BuildService'
import InputTextField from '../input-text-field/InputTextFieldComponent.vue'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { useI18n } from 'vue-i18n'
import { LogService } from '../../services/LogService'

export default defineComponent({
  components: {
    InputTextField
  },
  props: {
    build: {
      type: Object as PropType<IBuild>,
      required: true
    },
    hasLoadingError: {
      type: Boolean,
      required: true
    }
  },
  setup: (props) => {
    const editing = inject<Ref<boolean>>('editing')

    const i18n = useI18n()

    const isSharing = ref(false)
    let shareLinkInternal: string | undefined = undefined
    const shareLink = ref<string>()

    /**
     * Closes he link sharing dialog.
     */
    function closeSharingDialog() {
      isSharing.value = false
      shareLinkInternal = undefined
      shareLink.value = undefined
    }

    /**
     * Copies the share link to the clipboard.
     */
    function copyLink() {
      if (shareLinkInternal == null) {
        return
      }

      navigator.clipboard.writeText(shareLinkInternal)
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
     * Cancels changes made to the share link.
     */
    function onUpdateShareLink() {
      nextTick(() => shareLink.value = shareLinkInternal) // nextTick() required here otherwise the InputText doesn't update properly
    }

    /**
     * Generates a URL to share the build.
     */
    async function share() {
      const sharedLinkResult = await Services.get(BuildService).toSharableURL(props.build)

      if (!sharedLinkResult.success) {
        Services.get(NotificationService).notify(NotificationType.warning, sharedLinkResult.failureMessage)

        return
      }

      isSharing.value = true
      shareLinkInternal = sharedLinkResult.value
      shareLink.value = shareLinkInternal
    }

    return {
      closeSharingDialog,
      copyLink,
      editing,
      isSharing,
      onUpdateShareLink,
      share,
      shareLink
    }
  }
})