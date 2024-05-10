import { computed, defineComponent, PropType } from 'vue'
import { IGrenade } from '../../../models/item/IGrenade'
import SortingData from '../../../models/utils/SortingData'
import { GrenadeSortingFunctions } from '../../../services/sorting/functions/GrenadeSortingFunctions'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IGrenade>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IGrenade>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      GrenadeSortingFunctions
    }
  }
})