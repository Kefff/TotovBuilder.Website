import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils from '../../utils/StatsUtils'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'

export default defineComponent({
  components: {
    InventoryPrice
  },
  props: {
    buildsSummaries: {
      type: Array as PropType<IBuildSummary[]>,
      required: true
    },
    modelValue: {
      type: Array as PropType<string[]>,
      required: true
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    showNotExported: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const buildPropertiesService = Services.get(BuildPropertiesService)
    const selectedBuildSummaries = ref<IBuildSummary | IBuildSummary[]>()
    const selectionMode = computed(() => props.multiple ? 'multiple' : 'single')
    const sortField = ref('name')
    const sortOrder = ref(1)

    onMounted(() => {
      getSortingData()
      setSelectedBuilds()
    })

    watch(() => props.modelValue, () => setSelectedBuilds())

    /**
     * Gets the tooltip for not exported builds.
     * @param buildSummary - Build summary.
     * @returns Tooltip.
     */
    function getNotExportedTooltip(buildSummary: IBuildSummary): string {
      if (buildSummary.exported) {
        return ''
      }

      const tooltip = buildPropertiesService.getNotExportedTooltip(buildSummary.lastUpdated, buildSummary.lastExported)

      return tooltip
    }

    /**
     * Gets the sorting data.
     */
    function getSortingData() {
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)

      sortField.value = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
      sortOrder.value = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey)) ?? 1
    }

    /**
     * Saves the last used sorting data.
     * @param event - Sorting event.
     */
    function onSort(event: Record<string, unknown>) {
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      const sortField = event['sortField'] as string
      const sortOrder = event['sortOrder'] as number

      localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, sortField)
      localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, sortOrder.toLocaleString())
    }

    /**
     * Sets the selected builds.
     */
    function setSelectedBuilds() {
      if (props.multiple) {
        if (props.modelValue.length > 0) {
          selectedBuildSummaries.value = props.buildsSummaries.filter((bs) => props.modelValue.some((mv) => mv === bs.id))
        } else {
          selectedBuildSummaries.value = []
        }
      } else if (props.modelValue.length > 0) {
        selectedBuildSummaries.value = props.buildsSummaries[0]
      }
    }

    /**
     * Updates selected build summaries
     */
    function updateSelectedBuildSummaries() {
      emit('update:modelValue', props.multiple
        ? (selectedBuildSummaries.value as IBuildSummary[]).map((bs) => bs.id)
        : [(selectedBuildSummaries.value as IBuildSummary).id])
    }

    return {
      getNotExportedTooltip,
      onSort,
      StatsUtils,
      selectedBuildSummaries,
      selectionMode,
      sortField,
      sortOrder,
      updateSelectedBuildSummaries
    }
  }
})