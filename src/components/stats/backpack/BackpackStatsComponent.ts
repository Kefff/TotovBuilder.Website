import { defineComponent, PropType } from 'vue'
import ContainerStats from '../container/ContainerStatsComponent.vue'
import WearableStats from '../wearable/WearableStatsComponent.vue'
import { IBackpack } from '../../../models/item/IBackpack'

export default defineComponent({
  components: {
    ContainerStats,
    WearableStats
  },
  props: {
    item: {
      type: Object as PropType<IBackpack>,
      required: true
    }
  }
})