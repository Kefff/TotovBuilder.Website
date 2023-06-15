import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { MagazineSortingFunctions } from '../../../services/sorting/functions/MagazineSortingFunctions'
import ContainerOptionHeader from '../container/ContainerOptionHeaderComponent.vue'
import { IMagazine } from '../../../models/item/IMagazine'

export default defineComponent({
  components: {
    ContainerOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IMagazine>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IMagazine>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: MagazineSortingFunctions
    }
  }
})