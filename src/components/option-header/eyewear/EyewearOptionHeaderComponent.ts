import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { EyewearSortingFunctions } from '../../../services/sorting/functions/EyewearSortingFunctions'
import { IEyewear } from '../../../models/item/IEyewear'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IEyewear>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IEyewear>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: EyewearSortingFunctions
    }
  }
})