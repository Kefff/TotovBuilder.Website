import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { GrenadeSortingFunctions } from '../../../services/sorting/functions/GrenadeSortingFunctions'
import { IGrenade } from '../../../models/item/IGrenade'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IGrenade>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IGrenade>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: GrenadeSortingFunctions
    }
  }
})