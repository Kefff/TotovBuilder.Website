<template>
  <Sidebar
    v-model:visible="visible"
    :modal="true"
    :position="options?.position"
    style="width: auto;"
  >
    <template #header>
      <div class="global-sidebar-spacer" />
    </template>
    <div class="global-sidebar-content">
      <component
        :is="currentDisplayedComponent"
        v-if="currentDisplayedComponent != null"
        :parameters="options?.displayedComponentParameters"
      />
    </div>
  </sidebar>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { IGlobalSidebarOptions } from '../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import Services from '../services/repository/Services'
import ChangelogSidebar from './ChangelogSidebarComponent.vue'
import GeneralOptionsSidebar from './GeneralOptionsSidebarComponent.vue'
import MerchantItemsOptionsSidebar from './MerchantItemsOptionsSidebarComponent.vue'
import ShoppingListSidebar from './ShoppingListSidebarComponent.vue'

const globalSidebarService = Services.get(GlobalSidebarService)

const displayableComponents: Record<string, unknown> = {
  ChangelogSidebar,
  GeneralOptionsSidebar,
  MerchantItemsOptionsSidebar,
  ShoppingListSidebar
}

const visible = computed({
  get: () => _visible.value,
  set: (value: boolean) => {
    _visible.value = value

    if (!_visible.value) {
      onGlobalSidebarClose()
    }
  }
})
const currentDisplayedComponent = computed(() => displayableComponents[options.value?.displayedComponentType ?? ''])

const _visible = ref(false)
const options = ref<IGlobalSidebarOptions>()

onMounted(() => {
  globalSidebarService.emitter.on(GlobalSidebarService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  globalSidebarService.emitter.on(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

onUnmounted(() => {
  globalSidebarService.emitter.off(GlobalSidebarService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  globalSidebarService.emitter.off(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

/**
 * Closes the global sidebard.
 */
function onGlobalSidebarClose() {
  globalSidebarService.executeOnClosingActions()
  _visible.value = false
}

/**
 * Displays the global sidebar
 */
function onGlobalSidebarOpen(openingOptions: IGlobalSidebarOptions) {
  visible.value = true
  options.value = openingOptions
}
</script>










<style scoped>
.global-sidebar-content {
  max-width: 100vw;
}

.global-sidebar-spacer {
  width: 100%;
}

/* Smartphone in portrait */
@media only screen and (min-width: 320px) and (max-width: 480px) {}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {
  .global-sidebar-content {
    max-width: 50vw;
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .global-sidebar-content {
    max-width: 50vw;
  }
}

/* PC */
@media only screen and (min-width: 1200px) {
  .global-sidebar-content {
    max-width: 50vw;
  }
}
</style>