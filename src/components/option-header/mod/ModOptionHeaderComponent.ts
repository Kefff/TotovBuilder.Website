import { computed, defineComponent, PropType } from 'vue'
import { IMod } from '../../../models/item/IMod'
import SortingData from '../../../models/utils/SortingData'
import { ModSortingFunctions } from '../../../services/sorting/functions/ModSortingFunctions'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IMod>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IMod>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      ModSortingFunctions
    }
  }
})