import { DataTableSortEvent } from 'primevue/datatable'
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import ShoppingListMerchants from '../shopping-list-merchants/ShoppingListMerchantsComponent.vue'
import ShoppingList from '../shopping-list/ShoppingListComponent.vue'

export default defineComponent({
  components: {
    InventoryPrice,
    ShoppingList,
    ShoppingListMerchants
  },
  props: {
    buildsSummaries: {
      type: Array as PropType<IBuildSummary[]>,
      required: true
    },
    selectedBuildIds: {
      type: Array as PropType<string[]>,
      required: false,
      default: () => []
    },
    showNotExported: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['update:selectedBuildIds'],
  setup: (props, { emit }) => {
    const buildPropertiesService = Services.get(BuildPropertiesService)

    const sortField = ref('name')
    const sortOrder = ref(1)
    const selectedBuildSummaries = ref<IBuildSummary[]>([])

    onMounted(() => {
      getSortingData()
      setSelectedBuilds()
    })

    watch(() => props.selectedBuildIds, () => setSelectedBuilds())

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
    function onSort(event: DataTableSortEvent) {
      const websiteConfigurationService = Services.get(WebsiteConfigurationService)
      const sortField = event.sortField as string
      const sortOrder = event.sortOrder as number

      localStorage.setItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey, sortField)
      localStorage.setItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey, sortOrder.toString())
    }

    /**
     * Sets the selected builds.
     */
    function setSelectedBuilds() {
      selectedBuildSummaries.value = props.buildsSummaries.filter((bs) => props.selectedBuildIds.some((mv) => mv === bs.id))
    }

    /**
     * Updates selected build summaries
     */
    function updateSelectedBuildSummaries() {
      const selectedBuildIds = selectedBuildSummaries.value.map((bs) => bs.id)

      emit('update:selectedBuildIds', selectedBuildIds)
    }

    return {
      DisplayValueType,
      getNotExportedTooltip,
      onSort,
      selectedBuildSummaries,
      sortField,
      sortOrder,
      StatsUtils,
      updateSelectedBuildSummaries
    }
  }
})