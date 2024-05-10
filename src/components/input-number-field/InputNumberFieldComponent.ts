import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    caption: {
      type: String,
      required: false,
      default: ''
    },
    captionMode: {
      type: String,
      required: false,
      default: 'caption',
      validator: (value: string) => value === 'caption' || value === 'placeholder'
    },
    max: {
      type: Number,
      required: false,
      default: undefined
    },
    min: {
      type: Number,
      required: false,
      default: 0
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
      type: Number,
      required: false,
      default: undefined
    }
  },
  emits: ['update:value'],
  setup: (props, { emit }) => {
    const valueInternal = computed({
      get: () => props.value,
      set: (value: number | undefined) => emit('update:value', value ?? undefined)
    })
    const captionAsPlaceholder = computed(() => props.captionMode === 'placeholder')
    const invalid = computed(() => props.required && valueInternal.value == null)

    return {
      captionAsPlaceholder,
      invalid,
      valueInternal
    }
  }
})