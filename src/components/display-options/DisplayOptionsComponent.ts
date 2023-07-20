import { defineComponent, ref, watch } from 'vue'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    LanguageSelector
  },
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['update:visible'],
  setup: (props, { emit }) => {
    const sidebarVisible = ref(false)

    watch(() => props.visible, (newValue) => {
      sidebarVisible.value = newValue
    })

    /**
     * Displays the side bar.
     */
    function display() {
      sidebarVisible.value = true
      emit('update:visible', sidebarVisible.value)
    }

    return {
      display,
      sidebarVisible
    }
  }
})