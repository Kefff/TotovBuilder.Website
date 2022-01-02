import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    caption: {
      type: String,
      required: false,
      default: undefined
    },
    captionMode: {
      type: String,
      required: false,
      default: 'caption',
      validator: (value: string) => value === 'caption' || value === 'placeholder'
    },
    modelValue: {
      type: String,
      required: false,
      default: undefined
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    requiredMessagePosition: {
      type: String,
      required: false,
      default: 'bottom',
      validator: (value: string) => value === 'bottom' || value === 'right'
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const value = computed({
      get: () => props.modelValue,
      set: (value: string | undefined) => emit('update:modelValue', value)
    })
    const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
    const invalid = computed(() => props.required && (value.value === undefined || value.value === ''))

    return { captionAsPlaceholder, invalid, value }
  }
})