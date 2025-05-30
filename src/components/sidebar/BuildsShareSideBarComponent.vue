<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'
import { IBuild } from '../../models/build/IBuild'
import { IBuildsShareTypeOption } from '../../models/utils/IBuildsShareTypeOption'
import { BuildsToTextType } from '../../models/utils/IBuildsToTextOptions'
import { BuildsShareSideBarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { IToolbarButton } from '../../models/utils/IToolbarButton'
import { ShareButtons } from '../../models/utils/ShareButtons'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import Services from '../../services/repository/Services'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import BuildShareButtons from '../BuildShareButtonsComponent.vue'
import BuildsList from '../BuildsListComponent.vue'
import LanguageSelector from '../LanguageSelectorComponent.vue'
import Loading from '../LoadingComponent.vue'
import Toolbar from '../ToolbarComponent.vue'

const props = defineProps<{ parameters: BuildsShareSideBarParameters }>()

const _buildService = Services.get(BuildService)
const _buildPropertiesService = Services.get(BuildPropertiesService)

const _toolbarButtons: IToolbarButton[] = [
  {
    action: selectBuildsToShare,
    canBeMovedToSidebar: () => false,
    caption: () => `${vueI18n.t('caption.share')}` + (selectedBuilds.value.length > 1 ? ` (${selectedBuilds.value.length})` : ''),
    icon: () => 'download',
    isDisabled: () => selectedBuilds.value?.length === 0,
    name: 'share',
    showCaption: () => 'always',
    variant: () => 'success'
  },
  {
    action: toggleSelection,
    canBeMovedToSidebar: () => false,
    caption: () => allSelected.value ? vueI18n.t('caption.deselectAll') : vueI18n.t('caption.selectAll'),
    icon: () => allSelected.value ? 'folder-minus' : 'folder-plus',
    isVisible: () => isToggleSelectionVisible.value,
    name: 'toggleSelection',
    style: () => 'outlined'
  }
]
const _typeOptions: IBuildsShareTypeOption[] = [
  {
    caption: 'caption.discordMarkdown',
    icon: ShareButtons.discord.iconName!,
    iconCssClass: 'builds-share-sidebar-type-option-discord-icon',
    type: 'discordMarkdown'
  },
  {
    caption: 'caption.redditMarkdown',
    icon: ShareButtons.reddit.iconName!,
    iconCssClass: 'builds-share-sidebar-type-option-reddit-icon',
    type: 'redditMarkdown'
  },
  {
    caption: 'caption.simpleText',
    icon: 'font',
    type: 'simpleText'
  }
]

useEventListener(document, 'keydown', onKeyDown)

const builds = ref<IBuild[]>([])
const buildsShareToolbar = useTemplateRef('buildsShareToolbar')
const buildsToShare = ref<IBuild[]>([])
const includeEmojis = ref(true)
const includeLink = ref(true)
const includePrices = ref(true)
const isGenerating = ref(false)
const isLoading = ref(true)
const language = ref<string>(vueI18n.locale.value)
const linkOnly = ref(false)
const selectedBuilds = ref<IBuild[]>([])
const text = ref<string>()
const typeOption = ref<IBuildsShareTypeOption>(_typeOptions[0])

const buildsToTextType = computed(() => {
  switch (typeOption.value.type) {
    case 'discordMarkdown':
    case 'redditMarkdown':
      return BuildsToTextType.markdown
    case 'simpleText':
      return BuildsToTextType.simpleText
    default:
      return undefined
  }
})
const checkboxesGridTemplateColumns = computed(() => isSmartphonePortrait.value || isTabletPortrait.value ? '1fr 1fr' : '1fr 1fr 1fr 1fr')
const isToggleSelectionVisible = computed(() => builds.value.length > 1)
const lengthCaption = computed(() => `${vueI18n.t('caption.length')}: ${text.value?.length.toLocaleString() ?? 0} ${vueI18n.t('caption.characters').toLocaleLowerCase()}`)
const shareExplanation = computed(() => {
  switch (typeOption.value.type) {
    case 'discordMarkdown':
      return 'message.discordMarkdownExplanation'
    case 'redditMarkdown':
      return 'message.redditMarkdownExplanation'
    default:
      return undefined
  }
})
const toolbarContainer = computed(() => buildsShareToolbar.value?.container)

const allSelected = ref(false)
const { isSmartphonePortrait, isTabletPortrait } = WebBrowserUtils.getScreenSize()

onMounted(() => initialize())

/**
 * Copies the text to the clipboard.
 */
function copyText(): void {
  if (text.value == null) {
    return
  }

  WebBrowserUtils.copyToClipboardAsync(text.value)
}

/**
 * Gets the builds to share.
 */
function getBuildsToShare(): IBuild[] {
  builds.value = props.parameters.getBuildsToShareFunction!()

  return builds.value
}

/**
 * Gets the text.
 */
async function getTextAsync(): Promise<void> {
  isGenerating.value = true

  text.value = await _buildPropertiesService.toTextAsync(
    buildsToShare.value,
    {
      includeEmojis: includeEmojis.value,
      includeLink: includeLink.value,
      includePrices: includePrices.value,
      language: language.value,
      linkOnly: linkOnly.value,
      type: buildsToTextType.value!
    })

  nextTick(() => isGenerating.value = false)
}

/**
 * Initializes the component.
 */
function initialize(): void {
  isLoading.value = true

  if (props.parameters.buildToShare != null) {
    buildsToShare.value = [props.parameters.buildToShare]
    getTextAsync()
  }

  nextTick(() => isLoading.value = false)
}

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (buildsToShare.value.length === 0
    && event.key === 'a'
    && (event.ctrlKey
      || event.metaKey)) {
    event.preventDefault() // Prevents the browser action from being triggered
    selectedBuilds.value = builds.value
  }
}

/**
 * Selects the builds to share.
 */
function selectBuildsToShare(): void {
  const builds: IBuild[] = []

  for (const selectedBuild of selectedBuilds.value) {
    const build = _buildService.get(selectedBuild.id)

    if (build != null) {
      builds.push(build)
    }
  }

  buildsToShare.value = builds
  getTextAsync()
}

/**
 * Toggles the selection.
 */
function toggleSelection(): void {
  allSelected.value = !allSelected.value
}
</script>










<template>
  <div
    class="builds-share-sidebar"
    :class="{
      'builds-share-sidebar-large': buildsToShare.length > 0
    }"
  >
    <Loading v-if="isLoading" />
    <div
      v-else-if="!isLoading && buildsToShare.length === 0"
      class="builds-share-sidebar-selection"
    >
      <Toolbar
        ref="buildsShareToolbar"
        :buttons="_toolbarButtons"
        style="margin-top: 1px;"
      />
      <BuildsList
        v-model:all-selected="allSelected"
        v-model:selected-builds="selectedBuilds"
        :get-builds-function="getBuildsToShare"
        :element-to-stick-to="toolbarContainer"
        :infinite-scrolling="true"
        :max-elements-per-line="1"
        :selection-options="{
          canUnselect: true,
          isEnabled: true,
          isMultiSelection: true
        }"
        :show-actions-button="false"
        :show-not-exported="false"
      />
    </div>
    <div v-else-if="!isLoading">
      <!-- Quick share -->
      <div
        v-if="buildsToShare.length === 1"
        class="sidebar-title"
      >
        {{ $t('caption.quickShare') }}
      </div>
      <div
        v-if="buildsToShare.length === 1"
        class="sidebar-option"
      >
        <BuildShareButtons
          :build="buildsToShare[0]"
          :hidden="['discord']"
        />
      </div>

      <!-- Manual share -->
      <div class="sidebar-title">
        {{ $t('caption.manualShare') }}
      </div>
      <div class="sidebar-option">
        <Dropdown
          v-model="typeOption"
          class="builds-share-sidebar-dropdown"
          :options="_typeOptions"
          data-key="caption"
          :placeholder="$t('caption.selectFormat')"
          @update:model-value="getTextAsync()"
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
        class="sidebar-option-description"
      >
        <div class="sidebar-option-icon">
          <font-awesome-icon icon="info-circle" />
        </div>
        <span class="">
          {{ $t(shareExplanation) }}
        </span>
      </div>
      <div class="sidebar-option builds-share-sidebar-dropdown">
        <LanguageSelector
          v-if="typeOption != null"
          v-model:language="language"
          @update:language="getTextAsync()"
        />
      </div>
      <div
        v-if="typeOption != null"
        class="sidebar-option builds-share-sidebar-checkboxes"
      >
        <div>
          <Checkbox
            v-model="linkOnly"
            class="builds-share-sidebar-checkbox"
            :binary="true"
            @change="getTextAsync()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !linkOnly
            }"
            @click="() => {
              linkOnly = !linkOnly
              getTextAsync()
            }"
          >
            {{ $t('caption.linkOnly') }}
          </div>
        </div>
        <div v-if="!linkOnly">
          <Checkbox
            v-model="includeLink"
            class="builds-share-sidebar-checkbox"
            :binary="true"
            @change="getTextAsync()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !includeLink
            }"
            @click="() => {
              includeLink = !includeLink
              getTextAsync()
            }"
          >
            {{ $t('caption.includeLinkToInteractiveVersion') }}
          </div>
        </div>
        <div v-if="!linkOnly">
          <Checkbox
            v-model="includePrices"
            class="builds-share-sidebar-checkbox"
            :binary="true"
            @change="getTextAsync()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !includePrices
            }"
            @click="() => {
              includePrices = !includePrices
              getTextAsync()
            }"
          >
            {{ $t('caption.includePrices') }}
          </div>
        </div>
        <div v-if="!linkOnly">
          <Checkbox
            v-model="includeEmojis"
            class="builds-share-sidebar-checkbox"
            :binary="true"
            @change="getTextAsync()"
          />
          <div
            class="builds-share-sidebar-checkbox-caption"
            :class="{
              'builds-share-sidebar-checkbox-caption-disabled': !includeEmojis
            }"
            @click="() => {
              includeEmojis = !includeEmojis
              getTextAsync()
            }"
          >
            {{ $t('caption.includeEmojis') }}
          </div>
        </div>
      </div>
      <div
        v-if="!isGenerating && typeOption != null"
        class="sidebar-option builds-share-sidebar-copy-button"
      >
        <Button @click="copyText()">
          <font-awesome-icon
            icon="copy"
            class="icon-before-text"
          />
          <span>{{ $t('caption.copyElement') }}</span>
        </Button>
        <span class="builds-share-sidebar-text-length">
          {{ lengthCaption }}
        </span>
      </div>
      <div
        v-if="isGenerating"
        class="sidebar-option builds-share-sidebar-loading"
      >
        <Loading />
      </div>
      <div
        v-if="!isGenerating && typeOption != null"
        class="sidebar-option builds-share-sidebar-text"
      >
        <TextArea
          v-if="typeOption != null"
          v-model="text"
        />
      </div>
    </div>
  </div>
</template>










<style scoped>
.builds-share-sidebar {
  max-width: 100%;
  min-width: 100%;
  height: 100%;
}

.builds-share-sidebar > div {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.builds-share-sidebar-checkbox {
  display: flex;
  justify-content: center;
  width: 1.75rem;
}

.builds-share-sidebar-checkbox-caption {
  align-items: center;
  cursor: pointer;
  display: flex;
}

.builds-share-sidebar-checkbox-caption-disabled {
  opacity: 50%;
}

.builds-share-sidebar-checkboxes {
  display: grid;
  gap: 1rem;
  grid-template-columns: v-bind(checkboxesGridTemplateColumns);
}

.builds-share-sidebar-checkboxes > div {
  align-items: center;
  display: flex;
  gap: 0.25rem;
}

.builds-share-sidebar-copy-button {
  gap: 1rem;
}

.builds-share-sidebar-dropdown {
  height: 2.75rem;
  max-width: 25rem;
  width: 100%;
}

.builds-share-sidebar-large {
  margin-top: 1rem;
  width: 100vw;
  /* Capped at 50% with a max-width */
}

.builds-share-sidebar-loading {
  margin-top: 2.5rem;
}

.builds-share-sidebar-selection {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 40rem;
}

.builds-share-sidebar-text {
  margin-top: 0.5rem;
  min-height: 26rem;
  height: 100%;
}

.builds-share-sidebar-text > textarea {
  height: 100%;
  width: 100%;
}

.builds-share-sidebar-text-length {
  color: var(--util-color7);
  font-size: 0.85rem;
}

.builds-share-sidebar-type-option {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  height: 2.5rem;
}

.builds-share-sidebar-type-option > span {
  white-space: normal;
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
</style>