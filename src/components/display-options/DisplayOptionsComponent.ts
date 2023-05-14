import { computed, defineComponent } from 'vue'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    LanguageSelector
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:visible'],
  setup: (props, { emit }) => {
    const sidebarVisible = computed<boolean>({
      get: () => props.visible,
      set: (value: boolean) => emit('update:visible', value)
    })

    return {
      sidebarVisible
    }
  }
})