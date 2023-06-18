import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { AmmunitionSortingFunctions } from '../../../services/sorting/functions/AmmunitionSortingFunctions'
import { IAmmunition } from '../../../models/item/IAmmunition'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IAmmunition>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IAmmunition>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: AmmunitionSortingFunctions
    }
  }
})