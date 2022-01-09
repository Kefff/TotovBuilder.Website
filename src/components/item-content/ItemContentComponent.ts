import { computed, defineComponent, inject, nextTick, onMounted, onUnmounted, PropType, Ref, ref, watch } from 'vue'
import { IInventoryItem } from '../../models/build/IInventoryItem'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { ItemContentComponentService } from '../../services/components/ItemContentComponentService'
import { ItemService } from '../../services/ItemService'
import { MerchantFilterService } from '../../services/MerchantFilterService'
import { NotificationService, NotificationType } from '../../services/NotificationService'
import Services from '../../services/repository/Services'
import { PathUtils } from '../../utils/PathUtils'

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<IInventoryItem>,
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

    merchantFilterService.emitter.on(MerchantFilterService.changeEvent, onMerchantFilterChanged)

    const containerItem = ref<IItem>()
    const acceptedItems = ref<IItem[]>([])
    const categoryIds = ref<string[]>([])
    const isMagazine = computed(() => containerItem.value?.categoryId === 'magazine')

    watch(() => props.modelValue.itemId, () => initialize())

    const itemToAdd = ref<IInventoryItem>()
    const canAddItem = computed(() => containerItem.value != undefined && (!isMagazine.value || props.modelValue.content.length === 0)) // item.value != undefined is required to avoid displaying the ItemComponent for children before the IItem data is retrieved.
    const maximumQuantity = computed(() => isMagazine.value ? (containerItem.value as IMagazine).capacity : undefined)

    const itemPathPrefix = PathUtils.itemPrefix

    onMounted(() => initialize())

    onUnmounted(() => {
      merchantFilterService.emitter.off(MerchantFilterService.changeEvent, onMerchantFilterChanged)
    })

    /**
     * Gets the accepted items for the item to add.
     */
    async function getAcceptedItems() {
      acceptedItems.value = await Services.get(ItemContentComponentService).getAcceptedItems(props.modelValue.itemId)
    }

    /**
     * Gets the item corresponding to the inventory item passed to the component.
     */
    async function getContainerItem() {
      const itemResult = await Services.get(ItemService).getItem(props.modelValue.itemId)

      if (!itemResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

        return
      }

      containerItem.value = itemResult.value
    }

    /**
     * Gets the category IDs used for determining the available sort buttons in the item selection dropdown.
     */
    async function getCategoryIds() {
      categoryIds.value = Services.get(ItemContentComponentService).getCategoryIds(containerItem.value?.categoryId ?? 'item')
    }

    /**
     * Initializes the component.
     */
    async function initialize() {
      await getContainerItem()
      await getAcceptedItems()
      await getCategoryIds()
    }

    /**
     * Adds an item to the content of the inventory item and emits the change to the parent component.
     */
    async function onItemAdded(newContainedInventoryItem: IInventoryItem) {
      const newInventoryItem = props.modelValue
      newInventoryItem.content.push(newContainedInventoryItem)

      nextTick(() => {
        // nextTick required in order to the emitting and the resetting of itemToAdd to work properly.
        // Also the resetting of itemToAdd must happen after the emit.
        emit('update:modelValue', newInventoryItem)
        itemToAdd.value = undefined
      })
    }

    /**
     * Emits to the parent component the updated inventory item.
     * @param newContainedInventoryItem - New contained item.
     * @param index - Index of the changed contained item in the inventory item content list.
     */
    async function onItemChanged(newContainedInventoryItem: IInventoryItem, index: number) {
      const newInventoryItem = props.modelValue

      if (newContainedInventoryItem === undefined) {
        newInventoryItem.content.splice(index, 1)
      }

      emit('update:modelValue', newInventoryItem)
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
      containerItem,
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