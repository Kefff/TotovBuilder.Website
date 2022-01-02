import { defineComponent, PropType } from 'vue'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IMeleeWeapon>,
      required: true
    }
  }
})