<template>
  <div class="language-selector-dropdown-override">
    <Dropdown
      v-model="modelLanguage"
      :options="languages"
      :placeholder="$t('caption.language')"
    >
      <template #option="slotProps">
        <div class="language-selector-item language-selector-option">
          <img
            class="language-selector-item-flag"
            :src="Images['language' + StringUtils.toUpperFirst(slotProps.option)]"
          >
          <span>{{ $t('caption.language_' + slotProps.option) }}</span>
        </div>
      </template>
      <template #value="slotProps">
        <div class="language-selector-item">
          <img
            class="language-selector-item-flag"
            :src="Images['language' + StringUtils.toUpperFirst(slotProps.value)]"
          >
          <span>{{ $t('caption.language_' + slotProps.value) }}</span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>










<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Images from '../images'
import vueI18n from '../plugins/vueI18n'
import StringUtils from '../utils/StringUtils'

const modelLanguage = defineModel<string>('language', { required: true })

const languages = ref<string[]>([])

onMounted(() => {
  getAvailableLanguages()
})

watch(() => modelLanguage.value, () => getAvailableLanguages())

/**
 * Gets available languages.
 */
function getAvailableLanguages() {
  const newLanguages: string[] = []

  for (const language of vueI18n.availableLocales.filter(l => l !== modelLanguage.value)) {
    newLanguages.push(language)
  }

  languages.value = newLanguages
}
</script>










<style scoped>
.language-selector {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}

.language-selector-caption {
  margin-right: auto;
}

.language-selector-icon {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 0.5rem;
  width: 2rem;
}

.language-selector-item {
  align-items: center;
  color: var(--text-color);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.language-selector-item-flag {
  margin-right: 0.5rem;
  width: 1.5rem;
}

.language-selector-option {
  padding: 1rem
}
</style>

<style>
.language-selector-dropdown-override {
  width: 100%;
}

.language-selector-dropdown-override > .p-dropdown {
  width: 100%;
}

.language-selector-dropdown-override > .p-dropdown > .p-dropdown-label {
  padding-bottom: 0.9rem;
  padding-left: 0.9rem;
  padding-right: 0.9rem;
  padding-top: 0.9rem;
}
</style>