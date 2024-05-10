import { computed, defineComponent, PropType } from 'vue'
import { IAmmunition } from '../../../models/item/IAmmunition'
import SortingData from '../../../models/utils/SortingData'
import { AmmunitionSortingFunctions } from '../../../services/sorting/functions/AmmunitionSortingFunctions'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IAmmunition>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IAmmunition>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      sortingFunctions: AmmunitionSortingFunctions
    }
  }
})