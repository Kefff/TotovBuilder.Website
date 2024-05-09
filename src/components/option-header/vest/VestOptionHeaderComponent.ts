import { computed, defineComponent, PropType } from 'vue'
import { IVest } from '../../../models/item/IVest'
import SortingData from '../../../models/utils/SortingData'
import { VestSortingFunctions } from '../../../services/sorting/functions/VestSortingFunctions'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    ContainerOptionHeader
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IVest>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IVest>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      VestSortingFunctions
    }
  }
})