import { computed, defineComponent, inject, nextTick, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import { ItemContentComponentService } from '../../services/components/ItemContentComponentService'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'

export default defineComponent({
  props: {
    containerItem: {
      type: Object as PropType<IContainer>,
      required: true
    },
    modelValue: {
      type: Array as PropType<IInventoryItem[]>,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const merchantFilterService = Services.get(MerchantFilterService)

    const editing = inject<Ref<boolean>>('editing')

    const canAddItem = computed(() => !isMagazine.value || props.modelValue.length === 0)
    const content = computed({
      get: () => props.modelValue,
      set: (value: IInventoryItem[]) => emit('update:modelValue', value)
    })
    const isMagazine = computed(() => props.containerItem.categoryId === 'magazine')
    const maximumQuantity = computed(() => isMagazine.value ? props.containerItem.capacity : undefined)

    const acceptedItems = ref<IItem[]>([])
    const categoryIds = ref<string[]>([])
    const itemPathPrefix = PathUtils.itemPrefix
    const itemToAdd = ref<IInventoryItem>()

    watch(() => props.containerItem.id, () => initialize())

    onMounted(() => {
      merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

      initialize()
    })

    onUnmounted(() => {
      merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged)
    })

    /**
     * Gets the accepted items for the item to add.
     */
    async function getAcceptedItems() {
      acceptedItems.value = await Services.get(ItemContentComponentService).getAcceptedItems(props.containerItem.id)
    }

    /**
     * Gets the category IDs used for determining the available sort buttons in the item selection dropdown.
     */
    async function getCategoryIds() {
      categoryIds.value = Services.get(ItemContentComponentService).getCategoryIds(props.containerItem.categoryId)
    }

    /**
     * Initializes the component.
     */
    async function initialize() {
      await getAcceptedItems()
      await getCategoryIds()
    }

    /**
     * Adds an item to the content of the inventory item and emits the change to the parent component.
     */
    async function onItemAdded(newInventoryItem: IInventoryItem) {
      content.value.push(newInventoryItem)

      nextTick(() => {
        // nextTick required in order to the emitting and the resetting of itemToAdd to work properly.
        // Also the resetting of itemToAdd must happen after the emit.
        itemToAdd.value = undefined
      })
    }

    /**
     * Emits to the parent component the updated inventory item.
     * @param updatedContainedInventoryItem - Updated contained item.
     * @param index - Index of the changed contained item in the inventory item content list.
     */
    async function onItemChanged(updatedContainedInventoryItem: IInventoryItem, index: number) {
      if (updatedContainedInventoryItem == null) {
        content.value.splice(index, 1)
      }
    }

    /**
     * Updates the accepted items to reflect the change in merchant filters.
     */
    function onMerchantFilterChanged() {
      getAcceptedItems()
    }

    return {
      acceptedItems,
      canAddItem,
      categoryIds,
      content,
      editing,
      isMagazine,
      itemPathPrefix,
      itemToAdd,
      maximumQuantity,
      onItemAdded,
      onItemChanged
    }
  }
})