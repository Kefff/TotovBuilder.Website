import { computed, defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import Images from '../../images'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import { IInventorySlotType } from '../../models/build/IInventorySlotType'
import { IItem } from '../../models/item/IItem'
import { IInventorySlotSummary } from '../../models/utils/IInventorySlotSummary'
import { InventorySlotComponentService } from '../../services/components/InventorySlotComponentService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../services/InventorySlotService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import StatsUtils from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import Item from '../item/ItemComponent.vue'

export default defineComponent({
  components: {
    InventoryPrice,
    Item
  },
  props: {
    modelValue: {
      type: Object as PropType<IInventorySlot>,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: true
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'update:collapsed'],
  setup: (props, { emit }) => {
    const inventoryItemService = Services.get(InventoryItemService)
    const inventorySlotComponentService = Services.get(InventorySlotComponentService)
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const inventorySlotService = Services.get(InventorySlotService)
    const globalFilterService = Services.get(GlobalFilterService)

    const hasSummaryErgonomics = computed(() => summary.value.ergonomics !== 0)
    const hasSummaryErgonomicsPercentageModifier = computed(() => summary.value.wearableModifiers.ergonomicsPercentageModifier !== 0)
    const hasSummaryHorizontalRecoil = computed(() => summary.value.recoil.horizontalRecoil !== 0)
    const hasSummaryMovementSpeedPercentageModifier = computed(() => summary.value.wearableModifiers.movementSpeedPercentageModifier !== 0)
    const hasSummaryPrice = computed(() => summary.value.price.priceInMainCurrency !== 0)
    const hasSummaryStats = computed(() => hasSummaryErgonomics.value || hasSummaryHorizontalRecoil.value || hasSummaryVerticalRecoil.value)
    const hasSummaryTurningSpeedPercentageModifier = computed(() => summary.value.wearableModifiers.turningSpeedPercentageModifier !== 0)
    const hasSummaryVerticalRecoil = computed(() => summary.value.recoil.verticalRecoil !== 0)
    const hasSummaryWearableModifiers = computed(() => hasSummaryErgonomicsPercentageModifier.value
      || hasSummaryMovementSpeedPercentageModifier.value
      || hasSummaryTurningSpeedPercentageModifier.value
    )
    const hasSummaryWeight = computed(() => summary.value.weight !== 0)

    const editing = inject<Ref<boolean>>('editing')

    const itemPathPrefix = PathUtils.itemPrefix

    const displayed = computed(() => editing?.value || props.modelValue.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item

    const acceptedItems = ref<IItem[]>([])
    const acceptedItemsCategoryId = ref<string | undefined>(undefined)
    const customIconName = ref<string>()
    const icon = ref<string>()
    const items = ref<(IInventoryItem | undefined)[]>([]) // Used to be able to put back the previously selected item when changing it to an incompatible item
    const summary = ref<IInventorySlotSummary>({
      armorModifiers: {
        armorClass: 0,
        durability: 0
      },
      ergonomics: 0,
      price: {
        missingPrice: false,
        priceInMainCurrency: 0,
        priceByCurrency: []
      },
      recoil: {
        horizontalRecoil: 0,
        verticalRecoil: 0
      },
      type: {
        acceptedItemCategories: [],
        canBeLooted: false,
        displayOrder: 0,
        id: '',
        itemSlotsAmount: 0
      },
      wearableModifiers: {
        ergonomicsPercentageModifier: 0,
        movementSpeedPercentageModifier: 0,
        turningSpeedPercentageModifier: 0
      },
      weight: 0
    })
    const type = ref<IInventorySlotType>()

    watch(() => props.modelValue.items, () => initialize())

    onMounted(() => {
      inventoryItemService.emitter.on(InventoryItemService.inventoryItemChangeEvent, onInventoryItemChanged)
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      initialize()
    })

    onUnmounted(() => {
      inventoryItemService.emitter.off(InventoryItemService.inventoryItemChangeEvent, onInventoryItemChanged)
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
    })

    /**
     * Gets the values of the summary of the content of the inventory slot.
     */
    async function getSummary() {
      summary.value = await inventorySlotPropertiesService.getSummary(props.modelValue)
    }

    /**
     * Initializes the inventory slot.
     */
    async function initialize() {
      items.value = [...props.modelValue.items]

      const inventorySlotTypeResult = inventorySlotService.getType(props.modelValue.typeId)

      if (inventorySlotTypeResult.success) {
        type.value = inventorySlotTypeResult.value
        customIconName.value = type.value.customIcon
        icon.value = type.value.icon
      }

      setItemComponentParameters()
      getSummary()
    }

    /**
     * Checks if the item can be selected. Emits the new value to the parent component if it can be selected; otherwise puts back the old item.
     * @param index - Index of the changed item.
     */
    async function onItemChanged(index: number) {
      const canSelect = await inventorySlotComponentService.checkCompatibility(props.modelValue.typeId, items.value[index], props.path + '_' + index)

      if (canSelect) {
        const updatedInventorySlot: IInventorySlot = {
          items: items.value,
          typeId: props.modelValue.typeId
        }

        emit('update:modelValue', updatedInventorySlot)
      } else {
        // Putting back the old item
        items.value[index] = props.modelValue.items[index]
      }
    }

    /**
     * Updates the summary when an InventorySlot changes.
     */
    function onInventoryItemChanged(path: string) {
      if (path.startsWith(props.path)) {
        getSummary()
      }
    }

    /**
     * Updates the inventory slot summary to reflect price changes due to the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      setItemComponentParameters()
      getSummary()
    }

    /**
     * Sets the category IDs and the accepted items to pass to the ItemComponent.
     */
    async function setItemComponentParameters() {
      if (type.value != null) {
        acceptedItemsCategoryId.value = type.value.acceptedItemCategories.length === 1 ? type.value.acceptedItemCategories[0] : undefined
        acceptedItems.value = await inventorySlotComponentService.getAcceptedItems(type.value.acceptedItemCategories)
      }
    }

    /**
     * Toggles the panel displaying the item.
     */
    function toggle() {
      emit('update:collapsed', !props.collapsed)
    }

    return {
      acceptedItems,
      acceptedItemsCategoryId,
      customIconName,
      displayed,
      hasSummaryErgonomics,
      hasSummaryErgonomicsPercentageModifier,
      hasSummaryHorizontalRecoil,
      hasSummaryMovementSpeedPercentageModifier,
      hasSummaryPrice,
      hasSummaryStats,
      hasSummaryTurningSpeedPercentageModifier,
      hasSummaryVerticalRecoil,
      hasSummaryWearableModifiers,
      hasSummaryWeight,
      icon,
      Images,
      itemPathPrefix,
      items,
      onItemChanged,
      StatsUtils,
      StringUtils,
      summary,
      toggle,
      type
    }
  }
})
