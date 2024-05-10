import { computed, defineComponent, PropType } from 'vue'
import { IEyewear } from '../../../models/item/IEyewear'
import SortingData from '../../../models/utils/SortingData'
import { EyewearSortingFunctions } from '../../../services/sorting/functions/EyewearSortingFunctions'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IEyewear>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IEyewear>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      EyewearSortingFunctions
    }
  }
})