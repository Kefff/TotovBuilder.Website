import { computed, defineComponent, PropType } from 'vue'
import { IArmor } from '../../../models/item/IArmor'
import SortingData from '../../../models/utils/SortingData'
import { ArmorSortingFunctions } from '../../../services/sorting/functions/ArmorSortingFunctions'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import WearableOptionHeader from '../wearable/WearableOptionHeaderComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton,
    WearableOptionHeader
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IArmor>>,
      required: true
    },
    sortingFunctionsOverride: {
      type: Object as PropType<ISortingFunctionList<IArmor>>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IArmor>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      sortingFunctions: props.sortingFunctionsOverride ?? ArmorSortingFunctions
    }
  }
})