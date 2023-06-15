import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { HeadwearSortingFunctions } from '../../../services/sorting/functions/HeadwearSortingFunctions'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import { IHeadwear } from '../../../models/item/IHeadwear'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IHeadwear>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IHeadwear>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: HeadwearSortingFunctions
    }
  }
})