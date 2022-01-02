import { computed, defineComponent, PropType } from 'vue'
import { IItem } from '../../models/item/IItem'
import ItemIcon from '../item-icon/ItemIconComponent.vue'

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
    const iconClass = computed(() => 'selected-item-icon' + (props.modelValue?.iconLink !== '' ? '' : ' selected-item-icon-border'))
    const iconUrl = computed(() => props.modelValue?.categoryId === 'mainWeapon' || props.modelValue?.categoryId === 'secondaryWeapon' ? props.modelValue?.imageLink : props.modelValue?.iconLink)

    return { iconClass, iconUrl }
  }
})