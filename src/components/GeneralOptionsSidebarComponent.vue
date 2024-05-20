<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IGeneralOption } from '../models/utils/IGeneralOption'
import { IGeneralOptionsGroup } from '../models/utils/IGeneralOptionsGroup'
import { GeneralOptionsService } from '../services/GeneralOptionsService'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import StringUtils from '../utils/StringUtils'
import LanguageSelector from './language-selector/LanguageSelectorComponent.vue'

const props = defineProps<{
  parameters?: IGeneralOptionsGroup[]
}>()

const websiteConfigurationService = Services.get(WebsiteConfigurationService)
websiteConfigurationService.emitter.once(WebsiteConfigurationService.initializationFinishedEvent, onWebsiteConfigurationServiceInitialized)

const additionalDisplayOptions = computed(() => props.parameters?.filter(og => og.name === 'display-options').flatMap(og => og.options) ?? [])
const additionalGeneralOptions = computed(() => props.parameters?.filter(og => og.name === 'general-options').flatMap(og => og.options) ?? [])
const additionalsOptionGroups = computed(() => props.parameters?.filter(og => og.name !== 'display-options' && og.name !== 'general-options') ?? [])

const allowCookies = ref(true)
const isLoading = ref(true)

onMounted(() => {
  isLoading.value = websiteConfigurationService.initializationState === ServiceInitializationState.initializing

  if (!isLoading.value) {
    onWebsiteConfigurationServiceInitialized()
  }
})

/**
 * Gets the CSS classes to apply to an option.
 */
function getAdditionalOptionCssClasses(option: IGeneralOption) {
  let classes = 'sidebar-option'

  if (option.enabled != null && !option.enabled()) {
    classes += ' sidebar-option-disabled'
  } else {
    classes += ' sidebar-option-clickable'
  }

  return classes
}

/**
 * Sets the allow cookie indicator.
 */
function onAllowCookiesChanged() {
  Services.get(GeneralOptionsService).setAllowCookiesIndicator(allowCookies.value)
}

/**
 * Gets the allow cookie indicator.
 */
function onWebsiteConfigurationServiceInitialized() {
  isLoading.value = false
  allowCookies.value = Services.get(GeneralOptionsService).getAllowCookiesIndicator()
}

/**
 * Toggles a the allow cookes indicator.
 * @param filter - Filter.
 */
function toggleAllowCookies() {
  allowCookies.value = !allowCookies.value
  onAllowCookiesChanged()
}
</script>












<template>
  <!-- Display options -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="tv" />
    </div>
    <span>{{ $t('caption.displayOptions') }}</span>
  </div>
  <div class="sidebar-option">
    <LanguageSelector />
  </div>
  <div
    v-for="(additionalDisplayOption, index) of additionalDisplayOptions"
    :key="index"
    :class="getAdditionalOptionCssClasses(additionalDisplayOption)"
    @click="additionalDisplayOption.onClick()"
  >
    <div class="sidebar-option-icon">
      <font-awesome-icon :icon="additionalDisplayOption.icon" />
    </div>
    <div>{{ $t(additionalDisplayOption.caption) }}</div>
  </div>

  <!-- General options -->
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="cog" />
    </div>
    <span>{{ $t('caption.generalOptions') }}</span>
  </div>
  <div class="sidebar-option">
    <div class="sidebar-option-icon">
      <Checkbox
        v-model="allowCookies"
        v-tooltip.top="StringUtils.getCheckboxStateTooltip(allowCookies)"
        :binary="true"
        @change="onAllowCookiesChanged()"
      />
    </div>
    <div>
      <div
        class="general-options-name"
        :class="!allowCookies ? ' general-options-disabled-text' : ''"
        @click="toggleAllowCookies()"
      >
        {{ $t('caption.allowCookies') }}
      </div>
    </div>
  </div>
  <div class="general-options-cookies-explanation">
    <font-awesome-icon
      icon="info-circle"
      class="icon-before-text"
    />
    <div>{{ $t('caption.cookiesExplanation') }}</div>
  </div>
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
    v-for="additionalOptionsGroup of additionalsOptionGroups"
    :key="additionalOptionsGroup.name"
    class="general-options-addition-group"
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
@import '../css/button.css';
@import '../css/icon.css';
@import '../css/sidebar.css';

.general-options-addition-group {
  margin-top: 3rem;
}

.general-options-cookies-explanation {
  align-items: center;
  color: var(--util-color7);
  display: flex;
  font-size: 0.85rem;
  flex-direction: row;
  max-width: 20rem;
  white-space: pre-wrap;
}

.general-options-disabled-text {
  color: var(--util-color5);
}

.general-options-name {
  cursor: pointer;
}
</style>
