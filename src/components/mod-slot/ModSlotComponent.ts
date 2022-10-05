import { defineComponent, inject, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IItem } from '../../models/item/IItem'
import { IModSlot } from '../../models/item/IModSlot'
import Services from '../../services/repository/Services'
import { ModSlotComponentService } from '../../services/components/ModSlotComponentService'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import { PathUtils } from '../../utils/PathUtils'

export default defineComponent({
  props: {
    modelValue: {
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
  emits: ['update:modelValue'],
  setup: (props) => {
    const merchantFilterService = Services.get(MerchantFilterService)
    const modSlotComponentService = Services.get(ModSlotComponentService)

    const editing = inject<Ref<boolean>>('editing')

    const acceptedItems = ref<IItem[]>([])
    const categoryIds = ref<string[]>([])

    const itemPathPrefix = PathUtils.itemPrefix

    watch(() => props.modSlot, () => getItemComponentParameters())

    onMounted(() => {
      merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)
      getItemComponentParameters()
    })

    onUnmounted(() => merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged))

    /**
     * Gets the category IDs and the accepted items to pass to the ItemComponent.
     */
    async function getItemComponentParameters() {
      acceptedItems.value = await modSlotComponentService.getAcceptedItems(props.modSlot.compatibleItemIds)
      categoryIds.value = modSlotComponentService.getCategoryIds(acceptedItems.value)
    }

    /**
     * Updates the accepted items to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      getItemComponentParameters()
    }

    return {
      acceptedItems,
      categoryIds,
      editing,
      itemPathPrefix
    }
  }
})
