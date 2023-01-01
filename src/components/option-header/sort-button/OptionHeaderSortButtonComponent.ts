import { computed, defineComponent, PropType } from 'vue'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import { SortingService } from '../../../services/sorting/SortingService'
import SortingData, { SortingOrder } from '../../../models/utils/SortingData'
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
      type: Object as PropType<SortingData>,
      required: true
    },
    property: {
      type: String,
      required: true
    },
    sortingService: {
      type: Object as PropType<SortingService>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const sortingDirectionClass = computed(() => props.modelValue.order === SortingOrder.asc ? 'options-header-sort-button-sort-arrow-down' : 'options-header-sort-button-sort-arrow-up')

    /**
     * Emits to the parent component the updated sorting data.
     * @param property - Property.
     */
    function sortBy(property: string) {
      // False positive
      // eslint-disable-next-line vue/no-mutating-props
      const sortingDataResult = props.sortingService.setSortingProperty(props.modelValue, property)

      if (!sortingDataResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, sortingDataResult.failureMessage)

        return
      }

      emit('update:modelValue', sortingDataResult.value)
    }

    return {
      sortBy,
      sortingDirectionClass,
      StringUtils
    }
  }
})