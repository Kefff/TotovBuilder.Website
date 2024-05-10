import { computed, defineComponent, PropType } from 'vue'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import SortingData from '../../../models/utils/SortingData'
import { MeleeWeaponSortingFunctions } from '../../../services/sorting/functions/MeleeWeaponSortingFunctions'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IMeleeWeapon>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IMeleeWeapon>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      MeleeWeaponSortingFunctions
    }
  }
})