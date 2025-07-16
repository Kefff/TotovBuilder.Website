<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { IGlobalSidebar } from '../../models/utils/IGlobalSidebar'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import GlobalSidebar from './GlobalSidebarComponent.vue'

const _globalSidebarService = Services.get(GlobalSidebarService)

const displayedSidebars = ref<IGlobalSidebar[]>()

onMounted(() => {
  _globalSidebarService.emitter.on(GlobalSidebarService.closedGlobalSidebarEvent, onSidebarsChanged)
  _globalSidebarService.emitter.on(GlobalSidebarService.openedGlobalSidebarEvent, onSidebarsChanged)
})

onUnmounted(() => {
  _globalSidebarService.emitter.off(GlobalSidebarService.closedGlobalSidebarEvent, onSidebarsChanged)
  _globalSidebarService.emitter.off(GlobalSidebarService.openedGlobalSidebarEvent, onSidebarsChanged)
})

/**
 * Reacts to the list of displayed sidebars changing.
 *
 * Updates the internal list of displayed sidebars.
 */
function onSidebarsChanged(): void {
  const ds: IGlobalSidebar[] = []

  for (const identifier of Object.keys(_globalSidebarService.displayedSidebars)) {
    ds.push(_globalSidebarService.displayedSidebars[Number(identifier)])
  }

  displayedSidebars.value = ds
}
</script>










<template>
  <GlobalSidebar
    v-for="displayedSidebar of displayedSidebars"
    :key="displayedSidebar.identifier"
    :sidebar="displayedSidebar"
  />
</template>