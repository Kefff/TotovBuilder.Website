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
function getAvailableLanguages(): void {
  const newLanguages: string[] = []

  for (const language of vueI18n.availableLocales.filter(l => l !== modelLanguage.value)) {
    newLanguages.push(language)
  }

  languages.value = newLanguages
}
</script>










<template>
  <Dropdown
    v-model="modelLanguage"
    :options="languages"
    :placeholder="$t('caption.language')"
    class="language-selector"
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
</template>










<style scoped>
.language-selector {
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
  gap: 0.5rem;
  height: 100%;
}

.language-selector-item-flag {
  width: 1.5rem;
}

.language-selector-option {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  height: 2.5rem;
}
</style>