<script setup lang="ts">
import { computed } from 'vue'
import Images from '../images'
import StringUtils from '../utils/StringUtils'

const modelLanguage = defineModel<string>('language', { required: true })

const props = withDefaults(
  defineProps<{
    isItemsLanguageInputEnabled?: boolean,
    languages: string[]
  }>(),
  {
    isItemsLanguageInputEnabled: true
  })

const availableLanguages = computed<string[]>(() => props.languages.filter(l => l !== modelLanguage.value))
</script>










<template>
  <Dropdown
    v-model="modelLanguage"
    :disabled="!isItemsLanguageInputEnabled"
    :options="availableLanguages"
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