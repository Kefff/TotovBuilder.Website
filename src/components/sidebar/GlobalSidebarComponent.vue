<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, ref } from 'vue'
import { BuildSidebarParameters, BuildsShareSideBarParameters, GlobalSidebarComponent, GlobalSidebarDisplayedComponentParameters, IGlobalSidebarOptions, ShoppingListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'

const BuildsExportSidebar = defineAsyncComponent(() => import('./BuildsExportSidebarComponent.vue'))
const BuildSidebar = defineAsyncComponent(() => import('./BuildSidebarComponent.vue'))
const BuildsImportSidebar = defineAsyncComponent(() => import('./BuildsImportSidebarComponent.vue'))
const BuildsListSidebar = defineAsyncComponent(() => import('./BuildsListSidebarComponent.vue'))
const BuildsShareSideBar = defineAsyncComponent(() => import('./BuildsShareSideBarComponent.vue'))
const ChangelogSidebar = defineAsyncComponent(() => import('./ChangelogSidebarComponent.vue'))
const GeneralOptionsSidebar = defineAsyncComponent(() => import('./GeneralOptionsSidebarComponent.vue'))
const InventorySlotSelectorSidebar = defineAsyncComponent(() => import('./InventorySlotSelectorSidebarComponent.vue'))
const ItemSelectionSidebar = defineAsyncComponent(() => import('./ItemSelectionSidebarComponent.vue'))
const ItemsListSidebar = defineAsyncComponent(() => import('./ItemsListSidebarComponent.vue'))
const MerchantItemsOptionsSidebar = defineAsyncComponent(() => import('./MerchantItemsOptionsSidebarComponent.vue'))
const NotificationsSidebar = defineAsyncComponent(() => import('./NotificationsSidebarComponent.vue'))
const ShoppingListSidebar = defineAsyncComponent(() => import('./ShoppingListSidebarComponent.vue'))
const StatsSidebar = defineAsyncComponent(() => import('./StatsSidebarComponent.vue'))
const ToolbarSidebar = defineAsyncComponent(() => import('./ToolbarSidebarComponent.vue'))

type DisplayedComponent = typeof BuildsExportSidebar
  | typeof BuildsShareSideBar
  | typeof BuildSidebar
  | typeof BuildsImportSidebar
  | typeof BuildsListSidebar
  | typeof ChangelogSidebar
  | typeof GeneralOptionsSidebar
  | typeof InventorySlotSelectorSidebar
  | typeof ItemSelectionSidebar
  | typeof ItemsListSidebar
  | typeof MerchantItemsOptionsSidebar
  | typeof NotificationsSidebar
  | typeof ShoppingListSidebar
  | typeof StatsSidebar
  | typeof ToolbarSidebar
  | undefined

const props = defineProps<{
  identifier: number
}>()

const _globalSidebarService = Services.get(GlobalSidebarService)

let _displayedComponent: DisplayedComponent | undefined

const visible = computed({
  get: () => visibleInternal.value,
  set: (value: boolean) => {
    visibleInternal.value = value

    if (!visibleInternal.value) {
      onGlobalSidebarClose(options.value.displayedComponentType)
    }
  }
})

const icon = ref<string>()
const options = ref<IGlobalSidebarOptions>({} as IGlobalSidebarOptions)
const title = ref<string>()
const subtitle = ref<string>()
const visibleInternal = ref(false)

onMounted(() => {
  _globalSidebarService.emitter.on(GlobalSidebarService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  _globalSidebarService.emitter.on(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

onUnmounted(() => {
  _globalSidebarService.emitter.off(GlobalSidebarService.closeGlobalSidebarEvent, onGlobalSidebarClose)
  _globalSidebarService.emitter.off(GlobalSidebarService.openGlobalSidebarEvent, onGlobalSidebarOpen)
})

/**
 * Gets the subtitle for a builds share sidebar.
 */
function getBuildsShareSideBarSubtitle(parameters: BuildsShareSideBarParameters): string | undefined {
  if (parameters.buildToShare != null) {
    return parameters.buildToShare.name
  }

  return undefined
}

/**
 * Reacts to the global sidebar being closed.
 *
 * Executes the close action if defined and closes the global sidebar.
 * @param displayedComponentType- Type of component displayed in the global sidebar to close.
 */
function onGlobalSidebarClose(displayedComponentType: GlobalSidebarComponent): void {
  if (displayedComponentType === options.value.displayedComponentType) {
    _globalSidebarService.executeOnCloseActionsAsync(displayedComponentType, options.value.displayedComponentParameters as GlobalSidebarDisplayedComponentParameters)
    visibleInternal.value = false
    _displayedComponent = undefined // Unmounting the displayed component
  }
}

/**
 * Reacts to the global sidebar being opened.
 *
 * Sets the component to display and opens the global sidebar.
 * @param openingOptions - Opening options.
 * @param identifier - Identifier of the sidebar to open.
 */
function onGlobalSidebarOpen(openingOptions: IGlobalSidebarOptions, identifier: number): void {
  if (identifier === props.identifier) {
    visible.value = true
    options.value = openingOptions
    setDisplayedComponent(options.value.displayedComponentType)
  }
}

/**
 * Sets the component to display.
 */
function setDisplayedComponent(displayedComponentType: GlobalSidebarComponent): void {
  subtitle.value = undefined

  switch (displayedComponentType) {
    case 'BuildsExportSidebar':
      icon.value = 'download'
      title.value = 'caption.exportBuilds'
      _displayedComponent = BuildsExportSidebar
      break
    case 'BuildsShareSideBar':
      icon.value = 'share-alt'
      subtitle.value = getBuildsShareSideBarSubtitle(options.value.displayedComponentParameters as BuildsShareSideBarParameters)
      title.value = 'caption.share'
      _displayedComponent = BuildsShareSideBar
      break
    case 'BuildSidebar':
      icon.value = 'ellipsis-h'
      subtitle.value = (options.value.displayedComponentParameters as BuildSidebarParameters).name
      title.value = 'caption.actions'
      _displayedComponent = BuildSidebar
      break
    case 'BuildsImportSidebar':
      icon.value = 'file-upload'
      title.value = 'caption.importBuilds'
      _displayedComponent = BuildsImportSidebar
      break
    case 'BuildsListSidebar':
      icon.value = 'filter'
      title.value = 'caption.filter'
      _displayedComponent = BuildsListSidebar
      break
    case 'ChangelogSidebar':
      icon.value = 'clipboard-list'
      title.value = 'caption.changelog'
      _displayedComponent = ChangelogSidebar
      break
    case 'GeneralOptionsSidebar':
      icon.value = 'tv'
      title.value = 'caption.displayOptions'
      _displayedComponent = GeneralOptionsSidebar
      break
    case 'InventorySlotSelectorSidebar':
      icon.value = 'vest'
      title.value = 'caption.gear'
      _displayedComponent = InventorySlotSelectorSidebar
      break
    case 'ItemSelectionSidebar':
      icon.value = 'filter'
      title.value = 'caption.selectItem'
      _displayedComponent = ItemSelectionSidebar
      break
    case 'ItemsListSidebar':
      icon.value = 'filter'
      title.value = 'caption.filter'
      _displayedComponent = ItemsListSidebar
      break
    case 'MerchantItemsOptionsSidebar':
      icon.value = 'clipboard-list'
      title.value = 'caption.items'
      _displayedComponent = MerchantItemsOptionsSidebar
      break
    case 'NotificationsSidebar':
      icon.value = 'bell'
      title.value = 'caption.notifications'
      _displayedComponent = NotificationsSidebar
      break
    case 'ShoppingListSidebar':
      icon.value = 'shopping-cart'
      subtitle.value = (options.value.displayedComponentParameters as ShoppingListSidebarParameters).buildName
      title.value = 'caption.shoppingList'
      _displayedComponent = ShoppingListSidebar
      break
    case 'StatsSidebar':
      icon.value = 'clipboard-list'
      title.value = 'caption.itemDetails'
      _displayedComponent = StatsSidebar
      break
    case 'ToolbarSidebar':
      icon.value = 'bars'
      title.value = 'caption.menu'
      _displayedComponent = ToolbarSidebar
      break
    default:
      _displayedComponent = undefined
      break
  }
}
</script>










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
        :is="_displayedComponent"
        v-if="_displayedComponent != null"
        v-model:parameters="options.displayedComponentParameters as GlobalSidebarDisplayedComponentParameters"
      />
    </div>
  </sidebar>
</template>










<style scoped>
.global-sidebar-content {
  height: 100%;
  max-width: calc(50vw - 1rem);
  /* -1rem for the left padding of the side bar */
  min-width: calc(480px - 1rem);
  /* -1rem for the left padding of the side bar */
  overflow: auto;
  padding-right: 1rem;
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
    max-width: calc(100vw - 1rem);
    /* -1rem for the left padding of the side bar */
    min-width: unset;
    width: calc(100vw - 1rem);
    /* -1rem for the left padding of the side bar */
  }
}

/* Smartphone in landscape */
@media only screen and (min-width: 481px) and (max-width: 767px) {
  .global-sidebar-content {
    max-width: calc(100vw - 1rem);
    /* -1rem for the left padding of the side bar */
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
.p-sidebar > .p-sidebar-header {
  margin-bottom: 0.5rem;
}

.p-sidebar > .p-sidebar-header > .p-sidebar-header-content {
  width: 100%;
}

.p-sidebar > .p-sidebar-content {
  padding-right: 0;
  /* Right padding managed by the .global-sidebar-content to avoir having the vertical scrollbar above the content */
}
</style>