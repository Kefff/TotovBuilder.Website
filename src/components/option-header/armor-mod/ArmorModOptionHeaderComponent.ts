import { computed, defineComponent, PropType } from 'vue'
import { IArmorMod } from '../../../models/item/IArmorMod'
import SortingData from '../../../models/utils/SortingData'
import { ArmorModSortingFunctions } from '../../../services/sorting/functions/ArmorModSortingFunctions'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    sortingData: {
      type: Object as PropType<SortingData<IArmorMod>>,
      required: true
    }
  },
  emits: ['update:sorting-data'],
  setup: (props, { emit }) => {
    const sortingDataInternal = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IArmorMod>) => emit('update:sorting-data', value)
    })

    return {
      sortingDataInternal,
      ArmorModSortingFunctions
    }
  }
})