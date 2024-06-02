import { computed, defineComponent, PropType } from 'vue'
import { IHeadwear } from '../../../models/item/IHeadwear'
import SortingData from '../../../models/utils/SortingData'
import { HeadwearSortingFunctions } from '../../../services/sorting/functions/HeadwearSortingFunctions'
import ArmorOptionHeader from '../ArmorOptionHeaderComponent.vue'
import OptionHeaderSortButton from '../OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IHeadwear>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IHeadwear>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      HeadwearSortingFunctions
    }
  }
})