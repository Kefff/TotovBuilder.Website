import { computed, defineComponent, PropType } from 'vue'
import { IBackpack } from '../../../models/item/IBackpack'
import SortingData from '../../../models/utils/SortingData'
import { BackpackSortingFunctions } from '../../../services/sorting/functions/BackpackSortingFunctions'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'
import WearableOptionHeader from '../wearable/WearableOptionHeaderComponent.vue'

export default defineComponent({
  components: {
    ContainerOptionHeader,
    WearableOptionHeader
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IBackpack>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IBackpack>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      BackpackSortingFunctions
    }
  }
})