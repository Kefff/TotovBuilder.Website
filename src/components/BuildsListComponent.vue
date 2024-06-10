<template>
  <div class="builds-list">
    <BuildCard
      v-for="buildSummary of buildSummaries"
      :key="buildSummary.id"
      :is-selected="isSelected(buildSummary.id)"
      :build-summary="buildSummary"
      :show-not-exported="showNotExported"
      @update:is-selected="updatedSelectedBuilds(buildSummary.id, $event)"
    />
  </div>
</template>










<script setup lang="ts">
import { DataTableSortEvent } from 'primevue/datatable'
import { onMounted, ref } from 'vue'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { WebsiteConfigurationService } from '../services/WebsiteConfigurationService'
import Services from '../services/repository/Services'
import BuildCard from './BuildCardComponent.vue'

const modelSelectedBuildIds = defineModel<string[]>('selectedBuildIds', { required: false, default: [] })

defineProps<{
  buildSummaries: IBuildSummary[],
  showNotExported: boolean
}>()

const sortField = ref('name')
const sortOrder = ref(1)

onMounted(() => {
  getSortingData()
})

/**
 * Gets the sorting data.
 */
function getSortingData() {
  const websiteConfigurationService = Services.get(WebsiteConfigurationService)

  sortField.value = localStorage.getItem(websiteConfigurationService.configuration.buildsSortFieldStorageKey) ?? 'name'
  sortOrder.value = Number(localStorage.getItem(websiteConfigurationService.configuration.buildsSortOrderStorageKey)) ?? 1
}

function isSelected(buildId: string) {
  const isSelected = modelSelectedBuildIds.value.some(sbi => sbi === buildId)

  return isSelected
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
 * Updates the list of selected build IDs.
 * @param buildId - ID of the build.
 * @param value - Selection value.
 */
function updatedSelectedBuilds(buildId: string, value: boolean) {
  if (value) {
    modelSelectedBuildIds.value = [
      ...modelSelectedBuildIds.value,
      buildId
    ]
  } else {
    modelSelectedBuildIds.value = modelSelectedBuildIds.value.filter(sbi => sbi !== buildId)
  }
}
</script>










<style scoped>
.builds-list {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

/* Smartphone in portrait */
@media only screen and (min-width: 320px) and (max-width: 480px) {
  .builds-list {
    grid-template-columns: 1fr;
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .builds-list {
    grid-template-columns: 1fr;
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .builds-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1199px) {}

/* PC */
@media only screen and (min-width: 1200px) {}
</style>