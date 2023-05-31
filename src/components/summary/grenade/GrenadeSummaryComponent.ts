import { defineComponent, PropType } from 'vue'
import { IGrenade } from '../../../models/item/IGrenade'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IGrenade>,
      required: true
    },
    showEmptyEntries: {
      type: Boolean,
      required: false,
      default: true
    }
  }
})