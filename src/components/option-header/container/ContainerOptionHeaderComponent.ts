import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { ContainerSortingFunctions } from '../../../services/sorting/functions/ContainerSortingFunctions'
import { IContainer } from '../../../models/item/IContainer'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IContainer>>,
      required: true
    },
    sortingFunctionsOverride: {
      type: Object as PropType<ISortingFunctionList<IContainer>>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IContainer>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: props.sortingFunctionsOverride ?? ContainerSortingFunctions
    }
  }
})