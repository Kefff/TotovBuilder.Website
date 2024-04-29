import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import { IItem } from '../../../models/item/IItem'
import SortingData from '../../../models/utils/SortingData'
import { ItemSortingFunctions } from '../../../services/sorting/functions/ItemSortingFunction'
import StringUtils from '../../../utils/StringUtils'
import OptionHeaderSortButton from '../sort-button/OptionHeaderSortButtonComponent.vue'

export default defineComponent({
  components: {
    OptionHeaderSortButton
  },
  props: {
    filter: {
      type: String,
      required: true
    },
    sortingData: {
      type: Object as PropType<SortingData<IItem>>,
      required: true
    },
    useLongestHeaderWidth: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: [
    'update:filter',
    'update:sortingData'
  ],
  setup: (props, { emit }) => {
    const updatableSortingData = computed({
      get: () => props.sortingData,
      set: (value: SortingData<IItem>) => emit('update:sortingData', value)
    })
    const filterInput = ref()
    const filterDelay = 500 // Milliseconds passed without typing before emitting the filter update
    let filterLastEdit = new Date()
    const updatableFilter = ref(props.filter)

    /**
     * Emits to the parent component the filter to use to filter options.
     */
    function onFilterChange() {
      filterLastEdit = new Date()

      // Creating a promise that will check after a delay if the filter has changed.
      // If not, emits the filter to the parent component; otherwise silently rejects the promise.
      new Promise<void>((resolve, reject) => setTimeout(() => {
        const now = new Date()
        const timeSinceLastInput = now.getTime() - filterLastEdit.getTime()

        if (timeSinceLastInput >= filterDelay) {
          resolve()
        } else {
          reject()
        }
      }, filterDelay))
        .then(() => emit('update:filter', updatableFilter.value))
        .catch(() => undefined)
    }

    onMounted(() => {
      // Focus the filter input to be able to type the name of the item.
      // We use a delay because focusing conflicts with the scrolling to the selected item in the dropdown.
      setTimeout(() => filterInput.value.$el.select(), 100)
    })

    return {
      filterInput,
      onFilterChange,
      sortingFunctions: ItemSortingFunctions,
      StringUtils,
      updatableFilter,
      updatableSortingData
    }
  }
})