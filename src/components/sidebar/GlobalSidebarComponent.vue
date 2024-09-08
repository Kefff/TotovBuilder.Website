<template>
  <Sidebar
    v-model:visible="visible"
    :modal="true"
    position="left"
    style="width: auto;"
  >
    <template #header>
      <div class="global-sidebar-header">
        <div
          v-if="icon != null"
          class="global-sidebar-icon sidebar-title-icon"
        >
          <font-awesome-icon :icon="icon" />
        </div>
        <div class="global-sidebar-title">
          <div
            v-if="title == null"
            class="global-sidebar-spacer"
          />
          <div
            v-else
            class="sidebar-title"
          >
            <span>{{ $t(title) }}</span>
          </div>
          <div v-if="subtitle != null">
            {{ subtitle }}
          </div>
        </div>
      </div>
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
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { BuildSidebarParameters, BuildsShareSideBarParameters, GlobalSidebarComponent, IGlobalSidebarOptions, ShoppingListSidebarParameters, StatsSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'

const BuildsExportSidebar = defineAsyncComponent(() => import('./BuildsExportSidebarComponent.vue'))
const BuildSidebar = defineAsyncComponent(() => import('./BuildSidebarComponent.vue'))
const BuildsImportSidebar = defineAsyncComponent(() => import('./BuildsImportSidebarComponent.vue'))
const BuildsListSidebar = defineAsyncComponent(() => import('./BuildsListSidebarComponent.vue'))
const BuildsShareSideBar = defineAsyncComponent(() => import('./BuildsShareSideBarComponent.vue'))
const ChangelogSidebar = defineAsyncComponent(() => import('./ChangelogSidebarComponent.vue'))
const GeneralOptionsSidebar = defineAsyncComponent(() => import('./GeneralOptionsSidebarComponent.vue'))
const MerchantItemsOptionsSidebar = defineAsyncComponent(() => import('./MerchantItemsOptionsSidebarComponent.vue'))
const NotificationsSidebar = defineAsyncComponent(() => import('./NotificationsSidebarComponent.vue'))
const ShoppingListSidebar = defineAsyncComponent(() => import('./ShoppingListSidebarComponent.vue'))
const StatsSidebar = defineAsyncComponent(() => import('./StatsSidebarComponent.vue'))
const ToolbarSidebar = defineAsyncComponent(() => import('./ToolbarSidebarComponent.vue'))

const props = defineProps<{
  level: number
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)

const icon = ref<string>()
const options = ref<IGlobalSidebarOptions>({} as IGlobalSidebarOptions)
const title = ref<string>()
const subtitle = ref<string>()
const visibleInternal = ref(false)

const displayedComponent = computed(() => getDisplayedComponent(options.value?.displayedComponentType))
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
 * @param openingOptions - Opening options.
 * @param level - Level of the sidebar to open.
 */
function onGlobalSidebarOpen(openingOptions: IGlobalSidebarOptions, level: number) {
  if (level === props.level) {
    visible.value = true
    options.value = openingOptions
  }
}

/**
 * Sets the component to display.
 */
function getDisplayedComponent(displayedComponentType: GlobalSidebarComponent) {
  subtitle.value = undefined

  switch (displayedComponentType) {
    case 'BuildsExportSidebar':
      icon.value = 'download'
      title.value = 'caption.exportBuilds'

      return BuildsExportSidebar
    case 'BuildsShareSideBar':
      icon.value = 'share-alt'
      subtitle.value = getBuildsShareSideBarSubtitle(options.value.displayedComponentParameters as BuildsShareSideBarParameters)
      title.value = 'caption.share'

      return BuildsShareSideBar
    case 'BuildSidebar':
      icon.value = 'ellipsis-h'
      subtitle.value = (options.value.displayedComponentParameters as BuildSidebarParameters).name
      title.value = 'caption.actions'

      return BuildSidebar
    case 'BuildsImportSidebar':
      icon.value = 'file-upload'
      title.value = 'caption.importBuilds'

      return BuildsImportSidebar
    case 'BuildsListSidebar':
      icon.value = 'filter'
      title.value = 'caption.filter'

      return BuildsListSidebar
    case 'ChangelogSidebar':
      icon.value = 'clipboard-list'
      title.value = 'caption.changelog'

      return ChangelogSidebar
    case 'GeneralOptionsSidebar':
      icon.value = 'tv'
      title.value = 'caption.displayOptions'

      return GeneralOptionsSidebar
    case 'MerchantItemsOptionsSidebar':
      icon.value = 'user-tag'
      title.value = 'caption.merchants'

      return MerchantItemsOptionsSidebar
    case 'NotificationsSidebar':
      icon.value = 'bell'
      title.value = 'caption.notifications'

      return NotificationsSidebar
    case 'ShoppingListSidebar':
      icon.value = 'shopping-cart'
      subtitle.value = (options.value.displayedComponentParameters as ShoppingListSidebarParameters).buildName
      title.value = 'caption.shoppingList'

      return ShoppingListSidebar
    case 'StatsSidebar':
      icon.value = 'clipboard-list'
      subtitle.value = (options.value.displayedComponentParameters as StatsSidebarParameters).name
      title.value = 'caption.itemDetails'

      return StatsSidebar
    case 'ToolbarSidebar':
      icon.value = 'bars'
      title.value = 'caption.menu'

      return ToolbarSidebar
    default:
      return undefined
  }
}

/**
 * Gets the subtitle for a builds share sidebar.
 */
function getBuildsShareSideBarSubtitle(parameters: BuildsShareSideBarParameters): string | undefined {
  if (parameters.buildToShare != null) {
    return parameters.buildToShare.name
  }

  return undefined
}
</script>










<style scoped>
@import '../../css/sidebar.css';

.global-sidebar-content {
  margin-top: 1rem;
  max-width: calc(50vw - 1rem - 1rem);
}

.global-sidebar-icon {
  font-size: 1.5rem;
}

.global-sidebar-spacer {
  width: 100%;
}

.global-sidebar-header {
  align-items: center;
  display: flex;
}

.global-sidebar-title {
  width: 100%;
}

/* Smartphone in portrait */
@media only screen and (max-width: 480px) {
  .global-sidebar-content {
    max-width: calc(100vw - 1rem - 1rem);
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .global-sidebar-content {
    max-width: calc(100vw - 1rem - 1rem);
  }
}

/* Tablet in portrait */
@media only screen and (min-width: 768px) and (max-width: 991px) {}

/* Tablet in landscape */
@media only screen and (min-width: 992px) and (max-width: 1299px) {}

/* PC */
@media only screen and (min-width: 1300px) {}
</style>

<style>
.p-sidebar-header {
  margin-bottom: 0.5rem;
}

.p-sidebar-header-content {
  width: 100%;
}
</style>