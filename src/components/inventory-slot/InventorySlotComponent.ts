import { computed, defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import StringUtils from '../../utils/StringUtils'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import Services from '../../services/repository/Services'
import { InventorySlotService } from '../../services/InventorySlotService'
import { IItem } from '../../models/item/IItem'
import { InventorySlotComponentService } from '../../services/components/InventorySlotComponentService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import Item from '../item/ItemComponent.vue'
import StatsUtils from '../../utils/StatsUtils'
import { IInventorySlotType } from '../../models/build/IInventorySlotType'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { PathUtils } from '../../utils/PathUtils'
import { IgnoredUnitPrice } from '../../models/utils/IgnoredUnitPrice'
import { InventoryItemService } from '../../services/InventoryItemService'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import Images from '../../images'

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

    const editing = inject<Ref<boolean>>('editing')

    const itemPathPrefix = PathUtils.itemPrefix

    const displayed = computed(() => editing?.value || props.modelValue.items.some((i) => i != null)) // Displayed only when in edit mode or when it contains at least one item

    const acceptedItems = ref<IItem[]>([])
    const acceptedItemsCategoryId = ref<string | undefined>(undefined)
    const canBeLooted = ref(true)
    const customIconName = ref<string>()
    const ergonomics = ref<number | undefined>()
    const horizontalRecoil = ref<number | undefined>()
    const icon = ref<string>()
    const items = ref<(IInventoryItem | undefined)[]>([]) // Used to be able to put back the previously selected item when changing it to an incompatible item
    const price = ref<IInventoryPrice>({
      missingPrice: false,
      price: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      priceWithContentInMainCurrency: {
        barterItems: [],
        currencyName: 'RUB',
        itemId: '',
        merchant: '',
        merchantLevel: 0,
        quest: undefined,
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
        quest: undefined,
        value: 0,
        valueInMainCurrency: 0
      },
      unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
    })
    const type = ref<IInventorySlotType>()
    const verticalRecoil = ref<number | undefined>()
    const wearableModifiers = ref<IWearableModifiers | undefined>()
    const weight = ref(0)

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
      const service = inventorySlotPropertiesService

      // Ergonomics
      const ergonomicsResult = await service.getErgonomics(props.modelValue)

      if (ergonomicsResult != null && ergonomicsResult.success) {
        ergonomics.value = ergonomicsResult.value
      } else {
        ergonomics.value = undefined
      }

      // Ergonomics percentage modifier
      const wearableModifiersResult = await service.getWearableModifiers(props.modelValue)

      if (wearableModifiersResult != null && wearableModifiersResult.success) {
        wearableModifiers.value = wearableModifiersResult.value
      } else {
        wearableModifiers.value = undefined
      }

      // Price
      const priceResult = await service.getPrice(props.modelValue, canBeLooted.value)

      if (priceResult.success) {
        price.value = priceResult.value
      } else {
        price.value = {
          missingPrice: true,
          price: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          priceWithContentInMainCurrency: {
            barterItems: [],
            currencyName: 'RUB',
            itemId: '',
            merchant: '',
            merchantLevel: 0,
            quest: undefined,
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
            quest: undefined,
            value: 0,
            valueInMainCurrency: 0
          },
          unitPriceIgnoreStatus: IgnoredUnitPrice.notIgnored
        }
      }

      // Recoil
      const recoilResult = await service.getRecoil(props.modelValue)

      if (recoilResult != null && recoilResult.success) {
        horizontalRecoil.value = recoilResult.value.horizontalRecoil
        verticalRecoil.value = recoilResult.value.verticalRecoil
      } else {
        horizontalRecoil.value = undefined
        verticalRecoil.value = undefined
      }

      // Weight
      const weightResult = await service.getWeight(props.modelValue)

      if (weightResult.success) {
        weight.value = weightResult.value
      } else {
        weight.value = 0
      }
    }

    /**
     * Initializes the inventory slot.
     */
    async function initialize() {
      items.value = [...props.modelValue.items]

      const canBeLootedResult = inventorySlotPropertiesService.canBeLooted(props.modelValue)

      if (canBeLootedResult.success) {
        canBeLooted.value = canBeLootedResult.value
      } else {
        canBeLooted.value = true
      }

      const inventorySlotTypeResult = await inventorySlotService.getType(props.modelValue.typeId)

      if (inventorySlotTypeResult.success) {
        type.value = inventorySlotTypeResult.value
        customIconName.value = type.value.customIcon
        icon.value = type.value.icon
      } else {
        type.value = undefined
        customIconName.value = undefined
        icon.value = undefined
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
      canBeLooted,
      customIconName,
      displayed,
      ergonomics,
      horizontalRecoil,
      icon,
      Images,
      itemPathPrefix,
      items,
      onItemChanged,
      price,
      StatsUtils,
      StringUtils,
      toggle,
      verticalRecoil,
      wearableModifiers,
      weight
    }
  }
})
