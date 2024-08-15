import { computed, defineComponent, nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IBuild } from '../../models/build/IBuild'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IGeneralOptionsGroup } from '../../models/utils/IGeneralOptionsGroup'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { GlobalSidebarService } from '../../services/GlobalSidebarService'
import { ItemService } from '../../services/ItemService'
import { CompatibilityRequest } from '../../services/compatibility/CompatibilityRequest'
import { CompatibilityRequestType } from '../../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../../services/compatibility/CompatibilityService'
import { BuildComponentService } from '../../services/components/BuildComponentService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import InputTextField from '../InputTextFieldComponent.vue'
import InventoryPrice from '../InventoryPriceComponent.vue'
import InventorySlot from '../InventorySlotComponent.vue'
import Loading from '../LoadingComponent.vue'
import NotificationButton from '../NotificationButtonComponent.vue'
import Toolbar from '../ToolbarComponent.vue'
import BuildShare from '../build-share/BuildShareComponent.vue'

export default defineComponent({
  components: {
    BuildShare,
    InputTextField,
    InventoryPrice,
    InventorySlot,
    Loading,
    NotificationButton,
    Toolbar
  },
  setup: () => {
    const route = useRoute()
    const router = useRouter()

    const _buildComponentService = Services.get(BuildComponentService)
    const _buildPropertiesService = Services.get(BuildPropertiesService)
    const _compatibilityService = Services.get(CompatibilityService)
    const _globalFilterService = Services.get(GlobalFilterService)
    const _itemService = Services.get(ItemService)

    const _inventorySlotPathPrefix = PathUtils.inventorySlotPrefix
    let _originalBuild: IBuild

    const build = ref<IBuild>({
      id: route.params['id'] as string ?? '',
      inventorySlots: [],
      lastExported: undefined,
      lastUpdated: undefined,
      lastWebsiteVersion: undefined,
      name: ''
    })
    const collapseStatuses = ref<boolean[]>([])
    const deleting = ref(false)
    const isEditing = ref(false)
    const generalOptionsSidebarVisible = ref(false)
    const hasItemsLoadingError = ref(false)
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

    const hasSummaryArmor = computed(() => summary.value.armorModifiers.armorClass !== 0)
    const hasSummaryErgonomics = computed(() => summary.value.ergonomics !== 0)
    const hasSummaryErgonomicsModifierPercentage = computed(() => summary.value.wearableModifiers.ergonomicsModifierPercentage !== 0)
    const hasSummaryHorizontalRecoil = computed(() => summary.value.recoil.horizontalRecoil !== 0)
    const hasSummaryMovementSpeedModifierPercentage = computed(() => summary.value.wearableModifiers.movementSpeedModifierPercentage !== 0)
    const hasSummaryPrice = computed(() => summary.value.price.priceInMainCurrency !== 0)
    const hasSummaryStats = computed(() => hasSummaryErgonomics.value || hasSummaryHorizontalRecoil.value || hasSummaryVerticalRecoil.value)
    const hasSummaryTurningSpeedModifierPercentage = computed(() => summary.value.wearableModifiers.turningSpeedModifierPercentage !== 0)
    const hasSummaryVerticalRecoil = computed(() => summary.value.recoil.verticalRecoil !== 0)
    const hasSummaryWearableModifiers = computed(() => hasSummaryErgonomicsModifierPercentage.value
      || hasSummaryMovementSpeedModifierPercentage.value
      || hasSummaryTurningSpeedModifierPercentage.value
    )
    const hasSummaryWeight = computed(() => summary.value.weight !== 0)
    const invalid = computed(() => build.value.name === '')
    const isEmpty = computed(() => !build.value.inventorySlots.some(is => is.items.some(i => i != null)))
    const isNewBuild = computed(() => build.value.id === '')
    const notExportedTooltip = computed(() => !summary.value.exported ? _buildPropertiesService.getNotExportedTooltip(summary.value.lastUpdated, summary.value.lastExported) : '')
    const path = computed(() => PathUtils.buildPrefix + (isNewBuild.value ? PathUtils.newBuild : build.value.id))

    provide('isEditing', isEditing)

    onMounted(() => {
      addEventListener('keydown', (e) => onKeyDown(e))

      _compatibilityService.emitter.on(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      _compatibilityService.emitter.on(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
      _compatibilityService.emitter.on(CompatibilityRequestType.mod, onModCompatibilityRequest)
      _globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      isEditing.value = isNewBuild.value

      if (_itemService.initializationState === ServiceInitializationState.initializing) {
        _itemService.emitter.once(ItemService.initializationFinishedEvent, onItemServiceInitialized)
      } else {
        onItemServiceInitialized()
      }

      window.scrollTo(0, 0) // Scrolling to the top in case we were at the bottom of the page in the previous screen
      window.onbeforeunload = function () {
        if (isEditing.value) {
          // Confirmation message before closing a tab or the browser
          return ''
        }
      }
    })

    onUnmounted(() => {
      _compatibilityService.emitter.off(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      _compatibilityService.emitter.off(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
      _compatibilityService.emitter.off(CompatibilityRequestType.mod, onModCompatibilityRequest)
      _globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      removeEventListener('keydown', (e) => onKeyDown(e))
    })

    watch(() => route.params, onItemServiceInitialized)

    /**
     * Cancels the deletion process.
     */
    function cancelDelete() {
      deleting.value = false
    }

    /**
     * Cancels modifications and stops edit mode.
     */
    function cancelEdit() {
      isEditing.value = false

      if (isNewBuild.value) {
        goToBuilds()
      } else {
        build.value = _originalBuild
        setSummary()
      }
    }

    /**
     * Confirms the deletion.
     */
    function confirmDelete() {
      remove()
    }

    /**
     * Collapses all the inventory slots.
     */
    function collapseAll() {
      generalOptionsSidebarVisible.value = false

      for (let i = 0; i < collapseStatuses.value.length; i++) {
        collapseStatuses.value[i] = true
      }

      Services.get(GlobalSidebarService).close('GeneralOptionsSidebar')
    }

    /**
     * Creates a copy of the current build.
     */
    function copy() {
      if (isEditing.value) {
        return
      }

      build.value.id = ''
      build.value.name = build.value.name + ' - ' + vueI18n.t('caption.copy')
      startEdit()
    }

    /**
     * Displays the general options.
     */
    function displayGeneralOptions() {
      Services.get(GlobalSidebarService).display({
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
        ] as IGeneralOptionsGroup[],
        position: 'right'
      })
    }

    /**
     * Displays the merchant items options.
     */
    function displayMerchantItemsOptions() {
      Services.get(GlobalSidebarService).display({
        displayedComponentType: 'MerchantItemsOptionsSidebar',
        position: 'right'
      })
    }

    /**
     * Displays the shopping list.
     */
    function displayShoppingList() {
      Services.get(GlobalSidebarService).display({
        displayedComponentType: 'ShoppingListSidebar',
        displayedComponentParameters: {
          buildName: summary.value.name,
          shoppingList: summary.value.shoppingList
        },
        position: 'left'
      })
    }

    /**
     * Expands all the inventory slots.
     */
    function expandAll() {
      generalOptionsSidebarVisible.value = false

      for (let i = 0; i < collapseStatuses.value.length; i++) {
        collapseStatuses.value[i] = false
      }

      Services.get(GlobalSidebarService).close('GeneralOptionsSidebar')
    }

    /**
     * Expands the inventory slots containing an item.
     */
    function expandWithItem() {
      generalOptionsSidebarVisible.value = false

      for (let i = 0; i < collapseStatuses.value.length; i++) {
        if (build.value.inventorySlots[i].items.filter(i => i != null).length > 0) {
          collapseStatuses.value[i] = false
        }
      }

      Services.get(GlobalSidebarService).close('GeneralOptionsSidebar')
    }

    /**
     * Exports the build.
     */
    async function exportBuild() {
      if (isEditing.value) {
        return
      }

      if (isNewBuild.value) {
        return
      }

      await Services.get(ExportService).export([build.value])
    }

    /**
     * Gets a shared build from an encoded string that can be shared in a URL.
     * @param sharableString - Encoded string that can be shared in a URL.
     */
    async function getSharedBuild(sharableString?: string) {
      if (sharableString == null) {
        return
      }

      const sharedBuild = await Services.get(BuildService).fromSharableString(sharableString)

      if (sharedBuild == null) {
        goToBuilds()

        return
      }

      build.value = sharedBuild
    }

    /**
     * Redirects to the builds page.
     */
    function goToBuilds() {
      router.push({ name: 'Builds' })
    }

    /**
     * Reacts to an armor compatibility check request.
     *
     * Checks whether an armor can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onArmorCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(_buildPropertiesService.canAddArmor(build.value))
    }

    /**
     * Reacts to an inventory item being changed.
     *
     * Signals to the build one of its inventory slots has changed.
     */
    function onInventorySlotChanged(index: number, newInventorySlot: IInventorySlot) {
      build.value.inventorySlots[index] = newInventorySlot

      setSummary()
    }

    /**
     * Reacts to the item service being initialized.
     *
     * Initializes the build.
     */
    function onItemServiceInitialized() {
      isLoading.value = true

      setTimeout(() => { // Did not find another solution to make the loading animation appear when opening a build from the builds list (nextTick does not work)
        build.value = _buildComponentService.getBuild(route.params['id'] as string)
        getSharedBuild(route.params['sharedBuild'] as string)
          .then(() => {
            build.value.inventorySlots.forEach(() => {
              collapseStatuses.value.push(false) // All inventory slots expanded by default
            })

            isLoading.value = false
            setSummary()
          })
          .finally(() => isLoading.value = false)
      }, 1)
    }

    /**
     * Reacts to a keyboard event.
     * @param event - Keyboard event.
     */
    async function onKeyDown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault() // Prevents the browser save action to be triggered

        if (isEditing.value && !invalid.value) {
          await save()
          startEdit() // After saving with the shortcut, we stay in edit mode unlike when using the button
        }
      }
    }

    /**
     * Reacts to the merchant filter being changed.
     *
     * Updates the build summary price to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      setSummary()
    }

    /**
     * Reacts to a mod compatibility check request.
     *
     * Checks if a mod can be added to the selected item.
     * @param request - Compatibility request that must be resolved.
     */
    function onModCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(_buildPropertiesService.canAddMod(build.value, request.itemId, request.path))
    }

    /**
     * Reacts to a tactical rig compatibility check request.
     *
     * Checks whether a tactical rig can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onTacticalRigCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(_buildPropertiesService.canAddVest(build.value, request.itemId))
    }

    /**
     * Deletes the build.
     */
    function remove() {
      _buildComponentService.deleteBuild(router, build.value)
    }

    /**
     * Saves the build.
     */
    async function save() {
      isLoading.value = true
      await _buildComponentService.saveBuild(router, build.value)

      nextTick(() => {
        isLoading.value = false
        isEditing.value = false
      })
    }

    /**
     * Sets the values of the summary of the content of the build.
     */
    async function setSummary() {
      if (build.value == null) {
        return
      }

      summary.value = await _buildPropertiesService.getSummary(build.value)
    }

    /**
     * Displays the deletion confirmation dialog.
     */
    function startDelete() {
      deleting.value = true
    }

    /**
     * Starts the edit mode.
     */
    function startEdit() {
      isEditing.value = true

      // Creating a copy without reference of the build in its original state
      const originalBuildResult = Services.get(BuildService).parse(build.value.id, JSON.stringify(build.value))

      if (originalBuildResult != null) {
        _originalBuild = originalBuildResult
      }
    }

    return {
      build,
      cancelDelete,
      cancelEdit,
      collapseAll,
      collapseStatuses,
      confirmDelete,
      copy,
      deleting,
      displayGeneralOptions,
      displayMerchantItemsOptions,
      displayShoppingList,
      DisplayValueType,
      expandAll,
      expandWithItem,
      exportBuild,
      generalOptionsSidebarVisible,
      goToBuilds,
      hasItemsLoadingError,
      hasSummaryArmor,
      hasSummaryErgonomics,
      hasSummaryErgonomicsModifierPercentage,
      hasSummaryHorizontalRecoil,
      hasSummaryMovementSpeedModifierPercentage,
      hasSummaryPrice,
      hasSummaryStats,
      hasSummaryTurningSpeedModifierPercentage,
      hasSummaryVerticalRecoil,
      hasSummaryWearableModifiers,
      hasSummaryWeight,
      invalid,
      inventorySlotPathPrefix: _inventorySlotPathPrefix,
      isEditing,
      isEmpty,
      isLoading,
      isNewBuild,
      notExportedTooltip,
      onInventorySlotChanged,
      path,
      remove,
      save,
      startDelete,
      startEdit,
      StatsUtils,
      summary
    }
  }
})