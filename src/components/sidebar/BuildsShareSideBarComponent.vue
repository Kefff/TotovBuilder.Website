<template>
  <div
    v-if="shareLinks != null"
    class="sidebar-option"
  >
    <div class="share-build-sidebar-version">
      <div class="share-build-sidebar-version-caption">
        {{ $t('caption.interactiveVersion') }}
      </div>
      <div class="share-build-sidebar-link">
        <InputTextField
          :value="shareLinks"
          :caption="$t('caption.link')"
          caption-mode="placeholder"
          :read-only="true"
          class="share-build-sidebar-link-input"
        />
        <Button @click="copyLink()">
          <font-awesome-icon
            icon="copy"
            class="icon-before-text"
          />
          <span>{{ $t('caption.copyElement') }}</span>
        </Button>
      </div>
      <div
        v-if="shareLinks != null"
        class="sidebar-option-description"
      >
        <div class="sidebar-option-icon">
          <font-awesome-icon icon="info-circle" />
        </div>
        <span>
          {{ $t('message.shareBuildExplanation') }}
        </span>
      </div>
    </div>
  </div>
  <div class="sidebar-title" />
  <div
    v-if="buildsAsText != null"
    class="sidebar-option"
  >
    <div class="share-build-sidebar-version">
      <div class="share-build-sidebar-version-caption">
        {{ $t('caption.textVersion') }}
      </div>
      <div class="share-build-sidebar-text-options">
        <LanguageSelector
          v-model:language="language"
          class="share-build-sidebar-text-options-language-selector"
          @update:language="getBuildsAsText()"
        />
        <Button @click="copyText()">
          <font-awesome-icon
            icon="copy"
            class="icon-before-text"
          />
          <span>{{ $t('caption.copyElement') }}</span>
        </Button>
      </div>
      <TextArea
        v-model="buildsAsText"
        class="share-build-sidebar-text"
        rows="7"
        auto-resize
      />
    </div>
  </div>
</template>










<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { BuildsToTextType } from '../../models/utils/IBuildsToTextOptions'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildsShareSideBarParameters } from '../../models/utils/IGlobalSidebarOptions'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import InputTextField from '../InputTextFieldComponent.vue'
import LanguageSelector from '../LanguageSelectorComponent.vue'

const props = defineProps<{ parameters: BuildsShareSideBarParameters }>()

const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _logService = Services.get(LogService)
const _notificationService = Services.get(NotificationService)

let buildsToShare: IBuild[] = []

const buildsAsText = ref<string>()
const availableBuildSummaries = ref<IBuildSummary[]>([])
const includePrices = ref(false)
const language = ref<string>(vueI18n.locale.value)
const shareLinks = ref<string>()
const selectedBuildSummaries = ref<IBuildSummary[]>([])
const textType = ref<BuildsToTextType>()


onMounted(() => initialize())

/**
 * Copies the share link to the clipboard.
 */
function copyLink() {
  if (shareLinks.value == null) {
    return
  }

  navigator.clipboard.writeText(shareLinks.value)
    .then(() => {
      _notificationService.notify(NotificationType.information, vueI18n.t('message.shareLinkCopied'))
    })
    .catch(() => {
      _logService.logError('message.shareLinkCopyError')
      _notificationService.notify(NotificationType.error, vueI18n.t('message.shareLinkCopyError'))
    })
}

/**
 * Copies the build text to the clipboard.
 */
function copyText() {
  if (buildsAsText.value == null) {
    return
  }

  navigator.clipboard.writeText(buildsAsText.value)
    .then(() => {
      _notificationService.notify(NotificationType.information, vueI18n.t('message.buildTextCopied'))
    })
    .catch(() => {
      _logService.logError('message.shareLinkCopyError')
      _notificationService.notify(NotificationType.error, vueI18n.t('message.buildTextCopyError'))
    })
}

/**
 * Gets a URL to share the build.
 */
async function getShareLinks() {
  shareLinks.value = await _buildService.toSharableURL(buildsToShare)
}

/**
 * Gets the build as a text.
 */
async function getBuildsAsText() {
  buildsAsText.value = await _buildPropertiesService.toText(buildsToShare, textType.value, language.value, includePrices.value)
}

/**
 * Initializes the component.
 */
function initialize() {
  availableBuildSummaries.value = props.parameters.buildSummaries ?? []
  buildsToShare = props.parameters.buildsToShare ?? []

  if (buildsToShare.length > 0) {
    getShareLinks()
    getBuildsAsText()
  }
}

</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.share-build-sidebar-link {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.share-build-sidebar-link-input {
  max-width: 20rem;
  min-width: 3.25rem;
  width: 100%;
}

.share-build-sidebar-name {
  margin-left: 2.5rem;
}

.share-build-sidebar-text {
  min-width: 20rem;
  min-height: 8.25rem;
  height: 100%;
}

.share-build-sidebar-text-options {
  display: flex;
  gap: 0.5rem;
  width: 100%
}

.share-build-sidebar-text-options-language-selector {
  max-width: 20rem;
  width: 100%;
}

.share-build-sidebar-version {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.share-build-sidebar-version-caption {
  font-size: 1.25rem;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .share-build-sidebar-link > .p-button > .icon-before-text {
    margin-right: 0;
  }

  .share-build-sidebar-link > .p-button > span {
    display: none;
  }

  .share-build-sidebar-text-options > .p-button > .icon-before-text {
    margin-right: 0;
  }

  .share-build-sidebar-text-options > .p-button > span {
    display: none;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>