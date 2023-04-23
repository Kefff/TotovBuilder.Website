import { computed, defineComponent, ref, watch } from 'vue'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'

export default defineComponent({
  components: {
    LanguageSelector
  },
  props: {
    sidebarVisible: {
      type: Boolean,
      reuired: false,
      default: false
    }
  },
  emits: ['update:sidebarVisible'],
  setup: (props, { emit }) => {
    const sidebarVisibleValue = ref(props.sidebarVisible)

    const sidebarVisibleInternal = computed<boolean>({
      get: () => sidebarVisibleValue.value,
      set: (value: boolean) => {
        sidebarVisibleValue.value = value
        emit('update:sidebarVisible', value)
      }
    })

    watch(() => props.sidebarVisible, (newValue) => sidebarVisibleValue.value = newValue)

    return {
      sidebarVisibleInternal
    }
  }
})