import { defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageUtils from '../../utils/LanguageUtils'

export default defineComponent({
  setup: (props) => {
    const i18n = useI18n()
    const languages = ref<string[]>([])
    const currentLanguage = ref(i18n.locale.value)

    onMounted(() => {
      getLanguages()
    })

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
     */
    function setLanguage() {
      LanguageUtils.setLanguage(currentLanguage.value)
      getLanguages()
    }

    return {
      currentLanguage,
      languages,
      setLanguage
    }
  }
})