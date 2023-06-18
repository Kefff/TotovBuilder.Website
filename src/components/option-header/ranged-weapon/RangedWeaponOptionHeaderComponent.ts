import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { RangedWeaponSortingFunctions } from '../../../services/sorting/functions/RangedWeaponSortingFunctions'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IRangedWeapon>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IRangedWeapon>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: RangedWeaponSortingFunctions
    }
  }
})