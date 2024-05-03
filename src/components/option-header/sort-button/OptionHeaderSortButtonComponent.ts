import { computed, defineComponent, PropType } from 'vue'
import Images from '../../../images'
import { IItem } from '../../../models/item/IItem'
import SortingData, { SortingOrder } from '../../../models/utils/SortingData'
import { ISortingFunctionList } from '../../../services/sorting/functions/ISortingFunctionList'
import { SortingService } from '../../../services/sorting/SortingService'
import StringUtils from '../../../utils/StringUtils'

export default defineComponent({
  props: {
    captionResource: {
      type: String,
      required: true
    },
    customIcon: {
      type: String,
      required: false,
      default: undefined
    },
    icon: {
      type: String,
      required: false,
      default: undefined
    },
    modelValue: {
      type: Object as PropType<SortingData<IItem>>,
      required: true
    },
    property: {
      type: String,
      required: true
    },
    sortingFunctions: {
      type: Object as PropType<ISortingFunctionList<IItem>>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingDirectionClass = computed(() => props.modelValue.order === SortingOrder.asc ? 'options-header-sort-button-sort-arrow-down' : 'options-header-sort-button-sort-arrow-up')
    const sortingService = new SortingService(props.sortingFunctions)

    /**
     * Emits to the parent component the updated sorting data.
     * @param property - Property.
     */
    function sortBy(property: string) {
      const sortingData = sortingService.setSortingProperty(property)

      if (sortingData != null) {
        emit('update:modelValue', sortingData)
      }
    }

    return {
      Images,
      sortBy,
      sortingDirectionClass,
      StringUtils
    }
  }
})