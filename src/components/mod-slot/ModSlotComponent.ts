import { defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IItem } from '../../models/item/IItem'
import { IModSlot } from '../../models/item/IModSlot'
import { ModSlotComponentService } from '../../services/components/ModSlotComponentService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'

export default defineComponent({
  props: {
    inventoryModSlot: {
      type: Object as PropType<IInventoryModSlot>,
      required: true
    },
    modSlot: {
      type: Object as PropType<IModSlot>,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:inventory-mod-slot'],
  setup: (props) => {
    const globalFilterService = Services.get(GlobalFilterService)
    const modSlotComponentService = Services.get(ModSlotComponentService)

    const editing = inject<Ref<boolean>>('editing')

    const acceptedItems = ref<IItem[]>([])
    const acceptedItemsCategoryId = ref<string | undefined>(undefined)

    const itemPathPrefix = PathUtils.itemPrefix

    watch(() => props.modSlot, () => updateAcceptedItems())

    onMounted(() => {
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)
      updateAcceptedItems()
    })

    onUnmounted(() => globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged))

    /**
     * Updates the accepted items to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      updateAcceptedItems()
    }

    /**
     * Gets the category IDs and the accepted items to pass to the ItemComponent.
     */
    async function updateAcceptedItems() {
      acceptedItems.value = await Services.get(ItemService).getItems(props.modSlot.compatibleItemIds, true)
      acceptedItemsCategoryId.value = modSlotComponentService.getAcceptedItemsCategoryId(acceptedItems.value)
    }

    return {
      acceptedItems,
      acceptedItemsCategoryId,
      editing,
      itemPathPrefix
    }
  }
})
