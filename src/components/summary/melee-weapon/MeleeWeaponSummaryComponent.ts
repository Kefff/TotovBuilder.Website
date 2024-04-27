import { defineComponent, PropType } from 'vue'
import { IMeleeWeapon } from '../../../models/item/IMeleeWeapon'
import Images from '../../../images'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IMeleeWeapon>,
      required: true
    }
  },
  setup: () => {
    return { Images }
  }
})