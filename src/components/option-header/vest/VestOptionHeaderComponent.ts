import { computed, defineComponent, PropType } from 'vue'
import SortingData from '../../../models/utils/SortingData'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'
import { IVest } from '../../../models/item/IVest'
import { VestSortingFunctions } from '../../../services/sorting/functions/VestSortingFunctions'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    ContainerOptionHeader
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IVest>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IVest>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: VestSortingFunctions
    }
  }
})