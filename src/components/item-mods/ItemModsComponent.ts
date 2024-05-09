import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IInventoryModSlot } from '../../models/build/IInventoryModSlot'
import { IModdable } from '../../models/item/IModdable'
import { PathUtils } from '../../utils/PathUtils'
import ModSlot from '../mod-slot/ModSlotComponent.vue'

export default defineComponent({
  components: {
    ModSlot
  },
  props: {
    containerItem: {
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

    watch(() => props.containerItem.id, () => initialize())

    onMounted(() => initialize())

    /**
     * Gets the mod slots of the parent item and adds them to the list of inventory mod slots received.
     */
    function initialize() {
      isInitializing.value = true

      const newInventoryModSlots: IInventoryModSlot[] = []

      for (const modSlot of props.containerItem.modSlots) {
        newInventoryModSlots.push({
          item: props.inventoryModSlots.find((ms) => ms.modSlotName === modSlot.name)?.item,
          modSlotName: modSlot.name
        })
      }

      inventoryModSlotsInternal.value = newInventoryModSlots

      isInitializing.value = false
    }

    return {
      inventoryModSlotsInternal,
      isInitializing,
      modSlotPathPrefix
    }
  }
})