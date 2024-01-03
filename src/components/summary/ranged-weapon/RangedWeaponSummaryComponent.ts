import { defineComponent, PropType } from 'vue'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import StringUtils from '../../../utils/StringUtils'
import Images from '../../../images'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IRangedWeapon>,
      required: true
    }
  },
  setup: () => {
    return {
      Images,
      StringUtils
    }
  }
})