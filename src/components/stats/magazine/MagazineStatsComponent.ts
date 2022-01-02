import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IMagazine } from '../../../models/item/IMagazine'
import { MagazineStatsComponentService } from '../../../services/components/stats/MagazineStatsComponentService'
import Services from '../../../services/repository/Services'
import StatsUtils from '../../../utils/StatsUtils'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IMagazine>,
      required: true
    }
  },
  setup: (props) => {
    const acceptedCartridgesCaptions = ref<string[]>([])
    watch(() => props.item, () => getAcceptedCartridgesCaptions())

    onMounted(() => getAcceptedCartridgesCaptions())

    /**
     * Gets the captions of the accepted cartridges.
     */
    async function getAcceptedCartridgesCaptions() {
      acceptedCartridgesCaptions.value = await Services.get(MagazineStatsComponentService).getAcceptedCartridgesCaptions(props.item)
    }

    return {
      acceptedCartridgesCaptions,
      StatsUtils
    }
  }
})