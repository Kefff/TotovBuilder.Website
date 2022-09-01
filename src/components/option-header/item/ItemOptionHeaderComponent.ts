import { computed, defineComponent, nextTick, onMounted, PropType, ref } from 'vue'
import SortingData from '../../../models/utils/SortingData'
import { ItemSortingFunctions } from '../../../services/sorting/functions/ItemSortingFunction'
import { SortingService } from '../../../services/sorting/SortingService'
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
      type: Object as PropType<SortingData>,
      required: true
    }
  },
  emits: [
    'update:filter',
    'update:sortingData'
  ],
  setup: (props, { emit }) => {
    const updatableSortingData = computed({
      get: () => props.sortingData,
      set: (value: SortingData) => emit('update:sortingData', value)
    })
    const sortingService = new SortingService([new ItemSortingFunctions()])

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
      // Using nextTick() otherwise focus() moves the screen to a completly wrong position for some reason.
      nextTick(() => filterInput.value.$el.select())
    })

    return { filterInput, onFilterChange, sortingService, StringUtils, updatableFilter, updatableSortingData }
  }
})