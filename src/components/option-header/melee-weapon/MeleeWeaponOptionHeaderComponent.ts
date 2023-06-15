import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { MeleeWeaponSortingFunctions } from '../../../services/sorting/functions/MeleeWeaponSortingFunctions'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IMeleeWeapon>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IMeleeWeapon>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: MeleeWeaponSortingFunctions
    }
  }
})