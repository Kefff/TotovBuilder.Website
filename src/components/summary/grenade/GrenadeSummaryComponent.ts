import { computed, defineComponent, PropType } from 'vue'
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
  },
  setup: (props) => {
    const hasFragmentsAmount = computed(() => props.item.fragmentsAmount > 0)
    const hasMaximumExplosionRange = computed(() => props.item.maximumExplosionRange > 0)

    return {
      hasFragmentsAmount,
      hasMaximumExplosionRange
    }
  }
})