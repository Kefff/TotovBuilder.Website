<template>
  <Sidebar
    v-model:visible="visible"
    :modal="true"
    :position="props.position"
    style="width: auto;"
  >
    <template #header>
      <div class="global-sidebar-spacer" />
    </template>
    <div class="global-sidebar-content">
      <component
        :is="displayedComponent"
        v-if="displayedComponent != null"
        v-model:parameters="options.displayedComponentParameters"
      />
    </div>
  </sidebar>
</template>










<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { GlobalSidebarComponent, GlobalSidebarPosition, IGlobalSidebarOptions } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import BuildSidebarComponent from './BuildSidebarComponent.vue'
import BuildsListSidebar from './BuildsListSidebarComponent.vue'
import ChangelogSidebar from './ChangelogSidebarComponent.vue'
import GeneralOptionsSidebar from './GeneralOptionsSidebarComponent.vue'
import MerchantItemsOptionsSidebar from './MerchantItemsOptionsSidebarComponent.vue'
import NotificationsSidebar from './NotificationsSidebarComponent.vue'
import SaveBuildToFileSidebar from './SaveBuildToFileSidebarComponent.vue'
import ShareBuildSidebar from './ShareBuildSidebarComponent.vue'
import ShoppingListSidebar from './ShoppingListSidebarComponent.vue'
import StatsSidebar from './StatsSidebarComponent.vue'

const props = defineProps<{
  position: GlobalSidebarPosition
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const options = ref<IGlobalSidebarOptions>({} as IGlobalSidebarOptions)
let visibleInternal = ref(false)

const displayedComponent = computed(() => {
  switch (options.value?.displayedComponentType) {
    case 'BuildsListSidebar':
      return BuildsListSidebar
    case 'BuildSidebar':
      return BuildSidebarComponent
    case 'ChangelogSidebar':
      return ChangelogSidebar
    case 'GeneralOptionsSidebar':
      return GeneralOptionsSidebar
    case 'MerchantItemsOptionsSidebar':
      return MerchantItemsOptionsSidebar
    case 'NotificationsSidebar':
      return NotificationsSidebar
    case 'SaveBuildToFileSidebar':
      return SaveBuildToFileSidebar
    case 'ShareBuildSidebar':
      return ShareBuildSidebar
    case 'ShoppingListSidebar':
      return ShoppingListSidebar
    case 'StatsSidebar':
      return StatsSidebar
    default:
      return undefined
  }
})
const visible = computed({
  get: () => visibleInternal.value,
  set: (value: boolean) => {
    visibleInternal.value = value

    if (!visibleInternal.value) {
      onGlobalSidebarClose(options.value.displayedComponentType)
    }
  }
})

onMounted(() => {
  _globalSidebarService.emitter.on(GlobalSidebarService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  _globalSidebarService.emitter.on(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

onUnmounted(() => {
  _globalSidebarService.emitter.off(GlobalSidebarService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  _globalSidebarService.emitter.off(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

/**
 * Reacts to the global sidebar being closed.
 *
 * Executes the close action if defined and closes the global sidebar.
 * @param displayedComponentType- Type of component displayed in the global sidebar to close.
 */
function onGlobalSidebarClose(displayedComponentType: GlobalSidebarComponent) {
  if (displayedComponentType === options.value.displayedComponentType) {
    Services.get(GlobalSidebarService).executeOnCloseActions(displayedComponentType, options.value.displayedComponentParameters)
    visibleInternal.value = false
  }
}

/**
 * Reacts to the global sidebar being opened.
 *
 * Sets the component to display and opens the global sidebar.
 */
function onGlobalSidebarOpen(openingOptions: IGlobalSidebarOptions) {
  if (openingOptions.position === props.position) {
    visible.value = true
    options.value = openingOptions
  }
}
</script>










<style scoped>
.global-sidebar-content {
  max-width: calc(100vw - 1rem - 1rem);
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
    max-width: calc(50vw - 1rem - 1rem);
  }
}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1199px) {
  .global-sidebar-content {
    max-width: calc(50vw - 1rem - 1rem);
  }
}

/* PC */
@media only screen and (min-width: 1200px) {
  .global-sidebar-content {
    max-width: calc(50vw - 1rem - 1rem);
  }
}
</style>