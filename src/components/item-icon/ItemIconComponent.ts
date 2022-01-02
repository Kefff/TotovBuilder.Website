import { computed, defineComponent, PropType } from 'vue'
import { IItem } from '../../models/item/IItem'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IItem>,
      required: true
    }
  },
  setup: (props) => {
    const itemPropertiesService = Services.get(ItemPropertiesService)

    const iconUrl = computed(() => {
      if (itemPropertiesService.isRangedWeapon(props.item) || props.item.iconLink === '') {
        return props.item.imageLink
      } else {
        return props.item.iconLink
      }
    })

    return { iconUrl }
  }
})