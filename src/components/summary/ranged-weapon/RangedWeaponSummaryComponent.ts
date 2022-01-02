import { defineComponent, PropType } from 'vue'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import StringUtils from '../../../utils/StringUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IRangedWeapon>,
      required: true
    }
  },
  setup: () => {
    return { StringUtils }
  }
})