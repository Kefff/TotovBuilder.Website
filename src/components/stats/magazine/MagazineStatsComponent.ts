import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IMagazine } from '../../../models/item/IMagazine'
import { MagazineStatsComponentService } from '../../../services/components/stats/MagazineStatsComponentService'
import Services from '../../../services/repository/Services'
import StatsUtils from '../../../utils/StatsUtils'
import Images from '../../../images'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<IMagazine>,
      required: true
    }
  },
  setup: (props) => {
    const acceptedCartridesCaptions = ref<string[]>([])
    const ergonomicsModifier = computed(() => props.item.presetErgonomicsModifier ?? props.item.ergonomicsModifier)

    watch(() => props.item, () => getAcceptedCartridgesCaptions())

    onMounted(() => getAcceptedCartridgesCaptions())

    /**
     * Gets the captions of the accepted cartridges.
     */
    async function getAcceptedCartridgesCaptions() {
      acceptedCartridesCaptions.value = await Services.get(MagazineStatsComponentService).getAcceptedCartridgesNames(props.item)
    }

    return {
      acceptedCartridesCaptions,
      ergonomicsModifier,
      Images,
      StatsUtils
    }
  }
})