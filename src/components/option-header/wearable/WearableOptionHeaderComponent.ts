import { computed, defineComponent, PropType } from 'vue'
import { IWearable } from '../../../models/item/IWearable'
import SortingData from '../../../models/utils/SortingData'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import { WearableSortingFunctions } from '../../../services/sorting/functions/WearableSortingFunctions'
import OptionHeaderSortButton from '../OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IWearable>>,
      required: true
    },
    sortingFunctionsOverride: {
      type: Object as PropType<ISortingFunctionList<IWearable>>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IWearable>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      sortingFunctions: props.sortingFunctionsOverride ?? WearableSortingFunctions
    }
  }
})