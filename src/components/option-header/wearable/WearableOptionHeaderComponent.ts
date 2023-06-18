import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { IWearable } from '../../../models/item/IWearable'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import { WearableSortingFunctions } from '../../../services/sorting/functions/WearableSortingFunctions'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IWearable>>,
      required: true
    },
    sortingFunctionsOverride: {
      type: Object as PropType<ISortingFunctionList<IWearable>>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IWearable>) => emit('update:modelValue', value)
    })
    const sortingFunctions = props.sortingFunctionsOverride ?? WearableSortingFunctions

    return {
      sortingData,
      sortingFunctions
    }
  }
})