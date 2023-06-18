import { computed, defineComponent, PropType } from 'vue'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'
import SortingData from '../../../models/utils/SortingData'
import ArmorOptionHeader from '../armor/ArmorOptionHeaderComponent.vue'
import { ArmorModSortingFunctions } from '../../../services/sorting/functions/ArmorModSortingFunctions'
import { IArmorMod } from '../../../models/item/IArmorMod'

export default defineComponent({
  components: {
    ArmorOptionHeader,
    OptionHeaderSortButton
  },
  props: {
    modelValue: {
      type: Object as PropType<SortingData<IArmorMod>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingData = computed({
      get: () => props.modelValue,
      set: (value: SortingData<IArmorMod>) => emit('update:modelValue', value)
    })

    return {
      sortingData,
      sortingFunctions: ArmorModSortingFunctions
    }
  }
})