import { computed, defineComponent, PropType } from 'vue'
import { IItem } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import ItemIcon from '../item-icon/ItemIconComponent.vue'

export default defineComponent({
  components: {
    ItemIcon
  },
  props: {
    item: {
      type: Object as PropType<IItem | undefined>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const iconClass = computed(() => 'selected-item-icon' + (props.item?.iconLink !== '' ? '' : ' selected-item-icon-border'))
    const iconUrl = computed(() => {
      if (props.item != null && itemPropertiesService.isRangedWeapon(props.item)) {
        return props.item.imageLink
      }

      return props.item?.iconLink
    })

    return {
      iconClass,
      iconUrl
    }
  }
})