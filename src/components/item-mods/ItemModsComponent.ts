import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IModdable } from '../../models/item/IModdable'
import { IModSlot } from '../../models/item/IModSlot'
import { PathUtils } from '../../utils/PathUtils'
import ModSlot from '../mod-slot/ModSlotComponent.vue'

export default defineComponent({
  components: {
    ModSlot
  },
  props: {
    moddableItem: {
      type: Object as PropType<IModdable>,
      required: true
    },
    inventoryModSlots: {
      type: Object as PropType<IInventoryModSlot[]>,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:inventory-mod-slots'],
  setup: (props, { emit }) => {
    const modSlotPathPrefix = PathUtils.modSlotPrefix

    const inventoryModSlotsInternal = computed({
      get: () => props.inventoryModSlots,
      set: (value: IInventoryModSlot[]) => emit('update:inventory-mod-slots', value)
    })

    const isInitializing = ref(true)
    const moddableItemInternal = ref<IModdable>(props.moddableItem)

    watch(() => props.moddableItem.id, () => initialize())

    onMounted(() => initialize())

    /**
     * Gets the mod slots of the parent item and adds them to the list of inventory mod slots received.
     */
    function initialize() {
      isInitializing.value = true

      if (props.moddableItem.categoryId === 'notFound') {
        // When an item in a build contains is not found, we assume it is moddable in order to be able
        // to display its possible mods.
        // We create a fake list of mod slots for it.
        const modSlots: IModSlot[] = []

        for (const inventoryModSlot of props.inventoryModSlots) {
          modSlots.push({
            compatibleItemIds: [inventoryModSlot.item?.itemId ?? ''],
            maxStackableAmount: 1,
            name: inventoryModSlot.modSlotName,
            required: false
          })
        }

        moddableItemInternal.value.modSlots = modSlots
      }

      isInitializing.value = false
    }

    return {
      inventoryModSlotsInternal,
      isInitializing,
      moddableItemInternal,
      modSlotPathPrefix
    }
  }
})