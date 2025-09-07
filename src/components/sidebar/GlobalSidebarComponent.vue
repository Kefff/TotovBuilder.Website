<script setup lang="ts">
import { defineAsyncComponent, onMounted, onUnmounted, provide, ref } from 'vue'
import { IGlobalSidebar } from '../../models/utils/IGlobalSidebar'
import { BuildSidebarParameters, BuildsShareSideBarParameters, GlobalSidebarComponent, GlobalSidebarDisplayedComponentParameters, ShoppingListSidebarParameters } from '../../models/utils/IGlobalSidebarOptions'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import Services from '../../services/repository/Services'
import Loading from '../LoadingComponent.vue'

const props = defineProps<{ sidebar: IGlobalSidebar }>()

const BuildsExportSidebar = defineAsyncComponent({
  loader: () => import('./BuildsExportSidebarComponent.vue'),
  loadingComponent: Loading
})
const BuildSidebar = defineAsyncComponent({
  loader: () => import('./BuildSidebarComponent.vue'),
  loadingComponent: Loading
})
const BuildsImportSidebar = defineAsyncComponent({
  loader: () => import('./BuildsImportSidebarComponent.vue'),
  loadingComponent: Loading
})
const BuildsListSidebar = defineAsyncComponent({
  loader: () => import('./BuildsListSidebarComponent.vue'),
  loadingComponent: Loading
})
const BuildsShareSideBar = defineAsyncComponent({
  loader: () => import('./BuildsShareSideBarComponent.vue'),
  loadingComponent: Loading
})
const ChangelogSidebar = defineAsyncComponent({
  loader: () => import('./ChangelogSidebarComponent.vue'),
  loadingComponent: Loading
})
const GeneralOptionsSidebar = defineAsyncComponent({
  loader: () => import('./GeneralOptionsSidebarComponent.vue'),
  loadingComponent: Loading
})
const InventorySlotSelectorSidebar = defineAsyncComponent({
  loader: () => import('./InventorySlotSelectorSidebarComponent.vue'),
  loadingComponent: Loading
})
const ItemSelectionSidebar = defineAsyncComponent({
  loader: () => import('./ItemSelectionSidebarComponent.vue'),
  loadingComponent: Loading
})
const ItemsListSidebar = defineAsyncComponent({
  loader: () => import('./ItemsListSidebarComponent.vue'),
  loadingComponent: Loading
})
const MerchantItemsOptionsSidebar = defineAsyncComponent({
  loader: () => import('./MerchantItemsOptionsSidebarComponent.vue'),
  loadingComponent: Loading
})
const NotificationsSidebar = defineAsyncComponent({
  loader: () => import('./NotificationsSidebarComponent.vue'),
  loadingComponent: Loading
})
const ShoppingListSidebar = defineAsyncComponent({
  loader: () => import('./ShoppingListSidebarComponent.vue'),
  loadingComponent: Loading
})
const StatsSidebar = defineAsyncComponent({
  loader: () => import('./StatsSidebarComponent.vue'),
  loadingComponent: Loading
})
const ToolbarSidebar = defineAsyncComponent({
  loader: () => import('./ToolbarSidebarComponent.vue'),
  loadingComponent: Loading
})

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

const _globalSidebarService = Services.get(GlobalSidebarService)

let _displayedComponent: DisplayedComponent | undefined

const icon = ref<string>()
const initialized = ref(false)
const parametersInternal = ref<GlobalSidebarDisplayedComponentParameters>()
const subtitle = ref<string>()
const title = ref<string>()
const visible = ref(true)

provide('isInSidebar', true)

onMounted(() => {
  _globalSidebarService.emitter.on(GlobalSidebarService.closingGlobalSidebarEvent, onClosing)

  parametersInternal.value = props.sidebar.options.displayedComponentParameters
  setDisplayedComponent(props.sidebar.options.displayedComponentType)

  initialized.value = true
})

onUnmounted(() => {
  _globalSidebarService.emitter.off(GlobalSidebarService.closingGlobalSidebarEvent, onClosing)
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
 * Executes the close action.
 * @param identifier - Identifier of the sidebar being closed.
 */
function onClosing(identifier: number): void {
  if (identifier === props.sidebar.identifier) {
    visible.value = false
    setTimeout(() => {
      // Waiting for the closing animation of the sidebar to play before really closing it
      _globalSidebarService.executeOnCloseActionsAsync(props.sidebar.identifier, parametersInternal.value)
    }, 500)
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
      subtitle.value = getBuildsShareSideBarSubtitle(props.sidebar.options.displayedComponentParameters as BuildsShareSideBarParameters)
      title.value = 'caption.share'
      _displayedComponent = BuildsShareSideBar
      break
    case 'BuildSidebar':
      icon.value = 'ellipsis-h'
      subtitle.value = (props.sidebar.options.displayedComponentParameters as BuildSidebarParameters).name
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
      icon.value = 'gamepad'
      title.value = 'caption.gameMode'
      _displayedComponent = MerchantItemsOptionsSidebar
      break
    case 'NotificationsSidebar':
      icon.value = 'bell'
      title.value = 'caption.notifications'
      _displayedComponent = NotificationsSidebar
      break
    case 'ShoppingListSidebar':
      icon.value = 'shopping-cart'
      subtitle.value = (props.sidebar.options.displayedComponentParameters as ShoppingListSidebarParameters).buildName
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
    :modal="true"
    :visible="visible"
    position="left"
    style="width: auto;"
    @update:visible="_globalSidebarService.close(sidebar.identifier)"
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
            style="margin-bottom: 0;"
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
        v-if="initialized"
        v-model:parameters="parametersInternal"
        :identifier="sidebar.identifier"
      />
    </div>
  </sidebar>
</template>










<style scoped>
.global-sidebar-content {
  display: flex;
  flex-direction: column;
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
  align-items: center;
  display: flex;
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