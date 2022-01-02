import { defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageUtils from '../../utils/LanguageUtils'

export default defineComponent({
  setup: () => {
    const i18n = useI18n()
    const languages = ref<string[]>([])
    const currentLanguage = ref(i18n.locale.value)

    watch(() => i18n.locale.value, () => getLanguages())

    onMounted(() => getLanguages())


    /**
     * Gets available languages.
     */
    function getLanguages() {
      languages.value = []
      currentLanguage.value = i18n.locale.value

      for (const language of i18n.availableLocales.filter(l => l !== i18n.locale.value)) {
        languages.value.push(language)
      }
    }

    /**
     * Sets the language.
     * @param language - Language
     */
    function setLanguage(language: string) {
      LanguageUtils.setLanguage(language)
      getLanguages()
    }

    return {
      currentLanguage,
      languages,
      setLanguage
    }
  }
})