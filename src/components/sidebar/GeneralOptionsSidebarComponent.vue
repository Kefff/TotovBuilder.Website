<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IGeneralOption } from '../../models/utils/IGeneralOption'
import { GeneralOptionsSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GeneralOptionsService } from '../../services/GeneralOptionsService'
import Services from '../../services/repository/Services'
import ApplicationLanguageSelector from '../ApplicationLanguageSelectorComponent.vue'

const props = defineProps<{ parameters?: GeneralOptionsSidebarParameters }>()

const _generalOptionsService = Services.get(GeneralOptionsService)

const allowCookies = ref(true)
const exportWarning = ref(true)

const additionalDisplayOptions = computed(() => props.parameters?.filter(og => og.name === 'display-options').flatMap(og => og.options) ?? [])
const additionalGeneralOptions = computed(() => props.parameters?.filter(og => og.name === 'general-options').flatMap(og => og.options) ?? [])
const additionalOptionGroups = computed(() => props.parameters?.filter(og => og.name !== 'display-options' && og.name !== 'general-options') ?? [])

onMounted(() => {
  allowCookies.value = _generalOptionsService.getAllowCookiesOption()
  exportWarning.value = _generalOptionsService.getExportWarningOption()
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
 * Reacts to the export warning option being changed.
 *
 * Sets the export warning option.
 */
function onExportWarningChanged(): void {
  _generalOptionsService.setExportWarningOption(exportWarning.value)
}

/**
 * Toggles the allow cookies option.
 * @param filter - Filter.
 */
function toggleAllowCookiesValue(): void {
  allowCookies.value = !allowCookies.value
  onAllowCookiesChanged()
}

/**
 * Toggles the export warning option.
 * @param filter - Filter.
 */
function toggleExportWarningValue(): void {
  exportWarning.value = !exportWarning.value
  onExportWarningChanged()
}
</script>










<template>
  <!-- Display options -->
  <div class="sidebar-option">
    <ApplicationLanguageSelector />
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
    <span>{{ $t(additionalDisplayOption.caption) }}</span>
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
    <span class="general-options-cookies-explanation">
      {{ $t('message.cookiesExplanation') }}
    </span>
  </div>
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
.general-options-addition-group {
  margin-top: 3rem;
}

.general-options-cookies-explanation {
  max-width: 20rem;
}

.general-options-name {
  cursor: pointer;
}
</style>
