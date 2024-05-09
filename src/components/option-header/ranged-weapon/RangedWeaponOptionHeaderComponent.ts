import { computed, defineComponent, PropType } from 'vue'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import SortingData from '../../../models/utils/SortingData'
import { RangedWeaponSortingFunctions } from '../../../services/sorting/functions/RangedWeaponSortingFunctions'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IRangedWeapon>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IRangedWeapon>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      RangedWeaponSortingFunctions
    }
  }
})