import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { MeleeWeaponSortingFunctions } from '../../../services/sorting/functions/MeleeWeaponSortingFunctions'
import { SortingService } from '../../../services/sorting/SortingService'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData) => emit('update:modelValue', value)
    })
    const sortingService = new SortingService([new MeleeWeaponSortingFunctions()])

    return { sortingData, sortingService }
  }
})