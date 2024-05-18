import { computed, defineComponent, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IBuild } from '../../models/build/IBuild'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import { IGeneralOptionsGroup } from '../../models/utils/IGeneralOptionsGroup'
import vueI18n from '../../plugins/vueI18n'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { BuildService } from '../../services/BuildService'
import { ExportService } from '../../services/ExportService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { ItemService } from '../../services/ItemService'
import { CompatibilityRequest } from '../../services/compatibility/CompatibilityRequest'
import { CompatibilityRequestType } from '../../services/compatibility/CompatibilityRequestType'
import { CompatibilityService } from '../../services/compatibility/CompatibilityService'
import { BuildComponentService } from '../../services/components/BuildComponentService'
import { GlobalSidebarComponentService } from '../../services/components/GlobalSidebarComponentService'
import { ServiceInitializationState } from '../../services/repository/ServiceInitializationState'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import BuildShare from '../build-share/BuildShareComponent.vue'
import GeneralOptions from '../general-options/GeneralOptionsComponent.vue'
import InputTextField from '../input-text-field/InputTextFieldComponent.vue'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import InventorySlot from '../inventory-slot/InventorySlotComponent.vue'
import LoadingError from '../loading-error/LoadingErrorComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import NotificationButton from '../notification-button/NotificationButtonComponent.vue'
import ShoppingList from '../shopping-list/ShoppingListComponent.vue'

export default defineComponent({
  components: {
    BuildShare,
    GeneralOptions,
    InputTextField,
    InventoryPrice,
    InventorySlot,
    Loading,
    LoadingError,
    NotificationButton,
    ShoppingList
  },
  setup: () => {
    const itemService = Services.get(ItemService)
    itemService.emitter.once(ItemService.initializationFinishedEvent, onServicesInitialized)

    const route = useRoute()
    const router = useRouter()

    const buildComponentService = Services.get(BuildComponentService)
    const buildPropertiesService = Services.get(BuildPropertiesService)
    const compatibilityService = Services.get(CompatibilityService)
    const inventoryItemService = Services.get(InventoryItemService)
    const globalFilterService = Services.get(GlobalFilterService)

    const inventorySlotPathPrefix = PathUtils.inventorySlotPrefix
    let originalBuild: IBuild

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
    const notExportedTooltip = computed(() => !summary.value.exported ? buildPropertiesService.getNotExportedTooltip(summary.value.lastUpdated, summary.value.lastExported) : '')
    const path = computed(() => PathUtils.buildPrefix + (isNewBuild.value ? PathUtils.newBuild : build.value.id))

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
    const editing = isNewBuild.value ? ref(true) : ref(false)
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
    const toolbarCssClass = ref('toolbar')

    provide('editing', editing)

    watch(() => route.params, onServicesInitialized)

    onMounted(() => {
      window.addEventListener('scroll', setToolbarCssClass)
      window.scrollTo(0, 0) // Scrolling to the top in case we were at the bottom of the page in the previous screen
      document.onkeydown = (e) => onKeyDown(e)

      compatibilityService.emitter.on(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      compatibilityService.emitter.on(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
      compatibilityService.emitter.on(CompatibilityRequestType.mod, onModCompatibilityRequest)
      inventoryItemService.emitter.on(InventoryItemService.inventoryItemChangeEvent, onInventoryItemChanged)
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)


      if (itemService.initializationState !== ServiceInitializationState.initializing) {
        onServicesInitialized()
      }
    })

    onUnmounted(() => {
      compatibilityService.emitter.off(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      compatibilityService.emitter.off(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
      compatibilityService.emitter.off(CompatibilityRequestType.mod, onModCompatibilityRequest)
      inventoryItemService.emitter.off(InventoryItemService.inventoryItemChangeEvent, onInventoryItemChanged)
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      document.onkeydown = null
      window.removeEventListener('scroll', setToolbarCssClass)
    })

    window.onbeforeunload = function () {
      if (editing.value) {
        // Confirmation message before closing a tab or the browser
        return ''
      }
    }

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
      editing.value = false

      if (isNewBuild.value) {
        goToBuilds()
      } else {
        build.value = originalBuild
        getSummary()
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

      Services.get(GlobalSidebarComponentService).close()
    }

    /**
     * Creates a copy of the current build.
     */
    function copy() {
      if (editing.value) {
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
      Services.get(GlobalSidebarComponentService).display({
        displayedComponentType: 'GeneralOptions',
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
      Services.get(GlobalSidebarComponentService).display({
        displayedComponentType: 'MerchantItemsOptions',
        position: 'right'
      })
    }

    /**
     * Displays the shopping list.
     */
    function displayShoppingList() {
      Services.get(GlobalSidebarComponentService).display({
        displayedComponentType: 'ShoppingList',
        displayedComponentParameters: summary.value.shoppingList,
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

      Services.get(GlobalSidebarComponentService).close()
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

      Services.get(GlobalSidebarComponentService).close()
    }

    /**
     * Exports the build.
     */
    async function exportBuild() {
      if (editing.value) {
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
     * Gets the values of the summary of the content of the build.
     */
    async function getSummary() {
      if (build.value == null) {
        return
      }

      summary.value = await buildPropertiesService.getSummary(build.value)
    }

    /**
     * Redirects to the builds page.
     */
    function goToBuilds() {
      router.push({ name: 'Builds' })
    }

    /**
     * Checks whether an armor can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onArmorCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(buildPropertiesService.canAddArmor(build.value))
    }

    /**
     * Updates the summary when an InventorySlot changes.
     */
    function onInventoryItemChanged() {
      getSummary()
    }

    /**
     * Reacts to a keyboard event.
     * @param event - Keyboard event.
     */
    async function onKeyDown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault() // Prevents the browser save action to be triggered

        if (editing.value && !invalid.value) {
          await save()
          startEdit() // After saving with the shortcut, we stay in edit mode unlike when using the button
        }
      }
    }

    /**
     * Updates the build summary price to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      getSummary()
    }

    /**
     * Checks if a mod can be added to the selected item.
     * @param request - Compatibility request that must be resolved.
     */
    function onModCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(buildPropertiesService.canAddMod(build.value, request.itemId, request.path))
    }

    /**
     * Initializes the build.
     */
    function onServicesInitialized() {
      isLoading.value = true

      setTimeout(() => { // Did not find another solution to make the loading animation appear when opening a build from the builds list (nextTick does not work)
        build.value = buildComponentService.getBuild(route.params['id'] as string)
        getSharedBuild(route.params['sharedBuild'] as string)
          .then(() => {
            isLoading.value = false
            getSummary()

            build.value.inventorySlots.forEach(() => {
              collapseStatuses.value.push(false) // All inventory slots expanded by default
            })
          })
          .finally(() => isLoading.value = false)
      }, 1)
    }

    /**
     * Checks whether a tactical rig can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onTacticalRigCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(buildPropertiesService.canAddVest(build.value, request.itemId))
    }

    /**
     * Deletes the build.
     */
    function remove() {
      buildComponentService.deleteBuild(router, build.value)
    }

    /**
     * Saves the build.
     */
    async function save() {
      isLoading.value = true
      await buildComponentService.saveBuild(router, build.value)
      isLoading.value = false
      editing.value = false
    }

    /**
     * Sets the toolbar CSS class.
     * Used to set its sticky status and work around Z index problems with PrimeVue components that appear behind the toolbar.
     */
    function setToolbarCssClass() {
      const buildContentElement = document.querySelector('#build-content')
      const rectangle = buildContentElement?.getBoundingClientRect()
      const y = rectangle?.top ?? 0

      toolbarCssClass.value = window.scrollY <= y ? 'toolbar' : 'toolbar toolbar-sticky'
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
      editing.value = true

      // Creating a copy without reference of the build in its original state
      const originalBuildResult = Services.get(BuildService).parse(build.value.id, JSON.stringify(build.value))

      if (originalBuildResult != null) {
        originalBuild = originalBuildResult
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
      editing,
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
      inventorySlotPathPrefix,
      isEmpty,
      isLoading,
      isNewBuild,
      notExportedTooltip,
      path,
      remove,
      save,
      startDelete,
      startEdit,
      StatsUtils,
      summary,
      toolbarCssClass
    }
  }
})