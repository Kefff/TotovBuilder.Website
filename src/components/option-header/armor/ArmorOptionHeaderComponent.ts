import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { ArmorSortingFunctions } from '../../../services/sorting/functions/ArmorSortingFunctions'
import { SortingService } from '../../../services/sorting/SortingService'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData>,
      required: true
    },
    customSortingService: {
      type: Object as PropType<SortingService>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData) => emit('update:modelValue', value)
    })
    const sortingService = props.customSortingService ?? new SortingService(new ArmorSortingFunctions())

    return { sortingData, sortingService }
  }
})