import { computed, defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import Images from '../../images'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import { IItem } from '../../models/item/IItem'
import { IInventorySlotSummary } from '../../models/utils/IInventorySlotSummary'
import { InventorySlotComponentService } from '../../services/components/InventorySlotComponentService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { InventoryItemService } from '../../services/InventoryItemService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import { InventorySlotService } from '../../services/InventorySlotService'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
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
    const globalFilterService = Services.get(GlobalFilterService)
    const inventoryItemService = Services.get(InventoryItemService)
    const inventorySlotComponentService = Services.get(InventorySlotComponentService)
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const itemPathPrefix = PathUtils.itemPrefix

    const editing = inject<Ref<boolean>>('editing')

    const displayed = computed(() => editing?.value || props.modelValue.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item
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
    const inventorySlotType = computed(() => Services.get(InventorySlotService).getType(props.modelValue.typeId))

    const acceptedItems = ref<IItem[]>([])
    const acceptedItemsCategoryId = ref<string | undefined>(undefined)
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
        ergonomicsModifierPercentage: 0,
        movementSpeedModifierPercentage: 0,
        turningSpeedModifierPercentage: 0
      },
      weight: 0
    })

    watch(() => props.modelValue, async () => {
      await initialize() // Initialization required for the case when we cancel changes
    })

    onMounted(async () => {
      inventoryItemService.emitter.on(InventoryItemService.inventoryItemChangeEvent, onModOrContentChanged)
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      await initialize()
    })

    onUnmounted(() => {
      inventoryItemService.emitter.off(InventoryItemService.inventoryItemChangeEvent, onModOrContentChanged)
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

      await setItemComponentParameters()
      await getSummary()
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
     * Updates the inventory slot summary when a mod or content item changes.
     */
    async function onModOrContentChanged(path: string) {
      if (path.startsWith(props.path)) {
        await getSummary()
      }
    }

    /**
     * Updates the inventory slot summary to reflect price changes due to the change in merchant filters.
     */
    async function onMerchantFilterChanged() {
      await setItemComponentParameters()
      await getSummary()
    }

    /**
     * Sets the category IDs and the accepted items to pass to the ItemComponent.
     */
    async function setItemComponentParameters() {
      if (inventorySlotType.value == null) {
        return
      }

      acceptedItemsCategoryId.value = inventorySlotType.value.acceptedItemCategories.length === 1 ? inventorySlotType.value.acceptedItemCategories[0] : undefined
      acceptedItems.value = await Services.get(ItemService).getItemsOfCategories(inventorySlotType.value.acceptedItemCategories, true)
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
      displayed,
      DisplayValueType,
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
      Images,
      inventorySlotType,
      itemPathPrefix,
      items,
      onItemChanged,
      StatsUtils,
      StringUtils,
      summary,
      toggle
    }
  }
})
