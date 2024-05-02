import { defineComponent, PropType } from 'vue'
import Images from '../../../images'
import { IRangedWeapon } from '../../../models/item/IRangedWeapon'
import StatsUtils, { DisplayValueType } from '../../../utils/StatsUtils'
import StringUtils from '../../../utils/StringUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IRangedWeapon>,
      required: true
    }
  },
  setup: () => {
    return {
      DisplayValueType,
      Images,
      StatsUtils,
      StringUtils
    }
  }
})