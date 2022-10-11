import { computed, defineComponent, provide, ref, watch, onUnmounted, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputTextField from '../input-text-field/InputTextFieldComponent.vue'
import InventorySlot from '../inventory-slot/InventorySlotComponent.vue'
import { IBuild } from '../../models/build/IBuild'
import Services from '../../services/repository/Services'
import { BuildComponentService } from '../../services/components/BuildComponentService'
import { CompatibilityService } from '../../services/compatibility/CompatibilityService'
import { CompatibilityRequestType } from '../../services/compatibility/CompatibilityRequestType'
import { CompatibilityRequest } from '../../services/compatibility/CompatibilityRequest'
import { BuildPropertiesService } from '../../services/BuildPropertiesService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import StatsUtils from '../../utils/StatsUtils'
import { ExportService } from '../../services/ExportService'
import { IBuildSummary } from '../../models/utils/IBuildSummary'
import NotificationButton from '../notification-button/NotificationButtonComponent.vue'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import MerchantFilter from '../merchant-filter/MerchantFilterComponent.vue'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import LanguageSelector from '../language-selector/LanguageSelectorComponent.vue'
import Loading from '../loading/LoadingComponent.vue'
import ShareBuild from '../build-share/BuildShareComponent.vue'
import { PathUtils } from '../../utils/PathUtils'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { InventoryItemService } from '../../services/InventoryItemService'

export default defineComponent({
  components: {
    InventorySlot,
    InputTextField,
    InventoryPrice,
    LanguageSelector,
    Loading,
    MerchantFilter,
    NotificationButton,
    ShareBuild
  },
  setup: () => {
    const route = useRoute()
    const router = useRouter()

    const buildComponentService = Services.get(BuildComponentService)
    const buildPropertiesService = Services.get(BuildPropertiesService)
    const compatibilityService = Services.get(CompatibilityService)
    const exportService = Services.get(ExportService)
    const inventoryItemService = Services.get(InventoryItemService)
    const merchantFilterService = Services.get(MerchantFilterService)
    const notificationService = Services.get(NotificationService)

    const inventorySlotPathPrefix = PathUtils.inventorySlotPrefix
    let originalBuild: IBuild

    const invalid = computed(() => build.value.name === '')
    const isEmpty = computed(() => !build.value.inventorySlots.some(is => is.items.some(i => i != undefined)))
    const isNewBuild = computed(() => build.value.id === '')
    const notExportedTooltip = computed(() => !summary.value.exported ? buildPropertiesService.getNotExportedTooltip(summary.value.lastUpdated, summary.value.lastExported) : '')
    const path = computed(() => PathUtils.buildPrefix + (isNewBuild.value ? PathUtils.newBuild : build.value.id))

    const advancedPanel = ref()
    const ammunitionCountsPanel = ref()
    const build = ref<IBuild>(buildComponentService.getBuild(route.params['id'] as string))
    const collapseStatuses = ref<boolean[]>([])
    const deleting = ref(false)
    const editing = isNewBuild.value ? ref(true) : ref(false)
    const isInitializing = ref(true)
    const summary = ref<IBuildSummary>({
      ammunitionCounts: [],
      ergonomics: undefined,
      ergonomicsPercentageModifier: 0,
      exported: false,
      horizontalRecoil: undefined,
      id: build.value.id,
      name: build.value.name,
      lastExported: undefined,
      lastUpdated: new Date(),
      price: {
        missingPrice: false,
        price: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        unitPrice: {
          barterItems: [],
          currencyName: 'RUB',
          itemId: '',
          merchant: '',
          merchantLevel: 0,
          questId: '',
          value: 0,
          valueInMainCurrency: 0
        },
        unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
      },
      verticalRecoil: undefined,
      weight: 0
    })

    provide('editing', editing)

    watch(() => route.params, () => initialize())

    onMounted(() => {
      compatibilityService.emitter.on(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      compatibilityService.emitter.on(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
      compatibilityService.emitter.on(CompatibilityRequestType.mod, onModCompatibilityRequest)
      inventoryItemService.emitter.on(InventoryItemService.inventoryItemChangeEvent, onInventoryItemChanged)
      merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

      document.onkeydown = (e) => onKeyDown(e)
      initialize()
    })

    onUnmounted(() => {
      compatibilityService.emitter.off(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      compatibilityService.emitter.off(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
      compatibilityService.emitter.off(CompatibilityRequestType.mod, onModCompatibilityRequest)
      inventoryItemService.emitter.off(InventoryItemService.inventoryItemChangeEvent, onInventoryItemChanged)
      merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged)
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
    async function cancelEdit() {
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
      for (let i = 0; i < collapseStatuses.value.length; i++) {
        collapseStatuses.value[i] = true
      }
    }

    /**
     * Creates a copy of the current build.
     */
    function copy() {
      if (editing.value) {
        return
      }

      toggleAdvancedPanel(undefined)

      build.value.id = ''
      build.value.name = ''
      startEdit()
    }

    /**
     * Expands all the inventory slots.
     */
    function expandAll() {
      for (let i = 0; i < collapseStatuses.value.length; i++) {
        collapseStatuses.value[i] = false
      }
    }

    /**
     * Expands the inventory slots containing an item.
     */
    function expandWithItem() {
      for (let i = 0; i < collapseStatuses.value.length; i++) {
        if (build.value.inventorySlots[i].items.filter(i => i != undefined).length > 0) {
          collapseStatuses.value[i] = false
        }
      }
    }

    /**
     * Exports the build.
     */
    function exportBuild() {
      if (editing.value) {
        return
      }

      toggleAdvancedPanel(undefined)

      if (isNewBuild.value) {
        return
      }

      const exportResult = exportService.export([build.value])

      if (!exportResult.success) {
        notificationService.notify(NotificationType.error, exportResult.failureMessage)
      }
    }

    /**
     * Gets the collapse status of all the inventory slots.
     */
    function getCollapseStatuses() {
      for (const inventorySlot of build.value.inventorySlots) {
        collapseStatuses.value.push(inventorySlot.items.filter(i => i != undefined).length === 0)
      }
    }

    /**
     * Gets a shared build from an encoded string that can be shared in a URL.
     * @param sharableString - Encoded string that can be shared in a URL.
     */
    async function getSharedBuild(sharableString?: string) {
      if (sharableString === undefined) {
        return
      }

      const sharedBuildResult = await buildComponentService.getBuildFromSharableString(sharableString)

      if (!sharedBuildResult.success) {
        goToBuilds()

        return
      }

      build.value = sharedBuildResult.value
    }

    /**
     * Gets the values of the summary of the content of the build.
     */
    async function getSummary() {
      if (build.value === undefined) {
        return
      }

      const summaryResult = await buildPropertiesService.getSummary(build.value)

      if (!summaryResult.success) {
        notificationService.notify(NotificationType.error, summaryResult.failureMessage)

        return
      }

      summary.value = summaryResult.value
    }

    /**
     * Redirects to the builds page.
     */
    function goToBuilds() {
      router.push({ name: 'Builds' })
    }

    /**
     * Initializes the build.
     */
    function initialize() {
      isInitializing.value = true

      build.value = buildComponentService.getBuild(route.params['id'] as string)
      getSharedBuild(route.params['sharedBuild'] as string)
        .then(async () => {
          getCollapseStatuses()
          await getSummary()
        })
        .finally(() => isInitializing.value = false)

    }

    /**
     * Checks whether an armor can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onArmorCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(buildPropertiesService.checkCanAddArmor(build.value))
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
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault() // Prevents the browser save action to be triggered

        if (editing.value && !invalid.value) {
          save()
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
      request.setResult(buildPropertiesService.checkCanAddMod(build.value, request.itemId, request.path))
    }

    /**
     * Checks whether a tactical rig can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onTacticalRigCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(buildPropertiesService.checkCanAddVest(build.value, request.itemId))
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
    function save() {
      editing.value = false
      buildComponentService.saveBuild(router, build.value)
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
      originalBuild = JSON.parse(JSON.stringify(build.value)) // Creating a copy without reference of the build in its original state
    }

    /**
     * Toggles the ammunition counts panel.
     */
    function toggleAmmunitionCounts(event: unknown) {
      ammunitionCountsPanel.value.toggle(event)
    }

    /**
     * Toggles the advanced panel.
     * @param event - Event.
     */
    function toggleAdvancedPanel(event: unknown) {
      advancedPanel.value.toggle(event)
    }

    return {
      advancedPanel,
      ammunitionCountsPanel,
      build,
      cancelDelete,
      cancelEdit,
      collapseAll,
      collapseStatuses,
      confirmDelete,
      copy,
      deleting,
      editing,
      expandAll,
      expandWithItem,
      exportBuild,
      goToBuilds,
      invalid,
      inventorySlotPathPrefix,
      isEmpty,
      isInitializing,
      notExportedTooltip,
      path,
      remove,
      save,
      startDelete,
      startEdit,
      StatsUtils,
      summary,
      toggleAdvancedPanel,
      toggleAmmunitionCounts
    }
  }
})