import { computed, defineComponent, PropType } from 'vue'
import { IContainer } from '../../../models/item/IContainer'
import SortingData from '../../../models/utils/SortingData'
import { ContainerSortingFunctions } from '../../../services/sorting/functions/ContainerSortingFunctions'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IContainer>>,
      required: true
    },
    sortingFunctionsOverride: {
      type: Object as PropType<ISortingFunctionList<IContainer>>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IContainer>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      sortingFunctions: props.sortingFunctionsOverride ?? ContainerSortingFunctions
    }
  }
})