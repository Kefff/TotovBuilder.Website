<template>
  <div class="language-selector">
    <div class="language-selector-icon">
      <font-awesome-icon icon="language" />
    </div>
    <span class="language-selector-caption">{{ $t('caption.language') }}</span>
    <div class="language-selector-dropdown language-selector-dropdown-override">
      <Dropdown
        v-model="currentLanguage"
        :options="languages"
        :placeholder="$t('caption.language')"
        @change="setLanguage()"
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
  </div>
</template>










<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Images from '../images'
import LanguageUtils from '../utils/LanguageUtils'
import StringUtils from '../utils/StringUtils'

const vueI18n = useI18n()

const currentLanguage = ref(vueI18n.locale.value)
const languages = ref<string[]>([])

onMounted(() => {
  getLanguages()
})

/**
 * Gets available languages.
 */
function getLanguages() {
  languages.value = []
  currentLanguage.value = vueI18n.locale.value

  for (const language of vueI18n.availableLocales.filter(l => l !== vueI18n.locale.value)) {
    languages.value.push(language)
  }
}

/**
 * Sets the language.
 */
function setLanguage() {
  LanguageUtils.setLanguage(currentLanguage.value)
  getLanguages()
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

.language-selector-dropdown {
  margin-left: 1rem;
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
.language-selector-dropdown-override > .p-dropdown > .p-dropdown-label {
  padding-bottom: 0.9rem;
  padding-left: 0.9rem;
  padding-right: 0.9rem;
  padding-top: 0.9rem;
}
</style>