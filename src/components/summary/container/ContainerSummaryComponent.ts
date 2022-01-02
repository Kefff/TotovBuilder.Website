import { defineComponent, PropType } from 'vue'
import { IContainer } from '../../../models/item/IContainer'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IContainer>,
      required: true
    }
  }
})