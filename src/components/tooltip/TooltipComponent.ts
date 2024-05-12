import { PropType, computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    position: {
      type: String as PropType<'bottom' | 'left' | 'right' | 'top'>,
      required: false,
      default: 'top'
    },
    tooltip: {
      type: String,
      required: true
    }
  },
  setup: (props) => {
    // cf. https://stackoverflow.com/a/63666289
    const isTouchScreen = matchMedia('(hover: none)').matches

    // cf. https://github.com/primefaces/primevue/issues/2255#issuecomment-1073903453
    const directiveArguments = computed(() => new DirectiveArguments(props.position, isTouchScreen ? 'focus' : undefined))

    return {
      directiveArguments,
      isTouchScreen
    }
  }
})

class DirectiveArguments {
  event: 'focus' | undefined
  position: 'bottom' | 'left' | 'right' | 'top'

  constructor(position: 'bottom' | 'left' | 'right' | 'top', event: 'focus' | undefined) {
    this.event = event
    this.position = position
  }
}