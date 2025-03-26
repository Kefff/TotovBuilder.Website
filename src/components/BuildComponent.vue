<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, provide, ref, useTemplateRef, watch } from 'vue'
import { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteLocationNormalizedLoadedGeneric, useRoute, useRouter } from 'vue-router'
import { IBuild } from '../models/build/IBuild'
import { InventorySlotTypeId } from '../models/build/InventorySlotTypes'
import { IBuildSummary } from '../models/utils/IBuildSummary'
import { InventorySlotSelectorSidebarParameters } from '../models/utils/IGlobalSidebarOptions'
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
import InventorySlots from './InventorySlotsComponent.vue'
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
let _isCompactSummaryExpanding = false
let _originalBuild: IBuild
let _unregisterSaveBeforeLeaveNavigationGuardFunction: (() => void) | undefined = undefined
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
    style: () => 'discreet'
  },
  {
    action: startEdit,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.edit'),
    icon: () => 'edit',
    isDisabled: () => isLoading.value,
    isVisible: () => !isEditing.value,
    name: 'edit',
    showCaption: () => 'auto'
  },
  {
    action: saveAsync,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.save'),
    icon: () => 'save',
    isDisabled: () => isInvalid.value,
    isVisible: () => isEditing.value,
    name: 'save',
    variant: () => 'success',
    showCaption: () => 'auto'
  },
  {
    action: displayInventorySlotSelector,
    canBeMovedToSidebar: () => false,
    caption: () => vueI18n.t('caption.gear'),
    followedBySeparation: true,
    icon: () => 'vest',
    isVisible: () => isSmartphoneLandscapeOrSmaller.value,
    name: 'inventorySlotSelector',
    showCaption: () => 'never',
    style: () => 'outlined'
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

const isBuildNameHiddenInSummary = computed(() => isSmartphoneLandscapeOrSmaller.value)
const isEmpty = computed(() => !build.value.inventorySlots.some(is => is.items.some(i => i != null)))
const isInvalid = computed(() => build.value.name === '')
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
const confirmationDialogIsDisplayed = ref(false)
const confirmationDialogMainButtonAction = ref<() => void | Promise<void>>()
const confirmationDialogMainButtonCaption = ref<string>()
const confirmationDialogMainButtonIcon = ref<string>()
const confirmationDialogMainButtonSeverity = ref<string>()
const confirmationDialogMessage = ref<string>()
const confirmationDialogSecondaryButtonAction = ref<() => void | Promise<void>>()
const confirmationDialogSecondaryButtonCaption = ref<string>()
const confirmationDialogSecondaryButtonIcon = ref<string>()
const confirmationDialogSecondaryButtonSeverity = ref<string>()
const currentInventorySlot = ref<InventorySlotTypeId>(InventorySlotTypeId.onSling)
const inventorySlotsShoppingListItems = computed(() => summary.value.shoppingList.filter(sl => sl.inventorySlotId != null))
const isBuildSummaryStickied = ref(false)
const isCompactBuildSummaryPinned = ref(false)
const isEditing = ref(false)
const isLoading = ref(true)
const { isSmartphoneLandscapeOrSmaller, isTabletPortraitOrSmaller: isCompactMode } = WebBrowserUtils.getScreenSize()
const isCompactBuildSummaryExpanded = ref(isCompactMode.value)
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
provide('isNewBuild', isNewBuild)

onMounted(() => {
  _compatibilityService.emitter.on(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
  _compatibilityService.emitter.on(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
  _compatibilityService.emitter.on(CompatibilityRequestType.mod, onModCompatibilityRequest)
  _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  addNavigationGuards()

  isEditing.value = isNewBuild.value

  if (_itemService.initializationState === ServiceInitializationState.initializing) {
    _itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServiceInitializedAsync)
  } else {
    onItemServiceInitializedAsync()
  }
})

onUnmounted(() => {
  _compatibilityService.emitter.off(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
  _compatibilityService.emitter.off(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
  _compatibilityService.emitter.off(CompatibilityRequestType.mod, onModCompatibilityRequest)
  _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
  removeNavigationGuards()
})

watch(() => route.params, onItemServiceInitializedAsync)

/**
 * Adds navigation guards to avoid leaving the build screen without saving.
 */
function addNavigationGuards(): void {
  // Guard for saving before changing page
  _unregisterSaveBeforeLeaveNavigationGuardFunction = router.beforeEach(
    async (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric, next: NavigationGuardNext) => {
      const isBuildScreen = from.name === 'Build'
        || from.name === 'CopyBuild'
        || from.name === 'NewBuild'
        || from.name === 'ShareBuild'
      if (isBuildScreen
        && isEditing.value) {
        //const confirmationDialogResult = confirm(vueI18n.t('message.confirmLeaveBuildWithoutSaving'))
        const action = new Promise<void>((resolve) => {
          displayConfirmationDialog({
            mainButtonAction: () => {
              next(false)
              resolve()
            },
            mainButtonCaption: vueI18n.t('caption.stay'),
            mainButtonIcon: 'undo',
            mainButtonSeverity: 'success',
            message: vueI18n.t('message.confirmLeaveBuildWithoutSaving'),
            secondaryButtonAction: () => {
              next()
              resolve()
            },
            secondaryButtonCaption: vueI18n.t('caption.leave'),
            secondaryButtonIcon: 'walking',
            secondaryButtonSeverity: 'danger'
          })
        })
        await action
      }

      return next()
    })

  // Guard for being able to cancel tab or browser closing when editing
  window.addEventListener('beforeunload', onTabOrBrowserClosing)
}

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
  _globalSidebarService.display({ displayedComponentType: 'GeneralOptionsSidebar' })
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
function displayConfirmationDialog(options: {
  message: string,
  mainButtonCaption: string,
  mainButtonSeverity: string | undefined,
  mainButtonIcon: string,
  mainButtonAction: () => void | Promise<void>,
  secondaryButtonCaption: string,
  secondaryButtonSeverity: string | undefined,
  secondaryButtonIcon: string,
  secondaryButtonAction?: () => void | Promise<void>,
}): void {
  confirmationDialogSecondaryButtonAction.value = async (): Promise<void> => {
    if (options.secondaryButtonAction != null) {
      await options.secondaryButtonAction()
    }
    confirmationDialogIsDisplayed.value = false
  }
  confirmationDialogSecondaryButtonCaption.value = options.secondaryButtonCaption
  confirmationDialogSecondaryButtonIcon.value = options.secondaryButtonIcon
  confirmationDialogSecondaryButtonSeverity.value = options.secondaryButtonSeverity

  confirmationDialogMainButtonAction.value = async (): Promise<void> => {
    await options.mainButtonAction()
    confirmationDialogIsDisplayed.value = false
  }
  confirmationDialogMainButtonCaption.value = options.mainButtonCaption
  confirmationDialogMainButtonIcon.value = options.mainButtonIcon
  confirmationDialogMainButtonSeverity.value = options.mainButtonSeverity

  confirmationDialogMessage.value = options.message
  confirmationDialogIsDisplayed.value = true
}

/**
 * Displays the inventory slot selector sidebar.
 */
function displayInventorySlotSelector(): void {
  _globalSidebarService.display({
    displayedComponentType: 'InventorySlotSelectorSidebar',
    displayedComponentParameters: {
      currentInventorySlot: currentInventorySlot.value,
      inventorySlotsShoppingListItems: inventorySlotsShoppingListItems.value,
      isEditing: isEditing.value
    },
    onCloseAction: (updatedParameters) => {
      currentInventorySlot.value = (updatedParameters as InventorySlotSelectorSidebarParameters).currentInventorySlot
    }
  })
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
function onInventorySlotChanged(): void {
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
  } else {
    build.value = _buildComponentService.getBuild(route.params['id'] as string)
    isEditing.value = isNewBuild.value
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

    if (isEditing.value && !isInvalid.value) {
      await saveAsync(false)
      startEdit() // After saving with the shortcut, we stay in edit mode unlike when using the button
    }
  }
}

/**
 * Reacts to the tab or browser being closed.
 *
 * Displays a confirmation message to be able to cancel the closing when the build is in edit mode.
 */
function onTabOrBrowserClosing(event: BeforeUnloadEvent): string | undefined {
  if (isEditing.value) {
    event.preventDefault()
    const confirmationMessage = 'Voulez-vous vraiment quitter ? Les modifications non sauvegardées seront perdues.'
    event.returnValue = confirmationMessage

    return confirmationMessage
  }

  return undefined
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
    && isStickied
    && !isCompactBuildSummaryPinned.value) {
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
 * Removes navigation guards.
 */
function removeNavigationGuards(): void {
  _unregisterSaveBeforeLeaveNavigationGuardFunction?.()
  window.removeEventListener('beforeunload', onTabOrBrowserClosing)
}

/**
 * Saves the build.
 * @param changeCurrentInventorySlotIfEmpty - Indicates whether the current inventory slot should
 * be changed to the first that contains an item when the current inventory slot is emmpty after saving.
 */
async function saveAsync(changeCurrentInventorySlotIfEmpty: boolean = true): Promise<void> {
  isLoading.value = true
  await _buildComponentService.saveBuildAsync(router, build.value)

  if (changeCurrentInventorySlotIfEmpty) {
    let inventorySlot = build.value.inventorySlots.find(is => is.typeId === currentInventorySlot.value)

    if (!inventorySlot?.items.some(i => i != undefined)) {
      currentInventorySlot.value = build.value.inventorySlots.find(is => is.items.some(i => i != null))?.typeId ?? InventorySlotTypeId.onSling
    }
  }

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
  displayConfirmationDialog({
    mainButtonAction: remove,
    mainButtonCaption: vueI18n.t('caption.delete'),
    mainButtonIcon: 'trash',
    mainButtonSeverity: 'danger',
    message: vueI18n.t('message.confirmDeleteBuild', { name: build.value.name }),
    secondaryButtonCaption: vueI18n.t('caption.cancel'),
    secondaryButtonIcon: 'undo',
    secondaryButtonSeverity: ''
  })
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
          v-if="!isBuildNameHiddenInSummary"
          class="build-title"
        >
          <div v-show="!isEditing">
            {{ build.name }}
          </div>
          <InputTextField
            v-show="!isLoading && isEditing"
            :caption="$t('caption.name')"
            :centered="true"
            :required="true"
            :value="build.name"
            caption-mode="placeholder"
            class="build-name"
            @update:value="$event => build.name = $event!"
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
          name="build-compact-summary-expand-transition"
        >
          <div
            v-show="isCompactBuildSummaryExpanded"
            ref="compactBuildSummary"
          >
            <div
              v-if="isBuildNameHiddenInSummary"
              class="build-title build-title-compact"
            >
              <div v-show="!isEditing">
                {{ build.name }}
              </div>
              <InputTextField
                v-show="!isLoading && isEditing"
                :caption="$t('caption.name')"
                :centered="true"
                :required="true"
                :value="build.name"
                caption-mode="placeholder"
                class="build-name"
                @update:value="$event => build.name = $event!"
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
          class="build-summary-popup-buttons-container"
        >
          <div
            class="build-summary-popup-button build-summary-popup-toggle-button"
            @click="() => toggleCompactBuildSummaryAsync()"
          >
            <font-awesome-icon
              v-if="!isCompactBuildSummaryExpanded"
              icon="clipboard-list"
            />
            <font-awesome-icon
              v-if="isCompactBuildSummaryExpanded"
              icon="chevron-up"
            />
          </div>
          <div
            v-show="isCompactBuildSummaryExpanded"
            class="build-summary-popup-button build-summary-popup-pin-button"
            :class="{ 'build-summary-popup-unpin-button': isCompactBuildSummaryPinned }"
            @click="isCompactBuildSummaryPinned = !isCompactBuildSummaryPinned"
          >
            <font-awesome-icon icon="thumbtack" />
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
      width="fit"
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
      v-show="!isLoading"
      class="build-inventory-slots"
    >
      <InventorySlots
        v-model:current-inventory-slot="currentInventorySlot"
        v-model:inventory-slots="build.inventorySlots"
        :inventory-slots-shopping-list-items="inventorySlotsShoppingListItems"
        :path="path"
        @update:inventory-slots="onInventorySlotChanged"
      >
        <template
          v-if="!isLoading && !isEditing && isEmpty"
          #empty
        >
          <div class="build-empty-message">
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
        </template>
      </InventorySlots>
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
      <span class="build-confirmation-message">{{ confirmationDialogMessage }}</span>
    </div>
    <template #footer>
      <div class="build-confirmation-buttons">
        <Button
          :severity="confirmationDialogMainButtonSeverity"
          @click="confirmationDialogMainButtonAction"
        >
          <font-awesome-icon
            :icon="confirmationDialogMainButtonIcon"
            class="icon-before-text"
          />
          <span>
            {{ confirmationDialogMainButtonCaption }}
          </span>
        </Button>
        <Button
          :severity="confirmationDialogSecondaryButtonSeverity"
          outlined
          @click="confirmationDialogSecondaryButtonAction"
        >
          <font-awesome-icon
            :icon="confirmationDialogSecondaryButtonIcon"
            class="icon-before-text"
          />
          <span>
            {{ confirmationDialogSecondaryButtonCaption }}
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

.build-confirmation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.build-confirmation-buttons > button {
  display: flex;
  justify-content: center;
}

.build-confirmation-message {
  white-space: preserve;
}

.build-empty-message {
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-size: 1.5rem;
}

.build-empty-message-button {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.build-empty-message-line {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

.build-summary-popup-button {
  align-items: center;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  border-bottom-width: 1px;
  border-color: var(--primary-color3);
  border-left-width: 1px;
  border-right-width: 1px;
  border-style: solid;
  border-top-width: 0;
  display: flex;
  font-size: 0.875rem;
  height: 1.25rem;
  justify-content: center;
  position: absolute;
  top: -1px;
  /* To merge its border with the toolbar border */
}


.build-summary-popup-button:hover {
  background-color: var(--primary-color2);
  cursor: pointer;
}

.build-summary-popup-buttons-container {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
  width: 100%;
}

.build-summary-popup-pin-button {
  background-color: var(--surface-50);
  right: 1rem;
  width: 3rem;
}

.build-summary-popup-toggle-button {
  background-color: var(--primary-color);
  left: calc(50% - 2.5rem);
  /* 5rem long element being centered */
  width: 5rem;
}

.build-summary-popup-unpin-button {
  background-color: var(--primary-color);
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
  font-size: 1.5rem;
  margin-top: 0.5rem;
}

.build-toolbar {
  margin-bottom: 0.5rem;
}

.build-compact-summary-expand-transition-enter-from,
.build-compact-summary-expand-transition-leave-to {
  height: 0;
}

.build-compact-summary-expand-transition-enter-to,
.build-compact-summary-expand-transition-leave-from {
  height: v-bind(compactBuildSummaryHeight);
  /* https://stackoverflow.com/a/72698222 */
}

.build-compact-summary-expand-transition-enter-active,
.build-compact-summary-expand-transition-leave-active {
  transition: all v-bind(_compactBuildSummaryExpansionAnimationLenghtCss) ease;
  overflow: hidden;
}
</style>