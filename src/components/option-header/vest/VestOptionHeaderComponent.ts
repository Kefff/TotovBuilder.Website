import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { VestSortingFunctions } from '../../../services/sorting/functions/VestSortingFunctions'
import { SortingService } from '../../../services/sorting/SortingService'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    ContainerOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData) => emit('update:modelValue', value)
    })
    const sortingService = new SortingService([new VestSortingFunctions()])

    return { sortingData, sortingService }
  }
})