import { computed, defineComponent, provide, ref, watch, nextTick, onUnmounted, onMounted } from 'vue'
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
    const exportService = Services.get(ExportService)
    const notificationService = Services.get(NotificationService)
    const merchantFilterService = Services.get(MerchantFilterService)
    const buildPropertiesService = Services.get(BuildPropertiesService)

    merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

    const build = ref<IBuild>(buildComponentService.getBuild(route.params['id'] as string))
    watch(() => route.params, (newParams) => build.value = buildComponentService.getBuild(newParams['id'] as string))
    watch(() => route.params, async (newParams) => getSharedBuild(newParams['sharedBuild'] as string))

    const newBuild = computed(() => build.value.id === '')
    let originalBuild: IBuild

    const editing = newBuild.value ? ref(true) : ref(false)
    provide('editing', editing)

    const deleting = ref(false)
    const invalid = computed(() => build.value.name === '')
    const isEmpty = computed(() => !build.value.inventorySlots.some(is => is.items.some(i => i != undefined)))
    const isLoading = ref(false)
    const collapseStatuses = ref<boolean[]>([])

    const compatibilityService = Services.get(CompatibilityService)
    compatibilityService.emitter.on(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
    compatibilityService.emitter.on(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)

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
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        },
        priceWithContentInMainCurrency: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        },
        pricesWithContent: [],
        unitPrice: {
          currencyName: 'RUB',
          merchant: undefined,
          merchantLevel: undefined,
          requiresQuest: false,
          value: 0,
          valueInMainCurrency: 0
        }
      },
      verticalRecoil: undefined,
      weight: 0
    })
    const notExportedTooltip = computed(() => !summary.value.exported ? buildPropertiesService.getNotExportedTooltip(summary.value.lastUpdated, summary.value.lastExported) : '')

    const ammunitionCountsPanel = ref()

    const advancedPanel = ref()

    onMounted(() => {
      document.onkeydown = (e) => onKeyDown(e)
      getSharedBuild(route.params['sharedBuild'] as string).then(() => {
        getCollapseStatuses()
        getSummary()
      })
    })

    onUnmounted(() => {
      compatibilityService.emitter.off(CompatibilityRequestType.armor, onArmorCompatibilityRequest)
      compatibilityService.emitter.off(CompatibilityRequestType.tacticalRig, onTacticalRigCompatibilityRequest)
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

      if (newBuild.value) {
        goToBuilds()
      } else {
        await nextTick() // Required otherwise some of the ItemComponents keep their actual value for some reason
        build.value = originalBuild
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

      if (newBuild.value) {
        return
      }

      const exportResult = exportService.export([build.value])

      if (!exportResult.success) {
        notificationService.notify(NotificationType.error, exportResult.failureMessage)
      }

      getSummary()
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
     * Gets the values of the summary of the content of the inventory slot.
     */
    async function getSummary() {
      if (build.value === undefined) {
        return
      }

      isLoading.value = true

      const service = Services.get(BuildPropertiesService)
      const summaryResult = await service.getSummary(build.value)

      if (!summaryResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, summaryResult.failureMessage)

        return
      }

      summary.value = summaryResult.value

      isLoading.value = false
    }

    /**
     * Redirects to the builds page.
     */
    function goToBuilds() {
      router.push({ name: 'Builds' })
    }

    /**
     * Updates the summary when an InventorySlot changes.
     */
    function onInventorySlotChanged() {
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
     * Checks whether an armor can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onArmorCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(Services.get(BuildPropertiesService).checkCanAddArmor(build.value))
    }

    /**
     * Updates the build summary price to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      getSummary()
    }

    /**
     * Checks whether a tactical rig can be added to the build or not.
     * @param request - Compatibility request.
     */
    function onTacticalRigCompatibilityRequest(request: CompatibilityRequest) {
      request.setResult(Services.get(BuildPropertiesService).checkCanAddVest(build.value, request.itemId))
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
      getSummary()
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
      isEmpty,
      isLoading,
      newBuild,
      notExportedTooltip,
      onInventorySlotChanged,
      remove,
      save,
      startDelete,
      startEdit,
      StatsUtils,
      summary,
      toggleAmmunitionCounts,
      toggleAdvancedPanel
    }
  }
})