<template>
  <div class="builds-share-sidebar">
    <div
      v-if="buildsToShare.length === 0"
      class="sidebar-option builds-share-sidebar-selection"
    >
      <div>
        <Toolbar
          ref="buildsExportToolbar"
          :buttons="toolbarButtons"
          style="margin-top: 1px;"
        />
        <BuildsList
          v-model:selected-builds="selectedBuilds"
          :build-summaries="availableBuilds"
          :element-to-stick-to="toolbarContainer"
          :show-not-exported="false"
          mode="export"
        />
      </div>
    </div>
    <div v-else>
      <div class="sidebar-option builds-share-sidebar-options">
        <div
          v-if="(parameters.buildSummaries?.length ?? 0) > 0"
          class="builds-share-sidebar-option"
        >
          <Button
            class="p-button-text button-discreet builds-share-sidebar-back-button"
            @click="goBackToBuildsSelection()"
          >
            <font-awesome-icon
              icon="arrow-left"
              class="icon-before-text"
            />
            <span>{{ $t('caption.backToBuildsSelection') }}</span>
          </Button>
        </div>
        <div class="builds-share-sidebar-option">
          <Dropdown
            v-model="typeOption"
            :options="typeOptions"
            data-key="caption"
            :placeholder="$t('caption.selectFormat')"
            class="builds-share-sidebar-type"
            @update:model-value="getText()"
          >
            <template #option="slotProps">
              <div class="builds-share-sidebar-type-option">
                <div class="builds-share-sidebar-type-option-icon">
                  <font-awesome-icon
                    :class="slotProps.option.iconCssClass"
                    :icon="slotProps.option.icon"
                  />
                </div>
                <span>{{ $t(slotProps.option.caption) }}</span>
              </div>
            </template>
            <template #value="slotProps">
              <div class="builds-share-sidebar-value">
                <div
                  v-if="slotProps.value != null"
                  class="builds-share-sidebar-type-option-icon"
                >
                  <font-awesome-icon
                    :class="slotProps.value.iconCssClass"
                    :icon="slotProps.value.icon"
                  />
                </div>
                <span v-if="slotProps.value != null">{{ $t(slotProps.value.caption) }}</span>
                <span v-else>{{ $t('caption.selectFormat') }}</span>
              </div>
            </template>
          </Dropdown>
        </div>
        <div
          v-if="typeOption != null && shareExplanation != null"
          class="sidebar-option-description builds-share-sidebar-option-explanation"
        >
          <div class="sidebar-option-icon">
            <font-awesome-icon icon="info-circle" />
          </div>
          <span class="">
            {{ $t(shareExplanation) }}
          </span>
        </div>
        <div class="builds-share-sidebar-option">
          <LanguageSelector
            v-if="typeOption != null"
            v-model:language="language"
            class="builds-share-sidebar-option-long"
            @update:language="getText()"
          />
        </div>
        <div
          v-if="typeOption != null"
          class="builds-share-sidebar-option"
        >
          <Checkbox
            v-model="linkOnly"
            :binary="true"
            @change="getText()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !linkOnly
            }"
            @click="() => {
              linkOnly = !linkOnly
              getText()
            }"
          >
            {{ $t('caption.linkOnly') }}
          </div>
        </div>
        <div
          v-if="typeOption != null && !linkOnly"
          class="builds-share-sidebar-option"
        >
          <Checkbox
            v-model="includeLink"
            :binary="true"
            @change="getText()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !includeLink
            }"
            @click="() => {
              includeLink = !includeLink
              getText()
            }"
          >
            {{ $t('caption.includeLinkToInteractiveVersion') }}
          </div>
        </div>
        <div
          v-if="typeOption != null && !linkOnly && includeLink"
          class="sidebar-option-description builds-share-sidebar-option-explanation"
        >
          <div class="sidebar-option-icon">
            <font-awesome-icon icon="info-circle" />
          </div>
          <span class="">
            {{ $t('message.includeLinkToInteractiveVersionExplanation') }}
          </span>
        </div>
        <div
          v-if="typeOption != null && !linkOnly"
          class="builds-share-sidebar-option"
        >
          <Checkbox
            v-model="includePrices"
            :binary="true"
            @change="getText()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !includePrices
            }"
            @click="() => {
              includePrices = !includePrices
              getText()
            }"
          >
            {{ $t('caption.includePrices') }}
          </div>
        </div>
        <div class="builds-share-sidebar-option builds-share-sidebar-copy-button">
          <Button
            v-if="!isLoading && typeOption != null"
            @click="copyText()"
          >
            <font-awesome-icon
              icon="copy"
              class="icon-before-text"
            />
            <span>{{ $t('caption.copyElement') }}</span>
          </Button>
          <span
            v-if="!isLoading && typeOption != null"
            class="builds-share-sidebar-text-length"
          >
            {{ lengthCaption }}
          </span>
        </div>
      </div>
      <div
        v-if="isLoading"
        class="builds-share-sidebar-option builds-share-sidebar-loading"
      >
        <Loading />
      </div>
      <div
        v-if="!isLoading && typeOption != null"
        class="builds-share-sidebar-option builds-share-sidebar-text"
      >
        <TextArea
          v-if="typeOption != null"
          v-model="text"
          rows="20"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildsShareTypeOption } from '../../models/utils/IBuildsShareTypeOption'
import { BuildsToTextType } from '../../models/utils/IBuildsToTextOptions'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildsShareSideBarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { IToolbarButton } from '../../models/utils/IToolbarButton'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { LogService } from '../../services/LogService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import BuildsList from '../BuildsListComponent.vue'
import LanguageSelector from '../LanguageSelectorComponent.vue'
import Loading from '../LoadingComponent.vue'
import Toolbar from '../ToolbarComponent.vue'

const props = defineProps<{ parameters: BuildsShareSideBarParameters }>()

const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _logService = Services.get(LogService)
const _notificationService = Services.get(NotificationService)

const typeOptions: IBuildsShareTypeOption[] = [
  {
    caption: 'caption.redditMarkdown',
    icon: ['fab', 'reddit-alien'],
    iconCssClass: 'builds-share-sidebar-type-option-reddit-icon',
    type: 'redditMarkdown'
  },
  {
    caption: 'caption.discordMarkdown',
    icon: ['fab', 'discord'],
    iconCssClass: 'builds-share-sidebar-type-option-discord-icon',
    type: 'discordMarkdown'
  },
  {
    caption: 'caption.simpleText',
    icon: 'italic',
    type: 'simpleText'
  }
]
const toolbarButtons: IToolbarButton[] = [
  {
    action: selectBuildsToShare,
    canBeMovedToSidebar: () => false,
    caption: () => `${vueI18n.t('caption.share')}` + (selectedBuilds.value.length > 1 ? ` (${selectedBuilds.value.length})` : ''),
    icon: () => 'download',
    isDisabled: () => selectedBuilds.value?.length == 0,
    name: 'share',
    showCaption: () => 'always',
    variant: () => 'success'
  },
  {
    action: toggleSelection,
    canBeMovedToSidebar: () => false,
    caption: () => allSelected.value ? vueI18n.t('caption.deselectAll') : vueI18n.t('caption.selectAll'),
    icon: () => allSelected.value ? 'folder-minus' : 'folder-plus',
    isVisible: () => availableBuilds.value.length > 1,
    name: 'toggleSelection',
    style: () => 'outlined'
  }
]
const availableBuilds = ref<IBuildSummary[]>([])
const buildsExportToolbar = ref()
const buildsToShare = ref<IBuild[]>([])
const includeLink = ref(true)
const includePrices = ref(true)
const isLoading = ref(false)
const language = ref<string>(vueI18n.locale.value)
const linkOnly = ref(false)
const selectedBuilds = ref<IBuildSummary[]>([])
const text = ref<string>()
const typeOption = ref<IBuildsShareTypeOption>()

const allSelected = computed(() => selectedBuilds.value.length === availableBuilds.value.length)
const buildsToTextType = computed(() => {
  switch (typeOption.value?.type) {
    case 'discordMarkdown':
    case 'redditMarkdown':
      return BuildsToTextType.markdown
    case 'simpleText':
      return BuildsToTextType.simpleText
    default:
      return undefined
  }
})
const lengthCaption = computed(() => `${vueI18n.t('caption.length')}: ${text.value?.length.toLocaleString() ?? 0} ${vueI18n.t('caption.characters').toLocaleLowerCase()}`)
const shareExplanation = computed(() => {
  switch (typeOption.value?.type) {
    case 'discordMarkdown':
      return 'message.discordMarkdownExplanation'
    case 'redditMarkdown':
      return 'message.redditMarkdownExplanation'
    default:
      return undefined
  }
})
const toolbarContainer = computed(() => buildsExportToolbar.value?.container)

onMounted(() => initialize())

/**
 * Copies the text to the clipboard.
 */
function copyText() {
  if (text.value == null) {
    return
  }

  navigator.clipboard.writeText(text.value)
    .then(() => {
      _notificationService.notify(NotificationType.information, vueI18n.t('message.copied'))
    })
    .catch(() => {
      _logService.logError('message.copyError')
      _notificationService.notify(NotificationType.error, vueI18n.t('message.copyError'))
    })
}

/**
 * Gets the text.
 */
async function getText() {
  isLoading.value = true

  text.value = await _buildPropertiesService.toText(
    buildsToShare.value,
    {
      includeLink: includeLink.value,
      includePrices: includePrices.value,
      language: language.value,
      linkOnly: linkOnly.value,
      type: buildsToTextType.value!
    })

  isLoading.value = false
}

/**
 * Displays the builds selection screen.
 */
function goBackToBuildsSelection() {
  buildsToShare.value = []
}

/**
 * Initializes the component.
 */
function initialize() {
  availableBuilds.value = props.parameters.buildSummaries ?? []
  buildsToShare.value = props.parameters.buildToShare != null ? [props.parameters.buildToShare] : []

  if (buildsToShare.value.length > 0 && typeOption.value != null) {
    getText()
  }
}

/**
 * Selects the builds to share.
 */
function selectBuildsToShare() {
  const builds: IBuild[] = []

  for (const selectedBuild of selectedBuilds.value) {
    const build = _buildService.get(selectedBuild.id)

    if (build != null) {
      builds.push(build)
    }
  }

  buildsToShare.value = builds
}

/**
 * Toggles the selection.
 */
function toggleSelection() {
  if (allSelected.value) {
    selectedBuilds.value = []
  } else {
    selectedBuilds.value = availableBuilds.value
  }
}
</script>










<style scoped>
@import '../../css/button.css';
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.builds-share-sidebar {
  max-width: 100%;
  min-width: 100%;
  width: 100vw;
}

.builds-share-sidebar-back-button {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
}

.builds-share-sidebar-checkbox-caption {
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 2.5rem;
}

.builds-share-sidebar-checkbox-caption-disabled {
  opacity: 50%;
}

.builds-share-sidebar-copy-button {
  margin-top: 2.5rem;
}

.builds-share-sidebar-loading {
  margin-top: 2.5rem;
}

.builds-share-sidebar-name {
  margin-left: 2.5rem;
}

.builds-share-sidebar-option {
  align-items: center;
  display: flex;
  gap: 1rem;
  width: 100%;
}

.builds-share-sidebar-options {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 50%;
}

.builds-share-sidebar-option-explanation {
  grid-column: span 2;
}

.builds-share-sidebar-selection {
  max-width: 40rem;
}

.builds-share-sidebar-text {
  margin-top: 0.5rem;
  width: 100%;
}

.builds-share-sidebar-text > textarea {
  width: 100%;
}

.builds-share-sidebar-text-length {
  color: var(--util-color7);
  font-size: 0.85rem;
}

.builds-share-sidebar-type {
  height: 2.75rem;
  width: 100%;
}

.builds-share-sidebar-type-option {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  height: 2.5rem;
  padding: 0.25rem;
}

.builds-share-sidebar-type-option-discord-icon {
  color: #5562ea
}

.builds-share-sidebar-type-option-icon {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 2rem;
  font-size: 1.25rem;
}

.builds-share-sidebar-type-option-reddit-icon {
  color: #ff4500;
  font-size: 1.75rem;
}

.builds-share-sidebar-value {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  height: 100%;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .builds-share-sidebar-options {
    width: 100%;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .builds-share-sidebar-options {
    width: 75%;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .builds-share-sidebar-options {
    width: 100%;
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>

<style unscoped>
.builds-share-sidebar-type > .p-dropdown-label {
  padding: 0;
}
</style>