<script setup lang="ts">
import { ref } from 'vue'
import vueI18n from '../plugins/vueI18n'
import LanguageUtils from '../utils/LanguageUtils'
import LanguageSelector from './LanguageSelectorComponent.vue'

const currentLanguage = ref(vueI18n.locale.value)

/**
 * Sets the language.
 */
function setLanguage() {
  LanguageUtils.setLanguage(currentLanguage.value)
}
</script>










<template>
  <div class="application-language-selector">
    <div class="application-language-selector-icon">
      <font-awesome-icon icon="language" />
    </div>
    <span class="application-language-selector-caption">{{ $t('caption.language') }}</span>
    <LanguageSelector
      v-model:language="currentLanguage"
      class="application-language-selector-dropdown"
      @update:language="setLanguage()"
    />
  </div>
</template>










<style scoped>
.application-language-selector {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}

.application-language-selector-caption {
  margin-right: auto;
}

.application-language-selector-dropdown {
  margin-left: 1rem;
}

.application-language-selector-icon {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 0.5rem;
  width: 2.875rem;
}
</style>