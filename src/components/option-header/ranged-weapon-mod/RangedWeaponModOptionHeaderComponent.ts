import { computed, defineComponent, PropType } from 'vue'
import { IRangedWeaponMod } from '../../../models/item/IRangedWeaponMod'
import SortingData from '../../../models/utils/SortingData'
import { RangedWeaponModSortingFunctions } from '../../../services/sorting/functions/RangedWeaponModSortingFunctions'
import OptionHeaderSortButton from '../OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IRangedWeaponMod>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IRangedWeaponMod>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      RangedWeaponModSortingFunctions
    }
  }
})