import { computed, defineComponent, PropType } from 'vue'
import SortingData from '../../../models/utils/SortingData'
import WearableOptionHeader from '../wearable/WearableOptionHeaderComponent.vue'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'
import { IBackpack } from '../../../models/item/IBackpack'
import { BackpackSortingFunctions } from '../../../services/sorting/functions/BackpackSortingFunctions'

export default defineComponent({
  components: {
    ContainerOptionHeader,
    WearableOptionHeader
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IBackpack>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IBackpack>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: BackpackSortingFunctions
    }
  }
})