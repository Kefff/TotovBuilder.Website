import { DataTableSortEvent } from 'primevue/datatable'
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IShoppingListItem } from '../../models/build/IShoppingListItem'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import { WebsiteConfigurationService } from '../../services/WebsiteConfigurationService'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import ItemIcon from '../item-icon/ItemIconComponent.vue'
import Tooltip from '../tooltip/TooltipComponent.vue'

export default defineComponent({
  components: {
    InventoryPrice,
    ItemIcon,
    Tooltip
  },
  props: {
    buildSummaries: {
      type: Array as PropType<IBuildSummary[]>,
      required: true
    },
    selectedBuildSummaries: {
      type: Array as PropType<IBuildSummary[]>,
      required: false,
      default: () => []
    },
    showNotExported: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  emits: ['update:selected-build-summaries'],
  setup: (props, { emit }) => {
    const buildPropertiesService = Services.get(BuildPropertiesService)

    const selectedBuildSummariesInternal = computed({
      get: () => props.selectedBuildSummaries,
      set: (value: IBuildSummary[]) => emit('update:selected-build-summaries', value)
    })

    const buildsItemsInInventorySlot = ref<IShoppingListItem[][]>([])
    const sortField = ref('name')
    const sortOrder = ref(1)

    onMounted(() => {
      getSortingData()
      getBuildsItemsInInventorySlot()
    })

    watch(() => props.buildSummaries.length, () => {
      getBuildsItemsInInventorySlot()
    })

    /**
     * Gets the items of each build that are in an inventory slot.
     */
    function getBuildsItemsInInventorySlot() {
      const buildsItems: IShoppingListItem[][] = []
      for (const buildSummary of props.buildSummaries) {
        const buildItems = buildSummary.shoppingList.filter(sli => sli.inventorySlotId != null)
        buildsItems.push(buildItems)
      }

      buildsItemsInInventorySlot.value = buildsItems
    }

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
     * Displays the shopping list for the specified build.
     * @param buildSummary - Summary of the build.
     */
    function displayShoppingList(shoppingList: IShoppingListItem[]) {
      Services.get(GlobalSidebarService).display({
        displayedComponentType: 'ShoppingListSidebar',
        displayedComponentParameters: shoppingList,
        position: 'left'
      })
    }

    return {
      buildsItemsInInventorySlot,
      displayShoppingList,
      DisplayValueType,
      getNotExportedTooltip,
      onSort,
      selectedBuildSummariesInternal,
      sortField,
      sortOrder,
      StatsUtils
    }
  }
})