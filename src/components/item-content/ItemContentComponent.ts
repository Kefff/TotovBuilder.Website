import { computed, defineComponent, inject, nextTick, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IContainer } from '../../models/item/IContainer'
import { IItem } from '../../models/item/IItem'
import { ItemContentComponentService } from '../../services/components/ItemContentComponentService'
import { GlobalFilterService } from '../../services/GlobalFilterService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

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
    const itemPropertiesService = Services.get(ItemPropertiesService)
    const globalFilterService = Services.get(GlobalFilterService)

    const editing = inject<Ref<boolean>>('editing')

    const canAddItem = computed(() => !isMagazine.value || props.modelValue.length === 0)
    const content = computed({
      get: () => props.modelValue,
      set: (value: IInventoryItem[]) => emit('update:modelValue', value)
    })
    const isMagazine = computed(() => itemPropertiesService.isMagazine(props.containerItem))
    const maximumQuantity = computed(() => isMagazine.value ? props.containerItem.capacity : undefined)

    const acceptedItems = ref<IItem[]>([])
    const categoryIds = ref<string[]>([])
    const itemPathPrefix = PathUtils.itemPrefix
    const itemToAdd = ref<IInventoryItem>()

    const contentPathPrefix = PathUtils.contentPrefix

    watch(() => props.containerItem.id, () => initialize())

    onMounted(() => {
      globalFilterService.emitter.on(GlobalFilterService.changeEvent, onMerchantFilterChanged)

      initialize()
    })

    onUnmounted(() => {
      globalFilterService.emitter.off(GlobalFilterService.changeEvent, onMerchantFilterChanged)
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
      contentPathPrefix,
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