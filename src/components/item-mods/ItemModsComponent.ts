import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IModdable } from '../../models/item/IModdable'
import { IModSlot } from '../../models/item/IModSlot'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import { ItemService } from '../../services/ItemService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import ModSlot from '../mod-slot/ModSlotComponent.vue'

export default defineComponent({
  components: {
    ModSlot
  },
  props: {
    modelValue: {
      type: Object as PropType<IInventoryItem>,
      required: false,
      default: undefined
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const inventoryModSlots = ref<IInventoryModSlot[]>([])
    const modSlots = ref<IModSlot[]>([])

    const modSlotPathPrefix = PathUtils.modSlotPrefix

    watch(() => props.modelValue, () => getModSlots(), { deep: true })

    onMounted(() => getModSlots())

    /**
     * Gets the mod slots of the parent item.
     */
    async function getModSlots() {
      if (props.modelValue === undefined) {
        return
      }

      const itemResult = await Services.get(ItemService).getItem(props.modelValue.itemId)

      if (!itemResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

        return
      }

      if (!itemPropertiesService.isModdable(itemResult.value)) {
        // For some reason, when the parent item was set to moddable item, and we cancel de build modifications,
        // this component is still displayed for a shot moment even if the "selectedItemIsModdable" on the Item component
        // is false. So we need to return here. After that, the Item component will remove this component

        return
      }

      const newInventoryModSlots: IInventoryModSlot[] = []
      modSlots.value = (itemResult.value as IModdable).modSlots

      for (const modSlot of modSlots.value) {
        newInventoryModSlots.push({
          item: props.modelValue.modSlots.find((ms) => ms.modSlotName === modSlot.name)?.item,
          modSlotName: modSlot.name
        })
      }

      inventoryModSlots.value = newInventoryModSlots
    }

    /**
     * Emits to the parent component the updated inventory item.
     */
    function onUpdateModSlot() {
      if (props.modelValue === undefined) {
        return
      }

      const newInventoryItem: IInventoryItem = {
        content: props.modelValue.content,
        itemId: props.modelValue.itemId,
        modSlots: inventoryModSlots.value,
        quantity: props.modelValue.quantity
      }

      emit('update:modelValue', newInventoryItem)
    }

    return {
      inventoryModSlots,
      modSlotPathPrefix,
      modSlots,
      onUpdateModSlot
    }
  }
})