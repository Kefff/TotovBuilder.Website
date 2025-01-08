<script setup lang="ts">
import { useBreakpoints, useEventListener } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, provide, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IBuild } from '../models/build/IBuild'
import { IInventorySlot } from '../models/build/IInventorySlot'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { IGeneralOptionsGroup } from '../models/utils/IGeneralOptionsGroup'
import { IToolbarButton } from '../models/utils/IToolbarButton'
import vueI18n from '../plugins/vueI18n'
import { BuildPropertiesService } from '../services/BuildPropertiesService'
import { BuildService } from '../services/BuildService'
import { CompatibilityRequest } from '../services/compatibility/CompatibilityRequest'
import { CompatibilityRequestType } from '../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../services/compatibility/CompatibilityService'
import { BuildComponentService } from '../services/components/BuildComponentService'
import { ExportService } from '../services/ExportService'
import { GlobalFilterService } from '../services/GlobalFilterService'
import { GlobalSidebarService } from '../services/GlobalSidebarService'
import { ItemService } from '../services/ItemService'
import { ServiceInitializationState } from '../services/repository/ServiceInitializationState'
import Services from '../services/repository/Services'
import { PathUtils } from '../utils/PathUtils'
import WebBrowserUtils from '../utils/WebBrowserUtils'
import BuildSummary from './BuildSummaryComponent.vue'
import InputTextField from './InputTextFieldComponent.vue'
import InventorySlot from './InventorySlotComponent.vue'
import Loading from './LoadingComponent.vue'
import NotificationButton from './NotificationButtonComponent.vue'
import Sticky from './StickyComponent.vue'
import Toolbar from './ToolbarComponent.vue'
import Tooltip from './TooltipComponent.vue'

const route = useRoute()
const router = useRouter()

const _buildComponentService = Services.get(BuildComponentService)
const _buildPropertiesService = Services.get(BuildPropertiesService)
const _compatibilityService = Services.get(CompatibilityService)
const _globalFilterService = Services.get(GlobalFilterService)
const _globalSidebarService = Services.get(GlobalSidebarService)
const _itemService = Services.get(ItemService)

const _compactBuildSummaryExpansionAnimationLenght = 500
const _compactBuildSummaryExpansionAnimationLenghtCss = `${_compactBuildSummaryExpansionAnimationLenght}ms`
const _inventorySlotPathPrefix = PathUtils.inventorySlotPrefix
let _isCompactSummaryExpanding = false
let _originalBuild: IBuild
const _toolbarButtons: IToolbarButton[] = [
  {
    action: goToBuilds,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.backToBuilds'),
    followedBySeparation: true,
    icon: () => 'arrow-left',
    isDisabled: () => isEditing.value,
    isVisible: () => !isEditing.value,
    name: 'backToBuilds',
    showCaption: () => 'never',
    style: () => 'discreet',
    tooltipPosition: () => 'right'
  },
  {
    action: startEdit,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.edit'),
    icon: () => 'edit',
    isDisabled: () => isLoading.value,
    isVisible: () => !isEditing.value,
    name: 'edit',
    showCaption: () => 'always'
  },
  {
    action: saveAsync,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.save'),
    icon: () => 'save',
    isDisabled: () => invalid.value,
    isVisible: () => isEditing.value,
    name: 'save',
    variant: () => 'success',
    showCaption: () => 'always'
  },
  {
    action: displayShoppingList,
    caption: () => vueI18n.t('caption.shoppingList'),
    icon: () => 'shopping-cart',
    isDisabled: () => summary.value.shoppingList.length === 0,
    name: 'shoppingList',
    style: () => 'outlined'
  },
  {
    action: displayBuildsShareSideBar,
    caption: () => vueI18n.t('caption.share'),
    icon: () => 'share-alt',
    isDisabled: () => isLoading.value,
    isVisible: () => !isEditing.value,
    name: 'share',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: exportBuildAsync,
    caption: () => vueI18n.t('caption.export'),
    icon: () => 'download',
    isDisabled: () => isLoading.value,
    isVisible: () => !isEditing.value,
    name: 'export',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: copy,
    caption: () => vueI18n.t('caption.copyBuild'),
    icon: () => 'copy',
    isDisabled: () => isLoading.value,
    isVisible: () => !isEditing.value,
    name: 'copy',
    showCaption: () => 'never',
    style: () => 'discreet'
  },
  {
    action: cancelEdit,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.cancel'),
    icon: () => 'undo',
    isVisible: () => isEditing.value,
    name: 'cancel',
    position: () => 'left',
    style: () => 'outlined',
    variant: () => 'danger'
  },
  {
    action: startDelete,
    caption: () => vueI18n.t('caption.delete'),
    icon: () => 'trash',
    isDisabled: () => isLoading.value,
    isVisible: () => !isEditing.value,
    name: 'delete',
    position: () => 'left',
    showCaption: () => 'never',
    style: () => 'outlined',
    variant: () => 'danger'
  },
  {
    action: displayMerchantItemsOptions,
    caption: () => vueI18n.t('caption.merchants'),
    icon: () => 'user-tag',
    isDisabled: () => isLoading.value,
    name: 'merchantItemsOptions',
    position: () => 'right',
    style: () => 'outlined'
  },
  {
    action: displayGeneralOptions,
    caption: () => vueI18n.t('caption.options'),
    icon: () => 'cog',
    name: 'generalOptions',
    position: () => 'right',
    showCaption: () => 'never',
    style: () => 'discreet'
  }
]

const breakpoints = useBreakpoints(WebBrowserUtils.breakpoints)
const invalid = computed(() => build.value.name === '')
const isEmpty = computed(() => !build.value.inventorySlots.some(is => is.items.some(i => i != null)))
const isNewBuild = computed(() => build.value.id === '')
const notExportedTooltip = computed(() => !summary.value.exported ? _buildPropertiesService.getNotExportedTooltip(summary.value.lastUpdated, summary.value.lastExported) : '')
const path = computed(() => PathUtils.buildPrefix + (isNewBuild.value ? PathUtils.newBuild : build.value.id))
const toolbarContainer = computed(() => buildToolbar.value?.container)

const build = ref<IBuild>({
  id: route.params['id'] as string ?? '',
  inventorySlots: [],
  lastExported: undefined,
  lastUpdated: undefined,
  lastWebsiteVersion: undefined,
  name: ''
})
const buildToolbar = useTemplateRef('buildToolbar')
const compactBuildSummary = useTemplateRef('compactBuildSummary')
const compactBuildSummaryHeight = ref<string>()
const collapseStatuses = ref<boolean[]>([])
const confirmationDialogCancelButtonAction = ref<() => void | Promise<void>>()
const confirmationDialogCancelButtonCaption = ref<string>()
const confirmationDialogCancelButtonOutlined = ref(false)
const confirmationDialogConfirmButtonAction = ref<() => void | Promise<void>>()
const confirmationDialogConfirmButtonCaption = ref<string>()
const confirmationDialogConfirmButtonOutlined = ref(false)
const confirmationDialogIsDisplayed = ref(false)
const confirmationDialogMessage = ref<string>()
const generalOptionsSidebarVisible = ref(false)
const isBuildSummaryStickied = ref(false)
const isCompactMode = breakpoints.smaller('tabletLandscape')
const isCompactBuildSummaryExpanded = ref(isCompactMode.value)
const isEditing = ref(false)
const isLoading = ref(true)
const summary = ref<IBuildSummary>({
  armorModifiers: {
    armorClass: 0,
    durability: 0
  },
  ergonomics: 0,
  exported: false,
  id: build.value.id,
  name: build.value.name,
  lastExported: undefined,
  lastUpdated: new Date(),
  price: {
    missingPrice: false,
    priceInMainCurrency: 0,
    priceByCurrency: []
  },
  recoil: {
    horizontalRecoil: 0,
    verticalRecoil: 0
  },
  shoppingList: [],
  wearableModifiers: {
    ergonomicsModifierPercentage: 0,
    movementSpeedModifierPercentage: 0,
    turningSpeedModifierPercentage: 0
  },
  weight: 0
})

useEventListener(document, 'keydown', onKeyDownAsync)

provide('isEditing', isEditing)

onMounted(() => {
  _compatibilityService.emitter.on(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
  _compatibilityService.emitter.on(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
  _compatibilityService.emitter.on(CompatibilityRequestType.mod, onModCompatibilityRequest)
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

  isEditing.value = isNewBuild.value

  if (_itemService.initializationState === ServiceInitializationState.initializing) {
    _itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServiceInitializedAsync)
  } else {
    onItemServiceInitializedAsync()
  }

  window.onbeforeunload = (): string | undefined => {
    if (isEditing.value) {
      // Confirmation message before closing a tab or the browser
      return ''
    }

    return undefined
  }
})

onUnmounted(() => {
  _compatibilityService.emitter.off(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
  _compatibilityService.emitter.off(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
  _compatibilityService.emitter.off(CompatibilityRequestType.mod, onModCompatibilityRequest)
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
})

watch(() => route.params, onItemServiceInitializedAsync)

/**
 * Cancels modifications and stops edit mode.
 */
function cancelEdit(): void {
  isEditing.value = false

  if (isNewBuild.value) {
    goToBuilds()
  } else {
    build.value = _originalBuild
    setSummaryAsync()
  }
}

/**
 * Collapses all the inventory slots.
 */
function collapseAll(): void {
  generalOptionsSidebarVisible.value = false

  for (let i = 0; i < collapseStatuses.value.length; i++) {
    collapseStatuses.value[i] = true
  }

  _globalSidebarService.close('GeneralOptionsSidebar')
}

/**
 * Creates a copy of the current build.
 */
function copy(): void {
  build.value.id = ''
  build.value.name = build.value.name + ' - ' + vueI18n.t('caption.copy')
  startEdit()

  // Scrolling to the top in case we were at the bottom of the page
  document.getElementById('app')!.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Displays the general options.
 */
function displayGeneralOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'GeneralOptionsSidebar',
    displayedComponentParameters: [
      {
        caption: 'caption.displayOptions',
        icon: '',
        name: 'display-options',
        options: [
          {
            caption: 'caption.collapseAll',
            icon: 'minus-square',
            onClick: collapseAll
          },
          {
            caption: 'caption.expandWithItem',
            icon: 'search-plus',
            onClick: expandWithItem
          },
          {
            caption: 'caption.expandAll',
            icon: 'plus-square',
            onClick: expandAll
          }
        ]
      }
    ] as IGeneralOptionsGroup[]
  })
}

/**
 * Displays the share build sidebar.
 */
function displayBuildsShareSideBar(): void {
  _globalSidebarService.display({
    displayedComponentParameters: {
      buildToShare: build.value
    },
    displayedComponentType: 'BuildsShareSideBar'
  })
}

/**
 * Displays a confirmation dialog.
 * @param message - Message to display in the dialog.
 * @param confirmButtonCaption - Confirm button caption.
 * @param confirmButtonAction - Confirm button action.
 * @param confirmationButtonOutlined - Indicates whether the confirmation button is outlined.
 * @param cancelButtonCaption - Cancel button caption.
 * @param cancelButtonAction - Cancel button action.
 * @param cancelButtonOutlined - Indicates whether the cancel button is outlined.
 */
function displayConfirmationDialog(
  message: string,
  confirmButtonCaption: string,
  confirmButtonAction: () => void | Promise<void>,
  confirmationButtonOutlined: boolean,
  cancelButtonCaption: string,
  cancelButtonAction: () => void | Promise<void>,
  cancelButtonOutlined: boolean): void {
  confirmationDialogCancelButtonAction.value = async (): Promise<void> => {
    await cancelButtonAction()
    confirmationDialogIsDisplayed.value = false
  }
  confirmationDialogCancelButtonCaption.value = cancelButtonCaption
  confirmationDialogCancelButtonOutlined.value = cancelButtonOutlined

  confirmationDialogConfirmButtonAction.value = async (): Promise<void> => {
    await confirmButtonAction()
    confirmationDialogIsDisplayed.value = false
  }
  confirmationDialogConfirmButtonCaption.value = confirmButtonCaption
  confirmationDialogConfirmButtonOutlined.value = confirmationButtonOutlined

  confirmationDialogMessage.value = message
  confirmationDialogIsDisplayed.value = true
}

/**
 * Displays the merchant items options.
 */
function displayMerchantItemsOptions(): void {
  _globalSidebarService.display({
    displayedComponentType: 'MerchantItemsOptionsSidebar'
  })
}

/**
 * Displays the shopping list.
 */
function displayShoppingList(): void {
  _globalSidebarService.display({
    displayedComponentParameters: {
      buildName: summary.value.name,
      shoppingList: summary.value.shoppingList
    },
    displayedComponentType: 'ShoppingListSidebar'
  })
}

/**
 * Expands all the inventory slots.
 */
function expandAll(): void {
  generalOptionsSidebarVisible.value = false

  for (let i = 0; i < collapseStatuses.value.length; i++) {
    collapseStatuses.value[i] = false
  }

  _globalSidebarService.close('GeneralOptionsSidebar')
}

/**
 * Expands the inventory slots containing an item.
 */
function expandWithItem(): void {
  generalOptionsSidebarVisible.value = false

  for (let i = 0; i < collapseStatuses.value.length; i++) {
    if (build.value.inventorySlots[i].items.filter(i => i != null).length > 0) {
      collapseStatuses.value[i] = false
    }
  }

  _globalSidebarService.close('GeneralOptionsSidebar')
}

/**
 * Exports the build.
 */
async function exportBuildAsync(): Promise<void> {
  if (isEditing.value || isNewBuild.value) {
    return
  }

  await Services.get(ExportService).exportAsync([build.value])
}

/**
 * Gets a shared build from an encoded string that can be shared in a URL.
 * @param sharableString - Encoded string that can be shared in a URL.
 */
async function getSharedBuildAsync(sharableString: string): Promise<void> {
  const sharedBuild = await Services.get(BuildService).fromSharableStringAsync(sharableString)

  if (sharedBuild == null) {
    goToBuilds()

    return
  }

  build.value = sharedBuild
}

/**
 * Redirects to the builds page.
 */
function goToBuilds(): void {
  router.push({ name: 'Builds' })
}

/**
 * Reacts to an armor compatibility check request.
 *
 * Checks whether an armor can be added to the build or not.
 * @param request - Compatibility request.
 */
function onArmorCompatibilityRequest(request: CompatibilityRequest): void {
  request.setResult(_buildPropertiesService.canAddArmorAsync(build.value, request.path))
}

/**
 * Reacts to an inventory item being changed.
 *
 * Signals to the build one of its inventory slots has changed.
 */
function onInventorySlotChanged(index: number, newInventorySlot: IInventorySlot): void {
  build.value.inventorySlots[index] = newInventorySlot

  setSummaryAsync()
}

/**
 * Reacts to the item service being initialized.
 *
 * Initializes the build.
 */
async function onItemServiceInitializedAsync(): Promise<void> {
  isLoading.value = true

  if (route.name === 'CopyBuild') {
    build.value = _buildComponentService.getBuild(route.params['id'] as string)
    copy()
  } else if (route.name === 'ShareBuild') {
    const sharableString = route.params['sharedBuild'] as string

    await getSharedBuildAsync(sharableString)
    expandAll()
  } else {
    build.value = _buildComponentService.getBuild(route.params['id'] as string)
  }

  setSummaryAsync()

  nextTick(() => isLoading.value = false)
}

/**
 * Reacts to a keyboard event.
 * @param event - Keyboard event.
 */
async function onKeyDownAsync(event: KeyboardEvent): Promise<void> {
  if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault() // Prevents the browser save action to be triggered

    if (isEditing.value && !invalid.value) {
      await saveAsync()
      startEdit() // After saving with the shortcut, we stay in edit mode unlike when using the button
    }
  }
}

/**
 * Reacts to a change of the toolbar sticky status.
 *
 * Toogles the compact build summary.
 * @param isStickied - Indicates whether the toolbar is stickied.
 */
function onToolbarIsStickiedChanged(isStickied: boolean): void {
  if (!isCompactMode.value) {
    return
  }

  if (isCompactBuildSummaryExpanded.value
    && isStickied) {
    toggleCompactBuildSummaryAsync()
  }
}

/**
 * Reacts to the merchant filter being changed.
 *
 * Updates the build summary price to reflect the change in merchant filters.
 */
function onMerchantFilterChanged(): void {
  setSummaryAsync()
}

/**
 * Reacts to a mod compatibility check request.
 *
 * Checks if a mod can be added to the selected item.
 * @param request - Compatibility request that must be resolved.
 */
function onModCompatibilityRequest(request: CompatibilityRequest): void {
  request.setResult(_buildPropertiesService.canAddModAsync(build.value, request.itemId, request.path))
}

/**
 * Reacts to a tactical rig compatibility check request.
 *
 * Checks whether a tactical rig can be added to the build or not.
 * @param request - Compatibility request.
 */
function onTacticalRigCompatibilityRequest(request: CompatibilityRequest): void {
  request.setResult(_buildPropertiesService.canAddVestAsync(build.value, request.itemId, request.path))
}

/**
 * Deletes the build.
 */
function remove(): void {
  _buildComponentService.deleteBuild(router, build.value)
}

/**
 * Saves the build.
 */
async function saveAsync(): Promise<void> {
  isLoading.value = true
  await _buildComponentService.saveBuildAsync(router, build.value)

  nextTick(() => {
    isLoading.value = false
    isEditing.value = false
  })
}

/**
 * Sets the values of the summary of the content of the build.
 */
async function setSummaryAsync(): Promise<void> {
  if (build.value == null) {
    return
  }

  summary.value = await _buildPropertiesService.getSummaryAsync(build.value)
}

/**
 * Displays the deletion confirmation dialog.
 */
function startDelete(): void {
  displayConfirmationDialog(
    vueI18n.t('message.confirmDeleteBuild', { name: build.value.name }),
    vueI18n.t('caption.delete'),
    remove,
    false,
    vueI18n.t('caption.cancel'),
    () => { },
    true)
}

/**
 * Starts the edit mode.
 */
function startEdit(): void {
  isEditing.value = true

  // Creating a copy without reference of the build in its original state
  const originalBuildResult = Services.get(BuildService).parse(build.value.id, JSON.stringify(build.value))

  if (originalBuildResult != null) {
    _originalBuild = originalBuildResult
  }
}

/**
 * Toggles the visibility of the compact build summary.
 */
async function toggleCompactBuildSummaryAsync(): Promise<void> {
  if (_isCompactSummaryExpanding) {
    return
  }

  _isCompactSummaryExpanding = true

  if (isCompactBuildSummaryExpanded.value) {
    const compactBuildSummaryBoundingRectangle = compactBuildSummary.value?.getBoundingClientRect()
    compactBuildSummaryHeight.value = `${compactBuildSummaryBoundingRectangle!.height}px` /* https://stackoverflow.com/a/72698222 */

    await nextTick() // nextTick required here otherwise the collapse animation does not play the first time
  }

  isCompactBuildSummaryExpanded.value = !isCompactBuildSummaryExpanded.value
  setTimeout(() => _isCompactSummaryExpanding = false, _compactBuildSummaryExpansionAnimationLenght) // Prevents toggleCompactBuildSummary from being called during the animation to avoid weird behaviors
}
</script>










<template>
  <div class="build">
    <Toolbar
      ref="buildToolbar"
      :buttons="_toolbarButtons"
      class="build-toolbar"
      @is-stickied="onToolbarIsStickiedChanged($event)"
    >
      <template #center>
        <div
          v-if="!isCompactMode"
          class="build-title"
        >
          <div v-show="!isEditing">
            {{ build.name }}
          </div>
          <InputTextField
            v-show="!isLoading && isEditing"
            v-model:value="build.name"
            :caption="$t('caption.name')"
            :centered="true"
            :required="true"
            caption-mode="placeholder"
            class="build-name"
          />
          <Tooltip
            v-if="!isLoading && !summary.exported && !isNewBuild"
            :tooltip="notExportedTooltip"
          >
            <font-awesome-icon
              icon="exclamation-triangle"
              class="build-not-exported"
            />
          </Tooltip>
        </div>
      </template>
      <template #right>
        <NotificationButton />
      </template>
      <template #bottom>
        <Transition
          v-if="!isLoading && isCompactMode"
          name="build-compact-summary-expand"
        >
          <div
            v-show="isCompactBuildSummaryExpanded"
            ref="compactBuildSummary"
          >
            <div class="build-title build-title-compact">
              <div v-show="!isEditing">
                {{ build.name }}
              </div>
              <InputTextField
                v-show="!isLoading && isEditing"
                v-model:value="build.name"
                :caption="$t('caption.name')"
                :centered="true"
                :required="true"
                caption-mode="placeholder"
                class="build-name"
              />
              <Tooltip
                v-if="!summary.exported && !isNewBuild"
                :tooltip="notExportedTooltip"
              >
                <font-awesome-icon
                  icon="exclamation-triangle"
                  class="build-not-exported"
                />
              </Tooltip>
            </div>
            <BuildSummary
              :is-compact-mode="true"
              :is-loading="isLoading"
              :summary="summary"
            />
          </div>
        </Transition>
      </template>
      <template #under>
        <div
          v-if="!isLoading && isCompactMode"
          class="build-summary-popup-button-container"
          @click="toggleCompactBuildSummaryAsync"
        >
          <div class="build-summary-popup-button">
            <font-awesome-icon
              v-if="!isCompactBuildSummaryExpanded"
              icon="clipboard-list"
            />
            <font-awesome-icon
              v-if="isCompactBuildSummaryExpanded"
              icon="chevron-up"
            />
          </div>
        </div>
      </template>
    </Toolbar>
    <Sticky
      v-if="!isCompactMode"
      v-model:is-stickied="isBuildSummaryStickied"
      :element-to-stick-to="toolbarContainer"
      align="center"
      class="build-summary-container"
    >
      <BuildSummary
        :is-compact-mode="false"
        :is-loading="isLoading"
        :is-stickied="isBuildSummaryStickied"
        :summary="summary"
      />
    </Sticky>

    <!-- Inventory slots -->
    <div
      v-if="isLoading"
      class="build-loading"
    >
      <Loading />
    </div>
    <div
      v-if="!isLoading && !isEditing && isEmpty"
      class="build-empty-message"
    >
      <div class="build-empty-message-text">
        <p class="build-empty-message-line">
          {{ $t('message.emptyBuild1') }}
        </p>
        <p class="build-empty-message-line">
          {{ $t('message.emptyBuild2') }}
          <Button
            class="build-empty-message-button"
            @click="startEdit()"
          >
            <font-awesome-icon
              icon="edit"
              class="icon-before-text"
            />
            <span>{{ $t('caption.edit') }}</span>
          </Button>
          {{ $t('message.emptyBuild3') }}
        </p>
      </div>
    </div>
    <div
      v-show="!isLoading"
      class="build-inventory-slots"
    >
      <InventorySlot
        v-for="(inventorySlot, index) of build.inventorySlots"
        :key="`${path}/${inventorySlot.typeId}`"
        v-model:collapsed="collapseStatuses[index]"
        :inventory-slot="build.inventorySlots[index]"
        :path="`${path}/${_inventorySlotPathPrefix}${inventorySlot.typeId}`"
        @update:inventory-slot="onInventorySlotChanged(index, $event)"
      />
    </div>
  </div>

  <!-- Deletion confirmation dialog -->
  <Dialog
    v-model:visible="confirmationDialogIsDisplayed"
    :closable="false"
    :modal="true"
    :draggable="false"
  >
    <div>
      <span>{{ confirmationDialogMessage }}</span>
    </div>
    <template #footer>
      <div class="build-deletion-confirmation-buttons">
        <Button
          severity="danger"
          :outlined="confirmationDialogConfirmButtonOutlined"
          @click="confirmationDialogConfirmButtonAction"
        >
          <font-awesome-icon
            icon="trash"
            class="icon-before-text"
          />
          <span>
            {{ confirmationDialogConfirmButtonCaption }}
          </span>
        </Button>
        <Button
          :outlined="confirmationDialogCancelButtonOutlined"
          @click="confirmationDialogCancelButtonAction"
        >
          <font-awesome-icon
            icon="undo"
            class="icon-before-text"
          />
          <span>
            {{ confirmationDialogCancelButtonCaption }}
          </span>
        </Button>
      </div>
    </template>
  </Dialog>
</template>










<style scoped>
.build {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.build-caliber-icon {
  width: 1.5rem !important;
}

.build-deletion-confirmation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.build-deletion-confirmation-buttons > button {
  display: flex;
  justify-content: center;
}

.build-empty-message {
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
}

.build-empty-message-button {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.build-empty-message-line {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.build-empty-message-text {
  margin-left: auto;
  margin-right: auto;
}

.build-inventory-slots {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.build-loading {
  margin-bottom: auto;
  margin-top: auto;
  padding-top: 3rem;
}

.build-name {
  width: 20.725rem;
}

.build-not-exported {
  color: var(--warning-color);
  margin-left: 0.5rem;
}

.build-summary-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.build-summary-popup-button {
  align-items: center;
  background-color: var(--primary-color);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-bottom-width: 1px;
  border-color: var(--primary-color3);
  border-left-width: 1px;
  border-right-width: 1px;
  border-top-width: 0;
  border-style: solid;
  display: flex;
  height: 1.25rem;
  justify-content: center;
  position: absolute;
  top: -1px;
  /* To merge its border with the toolbar border */
  width: 5rem;
}

.build-summary-popup-button:hover {
  background-color: var(--primary-color2);
  cursor: pointer;
}

.build-summary-popup-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  width: 100%;
}

.build-title {
  align-items: center;
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  min-height: 2.75rem;
  text-align: center;
  white-space: preserve;
}

.build-title-compact {
  font-size: 1rem;
  margin-top: 0.5rem;
}

.build-toolbar {
  margin-bottom: 0.5rem;
}

.build-compact-summary-expand-enter-from,
.build-compact-summary-expand-leave-to {
  height: 0;
}

.build-compact-summary-expand-enter-to,
.build-compact-summary-expand-leave-from {
  height: v-bind(compactBuildSummaryHeight);
  /* https://stackoverflow.com/a/72698222 */
}

.build-compact-summary-expand-enter-active,
.build-compact-summary-expand-leave-active {
  transition: all v-bind(_compactBuildSummaryExpansionAnimationLenghtCss) ease;
  overflow: hidden;
}
</style>