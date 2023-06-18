import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import WearableOptionHeader from '../wearable/WearableOptionHeaderComponent.vue'
import { IArmor } from '../../../models/item/IArmor'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import { ArmorSortingFunctions } from '../../../services/sorting/functions/ArmorSortingFunctions'

export default defineComponent({
  components: {
    OptionHeaderSortButton,
    WearableOptionHeader
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IArmor>>,
      required: true
    },
    sortingFunctionsOverride: {
      type: Object as PropType<ISortingFunctionList<IArmor>>,
      required: false,
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IArmor>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: props.sortingFunctionsOverride ?? ArmorSortingFunctions
    }
  }
})