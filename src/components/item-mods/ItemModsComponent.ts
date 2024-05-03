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
    modelValue: {
      type: Object as PropType<IInventoryModSlot[]>,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const modSlotPathPrefix = PathUtils.modSlotPrefix

    const inventoryModSlots = computed({
      get: () => props.modelValue,
      set: (value: IInventoryModSlot[]) => emit('update:modelValue', value)
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
          item: props.modelValue.find((ms) => ms.modSlotName === modSlot.name)?.item,
          modSlotName: modSlot.name
        })
      }

      inventoryModSlots.value = newInventoryModSlots

      isInitializing.value = false
    }

    return {
      inventoryModSlots,
      isInitializing,
      modSlotPathPrefix
    }
  }
})