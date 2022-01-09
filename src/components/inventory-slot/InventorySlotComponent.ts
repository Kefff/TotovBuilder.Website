import { computed, defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import StringUtils from '../../utils/StringUtils'
import { IInventorySlot } from '../../models/build/IInventorySlot'
import Services from '../../services/repository/Services'
import { InventorySlotService } from '../../services/InventorySlotService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import { IItem } from '../../models/item/IItem'
import { InventorySlotComponentService } from '../../services/components/InventorySlotComponentService'
import { InventorySlotPropertiesService } from '../../services/InventorySlotPropertiesService'
import Item from '../item/ItemComponent.vue'
import StatsUtils from '../../utils/StatsUtils'
import { IInventorySlotType } from '../../models/build/IInventorySlotType'
import { IInventoryPrice } from '../../models/utils/IInventoryPrice'
import InventoryPrice from '../inventory-price/InventoryPriceComponent.vue'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { PathUtils } from '../../utils/PathUtils'

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
    const inventorySlotPropertiesService = Services.get(InventorySlotPropertiesService)
    const notificationService = Services.get(NotificationService)
    const merchantFilterService = Services.get(MerchantFilterService)

    const editing = inject<Ref<boolean>>('editing')

    merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

    const items = ref<(IInventoryItem | undefined)[]>([]) // Used to be able to put back the previously selected item when changing it to an incompatible item
    watch(() => props.modelValue.items, () => {
      items.value = [...props.modelValue.items]

      setItemComponentParameters()
      getSummary()
    }, { deep: true })

    const displayed = computed(() => editing?.value || props.modelValue.items.some((i) => i != undefined)) // Displayed only when in edit mode or when it contains at least one item

    const acceptedItems = ref<IItem[]>([])
    const categoryIds = ref<string[]>([])

    const canBeLooted = ref(true)
    const type = ref<IInventorySlotType>()
    const icon = ref<string>()
    const customIcon = ref<string>()

    const itemPathPrefix = PathUtils.itemPrefix

    const ergonomics = ref<number | undefined>()
    const ergonomicsPercentageModifier = ref<number | undefined>()
    const horizontalRecoil = ref<number | undefined>()
    const price = ref<IInventoryPrice>({
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
    })
    const verticalRecoil = ref<number | undefined>()
    const weight = ref(0)

    onMounted(() => {
      initialize().then(() => {
        setItemComponentParameters()
        getSummary()
      })
    })

    onUnmounted(() => merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged))

    /**
     * Initializes the inventory slot.
     */
    async function initialize() {
      items.value = [...props.modelValue.items]

      const canBeLootedResult = inventorySlotPropertiesService.canBeLooted(props.modelValue)

      if (!canBeLootedResult.success) {
        notificationService.notify(NotificationType.error, canBeLootedResult.failureMessage)
      }

      canBeLooted.value = canBeLootedResult.value

      const inventorySlotTypeResult = await Services.get(InventorySlotService).getType(props.modelValue.typeId)

      if (!inventorySlotTypeResult.success) {
        notificationService.notify(NotificationType.error, inventorySlotTypeResult.failureMessage)

        return
      }

      type.value = inventorySlotTypeResult.value
      icon.value = type.value.icon
      customIcon.value = type.value.customIcon
    }

    /**
     * Checks if the item can be selected. Emits the new value to the parent component if it can be selected; otherwise puts back the old item.
     * @param index - Index of the changed item.
     */
    async function onItemChanged(index: number) {
      const canSelect = await Services.get(InventorySlotComponentService).checkCompatibility(props.modelValue.typeId, items.value[index], props.path + '_' + index)

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
      if (type.value !== undefined) {
        categoryIds.value = type.value.acceptedItemCategories.map((aic) => aic.id)
        acceptedItems.value = await Services.get(InventorySlotComponentService).getAcceptedItems(categoryIds.value)
      }
    }

    /**
     * Gets the values of the summary of the content of the inventory slot.
     */
    async function getSummary() {
      const service = inventorySlotPropertiesService

      // Ergonomics
      const ergonomicsResult = await service.getErgonomics(props.modelValue)

      if (ergonomicsResult !== undefined) {
        if (!ergonomicsResult.success) {
          notificationService.notify(NotificationType.error, ergonomicsResult.failureMessage)

          return
        }

        ergonomics.value = ergonomicsResult.value
      } else {
        ergonomics.value = undefined
      }

      // Ergonomics percentage modifier
      const ergonomicsPercentageModifierResult = await service.getErgonomicsPercentageModifier(props.modelValue)

      if (ergonomicsPercentageModifierResult !== undefined) {
        if (!ergonomicsPercentageModifierResult.success) {
          notificationService.notify(NotificationType.error, ergonomicsPercentageModifierResult.failureMessage)

          return
        }

        ergonomicsPercentageModifier.value = ergonomicsPercentageModifierResult.value
      } else {
        ergonomicsPercentageModifier.value = undefined
      }

      // Price
      const priceResult = await service.getPrice(props.modelValue, canBeLooted.value)

      if (!priceResult.success) {
        notificationService.notify(NotificationType.error, priceResult.failureMessage)

        return
      }

      price.value = priceResult.value

      // Recoil
      const recoilResult = await service.getRecoil(props.modelValue)

      if (recoilResult !== undefined) {
        if (!recoilResult.success) {
          notificationService.notify(NotificationType.error, recoilResult.failureMessage)

          return
        }

        horizontalRecoil.value = recoilResult.value.horizontalRecoil
        verticalRecoil.value = recoilResult.value.verticalRecoil
      } else {
        horizontalRecoil.value = undefined
        verticalRecoil.value = undefined
      }

      // Weight
      const weightResult = await service.getWeight(props.modelValue)

      if (!weightResult.success) {
        notificationService.notify(NotificationType.error, weightResult.failureMessage)

        return
      }

      weight.value = weightResult.value
    }

    /**
     * Toggles the panel displaying the item.
     */
    function toggle() {
      emit('update:collapsed', !props.collapsed)
    }

    return {
      acceptedItems,
      canBeLooted,
      categoryIds,
      customIcon,
      displayed,
      ergonomics,
      ergonomicsPercentageModifier,
      horizontalRecoil,
      icon,
      itemPathPrefix,
      items,
      onItemChanged,
      price,
      StatsUtils,
      StringUtils,
      toggle,
      verticalRecoil,
      weight
    }
  }
})
