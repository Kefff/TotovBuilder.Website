<template>
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
    <div class="sidebar-option builds-share-sidebar-line">
      <span>{{ $t('caption.format') }}</span>
      <Dropdown
        v-model="typeOption"
        :options="typeOptions"
        data-key="caption"
        class="builds-share-sidebar-type"
        @update:model-value="getText()"
      >
        <template #option="slotProps">
          <div class="builds-share-sidebar-option">
            <div class="builds-share-sidebar-option-icon">
              <font-awesome-icon
                :class="slotProps.option.iconCssClass"
                :icon="slotProps.option.icon"
              />
            </div>
            <span>{{ $t(slotProps.option.caption) }}</span>
          </div>
        </template>
        <template #value="slotProps">
          <div
            v-if="slotProps.value != null"
            class="builds-share-sidebar-option"
          >
            <div class="builds-share-sidebar-option-icon">
              <font-awesome-icon
                :class="slotProps.value.iconCssClass"
                :icon="slotProps.value.icon"
              />
            </div>
            <span>{{ $t(slotProps.value.caption) }}</span>
          </div>
        </template>
      </Dropdown>
    </div>
    <div
      v-if="typeOption != null"
      class="sidebar-option builds-share-sidebar-line"
    >
      <span>{{ $t('caption.language') }}</span>
      <LanguageSelector
        v-model:language="language"
        class="builds-share-sidebar-language-selector"
        @update:language="getText()"
      />
    </div>
    <Loading v-if="isLoading" />
    <div
      v-if="!isLoading && typeOption != null"
      class="sidebar-option"
    >
      <Button @click="copyText()">
        <font-awesome-icon
          icon="copy"
          class="icon-before-text"
        />
        <span>{{ $t('caption.copyElement') }}</span>
      </Button>
    </div>
    <div
      v-if="!isLoading && typeOption != null"
      class="sidebar-option"
    >
      <TextArea
        v-if="typeOption != null"
        v-model="text"
        class="builds-share-sidebar-text"
        rows="18"
      />
    </div>
    <span v-if="!isLoading && typeOption != null">
      {{ lengthCaption }}
    </span>
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
    iconCssClass: 'builds-share-sidebar-option-reddit-icon',
    type: BuildsToTextType.markdown
  },
  {
    caption: 'caption.discordMarkdown',
    icon: ['fab', 'discord'],
    iconCssClass: 'builds-share-sidebar-option-discord-icon',
    type: BuildsToTextType.markdown
  },
  {
    caption: 'caption.simpleText',
    icon: 'italic',
    type: BuildsToTextType.simpleText
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
const includePrices = ref(false)
const isLoading = ref(false)
const language = ref<string>(vueI18n.locale.value)
const linkOnly = ref(false)
const selectedBuilds = ref<IBuildSummary[]>([])
const text = ref<string>()
const typeOption = ref<IBuildsShareTypeOption>()

const allSelected = computed(() => selectedBuilds.value.length === availableBuilds.value.length)
const lengthCaption = computed(() => `${vueI18n.t('caption.length')}: ${text.value?.length ?? 0} ${vueI18n.t('caption.characters').toLocaleLowerCase()}`)
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
      includePrices: includePrices.value,
      language: language.value,
      linkOnly: linkOnly.value,
      type: typeOption.value!.type
    })

  isLoading.value = false
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
@import '../../css/icon.css';
@import '../../css/sidebar.css';

.builds-share-sidebar-language-selector {
  max-width: 20.75rem;
}

.builds-share-sidebar-line {
  gap: 1rem;
}

.builds-share-sidebar-name {
  margin-left: 2.5rem;
}

.builds-share-sidebar-option {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  height: 100%;
  padding: 0.5rem;
}

.builds-share-sidebar-option-discord-icon {
  color: #5562ea
}

.builds-share-sidebar-option-icon {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 2rem;
  font-size: 1.5rem;
}

.builds-share-sidebar-option-reddit-icon {
  color: #ff4500;
  font-size: 2rem;
}

.builds-share-sidebar-selection {
  max-width: 40rem;
}

.builds-share-sidebar-text {
  min-width: 100%;
  width: 100vw;
}

.builds-share-sidebar-type {
  height: 2.75rem;
  width: 20.725rem;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {}

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