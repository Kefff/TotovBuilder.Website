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
    },
    value: {
      type: String,
      required: false,
      default: undefined
    }
  },
  emits: ['update:value'],
  setup: (props, { emit }) => {
    const valueInternal = computed({
      get: () => props.value,
      set: (value: string | undefined) => emit('update:value', value)
    })
    const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
    const invalid = computed(() => props.required && (valueInternal.value == null || valueInternal.value === ''))

    return {
      captionAsPlaceholder,
      invalid,
      valueInternal
    }
  }
})