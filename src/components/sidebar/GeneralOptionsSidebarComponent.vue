<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IGeneralOption } from '../../models/utils/IGeneralOption'
import { GeneralOptionsSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import vueI18n from '../../plugins/vueI18n'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import LanguageService from '../../services/LanguageService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import LanguageSelector from '../LanguageSelectorComponent.vue'

const modelParameters = defineModel<GeneralOptionsSidebarParameters>('parameters')

defineProps<{ identifier: number }>()

const _generalOptionsService = Services.get(GeneralOptionsService)
const _languageService = Services.get(LanguageService)
const _websiteConfigurationService = Services.get(WebsiteConfigurationService)


const allowCookies = ref(true)
const exportWarning = ref(true)
const outdatedSharableUrlWarning = ref(true)

const additionalDisplayOptions = computed(() => modelParameters.value?.optionGroups.filter(og => og.name === 'display-options').flatMap(og => og.options) ?? [])
const additionalGeneralOptions = computed(() => modelParameters.value?.optionGroups.filter(og => og.name === 'general-options').flatMap(og => og.options) ?? [])
const additionalOptionGroups = computed(() => modelParameters.value?.optionGroups.filter(og => og.name !== 'display-options' && og.name !== 'general-options') ?? [])
const applicationLanguage = computed({
  get: () => vueI18n.locale.value,
  set: (value) => _languageService.setApplicationLanguage(value)
})

const itemsLanguage = ref<string>(_languageService.getItemsLanguage())



onMounted(() => {
  allowCookies.value = _generalOptionsService.getAllowCookiesOption()
  exportWarning.value = _generalOptionsService.getExportWarningOption()
  outdatedSharableUrlWarning.value = _generalOptionsService.getOutdatedSharableUrlWarningOption()
})

/**
 * Gets the CSS classes to apply to an option.
 */
function getAdditionalOptionCssClasses(option: IGeneralOption): string {
  let classes = 'sidebar-option'

  if (option.enabled != null && !option.enabled()) {
    classes += ' sidebar-option-disabled sidebar-option-prevent-click'
  } else {
    classes += ' sidebar-option-clickable'
  }

  return classes
}

/**
 * Reacts to the allow cookies option being changed.
 *
 * Sets the allow cookies option.
 */
function onAllowCookiesChanged(): void {
  _generalOptionsService.setAllowCookiesOption(allowCookies.value)
}

/**
 * Reacts to the application language being changed.
 *
 * Sets the application language with the same value.
 */
function onApplicationLanguageChanged(): void {
  itemsLanguage.value = applicationLanguage.value
  onItemsLanguageChanged()
}

/**
 * Reacts to the export warning option being changed.
 *
 * Sets the export warning option.
 */
function onExportWarningChanged(): void {
  _generalOptionsService.setExportWarningOption(exportWarning.value)
}

/**
 * Reacts to the items language being changed.
 *
 * Persists the items language and invalidates items and prices cache to force them to be reloaded with the new language.
 */
function onItemsLanguageChanged(): void {
  _languageService.setItemsLanguage(itemsLanguage.value)
}

/**
 * Reacts to the outdated sharable URL warning option being changed.
 *
 * Sets the OutdatedSharableUrl warning option.
 */
function onOutdatedSharableUrlWarningChanged(): void {
  _generalOptionsService.setOutdatedSharableUrlWarningOption(outdatedSharableUrlWarning.value)
}

/**
 * Toggles the allow cookies option.
 */
function toggleAllowCookiesValue(): void {
  allowCookies.value = !allowCookies.value
  onAllowCookiesChanged()
}

/**
 * Toggles the export warning option.
 */
function toggleExportWarningValue(): void {
  exportWarning.value = !exportWarning.value
  onExportWarningChanged()
}

/**
 * Toggles the outdated sharable URL warning option.
 */
function toggleOutdatedSharableUrlWarningValue(): void {
  outdatedSharableUrlWarning.value = !outdatedSharableUrlWarning.value
  onOutdatedSharableUrlWarningChanged()
}
</script>










<template>
  <!-- Display options -->
  <!-- Application & items language -->
  <div class="sidebar-option">
    <div class="general-options-languages">
      <div class="sidebar-option-icon">
        <font-awesome-icon icon="language" />
      </div>
      <div class="general-options-languages-caption">
        {{ $t('caption.applicationLanguage') }}
      </div>
      <LanguageSelector
        v-model:language="applicationLanguage"
        :languages="vueI18n.availableLocales"
        @update:language="onApplicationLanguageChanged"
      />
      <div class="sidebar-option-icon">
        <font-awesome-icon icon="language" />
      </div>
      <div class="general-options-languages-caption">
        {{ $t('caption.itemsLanguage') }}
      </div>
      <LanguageSelector
        v-if="itemsLanguage != null"
        v-model:language="itemsLanguage"
        :is-items-language-input-enabled="parameters?.isItemsLanguageInputEnabled"
        :languages="_websiteConfigurationService.configuration.itemsLanguages"
        @update:language="onItemsLanguageChanged"
      />
    </div>
  </div>
  <!-- Additional display options -->
  <div
    v-for="(additionalDisplayOption, index) of additionalDisplayOptions"
    :key="index"
    :class="getAdditionalOptionCssClasses(additionalDisplayOption)"
    @click="additionalDisplayOption.onClick()"
  >
    <div class="sidebar-option-icon">
      <font-awesome-icon :icon="additionalDisplayOption.icon" />
    </div>
    <span>{{ $t(additionalDisplayOption.caption) }}</span>
  </div>

  <!-- General options -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="cog" />
    </div>
    <span>{{ $t('caption.generalOptions') }}</span>
  </div>
  <!-- Allow cookies -->
  <div class="sidebar-option">
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="allowCookies"
        :binary="true"
        @change="onAllowCookiesChanged()"
      />
    </div>
    <div
      class="general-options-name"
      :class="!allowCookies ? ' sidebar-option-disabled' : ''"
      @click="toggleAllowCookiesValue()"
    >
      {{ $t('caption.allowCookies') }}
    </div>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>
      {{ $t('message.cookiesExplanation') }}
    </span>
  </div>
  <!-- Build export warning -->
  <div class="sidebar-option">
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="exportWarning"
        :binary="true"
        @change="onExportWarningChanged()"
      />
    </div>
    <div
      class="general-options-name"
      :class="!exportWarning ? ' sidebar-option-disabled' : ''"
      @click="toggleExportWarningValue()"
    >
      {{ $t('caption.exportWarning') }}
    </div>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>
      {{ $t('message.exportExplanation') }}
    </span>
  </div>
  <!-- Build outdated sharable URL -->
  <div class="sidebar-option">
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="outdatedSharableUrlWarning"
        :binary="true"
        @change="onOutdatedSharableUrlWarningChanged()"
      />
    </div>
    <div
      class="general-options-name"
      :class="!outdatedSharableUrlWarning ? ' sidebar-option-disabled' : ''"
      @click="toggleOutdatedSharableUrlWarningValue()"
    >
      {{ $t('caption.outdatedSharableUrlWarning') }}
    </div>
  </div>
  <div class="sidebar-option-description">
    <div class="sidebar-option-icon">
      <font-awesome-icon icon="info-circle" />
    </div>
    <span>
      {{ $t('message.outdatedShareUrlExplanation') }}
    </span>
  </div>
  <!-- Additional general options -->
  <div
    v-for="(additionalGeneralOption, index) of additionalGeneralOptions"
    :key="index"
    :class="getAdditionalOptionCssClasses(additionalGeneralOption)"
    @click="additionalGeneralOption.onClick()"
  >
    <div class="sidebar-option-icon">
      <font-awesome-icon :icon="additionalGeneralOption.icon" />
      <span>{{ $t(additionalGeneralOption.caption) }}</span>
    </div>
  </div>

  <!-- Additional option groups -->
  <div
    v-for="additionalOptionsGroup of additionalOptionGroups"
    :key="additionalOptionsGroup.name"
    class="general-options-additional-group"
  >
    <div class="sidebar-title">
      <div class="sidebar-title-icon">
        <font-awesome-icon :icon="additionalOptionsGroup.icon" />
      </div>
      <span>{{ $t(additionalOptionsGroup.caption) }}</span>
    </div>
    <div
      v-for="(additionalOption, index) of additionalOptionsGroup.options"
      :key="index"
      :class="getAdditionalOptionCssClasses(additionalOption)"
      @click="additionalOption.onClick()"
    >
      <div>
        <div class="sidebar-option-icon">
          <font-awesome-icon
            :icon="additionalOption.icon"
            class="icon-before-text"
          />
        </div>
        <span>{{ $t(additionalOption.caption) }}</span>
      </div>
    </div>
  </div>
</template>










<style scoped>
.general-options-additional-group {
  margin-top: 3rem;
}

.general-options-languages {
  align-items: center;
  display: grid;
  grid-template-columns: auto auto 1fr;
  row-gap: 1rem;
  width: 100%;
}

.general-options-languages-caption {
  margin-right: 0.5rem;
}

.general-options-name {
  cursor: pointer;
}
</style>
