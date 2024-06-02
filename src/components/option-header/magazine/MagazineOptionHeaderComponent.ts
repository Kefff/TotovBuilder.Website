import { computed, defineComponent, PropType } from 'vue'
import { IMagazine } from '../../../models/item/IMagazine'
import SortingData from '../../../models/utils/SortingData'
import { MagazineSortingFunctions } from '../../../services/sorting/functions/MagazineSortingFunctions'
import ContainerOptionHeader from '../ContainerOptionHeaderComponent.vue'
import OptionHeaderSortButton from '../OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    ContainerOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IMagazine>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IMagazine>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      MagazineSortingFunctions
    }
  }
})