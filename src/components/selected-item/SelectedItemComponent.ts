import { computed, defineComponent, PropType } from 'vue'
import { IItem } from '../../models/item/IItem'
import ItemIcon from '../item-icon/ItemIconComponent.vue'
import Services from '../../services/repository/Services'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'

export default defineComponent({
  components: {
    ItemIcon
  },
  props: {
    modelValue: {
      type: Object as PropType<IItem | undefined>,
      required: false,
      default: undefined
    }
  },
  setup: (props) => {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const iconClass = computed(() => 'selected-item-icon' + (props.modelValue?.iconLink !== '' ? '' : ' selected-item-icon-border'))
    const iconUrl = computed(() => {
      if (props.modelValue != null && itemPropertiesService.isRangedWeapon(props.modelValue)) {
        return props.modelValue.imageLink
      }

      return props.modelValue?.iconLink
    })

    return { iconClass, iconUrl }
  }
})