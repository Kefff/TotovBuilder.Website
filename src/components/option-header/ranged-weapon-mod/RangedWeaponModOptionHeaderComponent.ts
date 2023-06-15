import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import { RangedWeaponModSortingFunctions } from '../../../services/sorting/functions/RangedWeaponModSortingFunctions'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IRangedWeaponMod>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IRangedWeaponMod>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: RangedWeaponModSortingFunctions
    }
  }
})