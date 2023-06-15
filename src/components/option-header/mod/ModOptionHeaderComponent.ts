import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { ModSortingFunctions } from '../../../services/sorting/functions/ModSortingFunctions'
import { IMod } from '../../../models/item/IMod'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IMod>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IMod>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: ModSortingFunctions
    }
  }
})