import { defineComponent, PropType, ref, watch } from 'vue'
import { IAmmunition } from '../../../models/item/IAmmunition'
import { IGrenade } from '../../../models/item/IGrenade'
import { ItemService } from '../../../services/ItemService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import AmmunitionStats from '../ammunition/AmmunitionStatsComponent.vue'

export default defineComponent({
  components: {
    AmmunitionStats
  },
  props: {
    item: {
      type: Object as PropType<IGrenade>,
      required: true
    }
  },
  setup: (props) => {
    const fragmentAmmunition = ref<IAmmunition>()
    setFragmentAmmunition()
    watch(() => props.item, () => setFragmentAmmunition())

    /**
     * Sets the fragment ammunition based on the grenade passed to the component.
     */
    async function setFragmentAmmunition() {
      const itemResult = await Services.get(ItemService).getItem(props.item.fragmentAmmunitionId)

      if (!itemResult.success) {
        Services.get(NotificationService).notify(NotificationType.error, itemResult.failureMessage)

        return
      }

      fragmentAmmunition.value = itemResult.value as IAmmunition
    }

    return { fragmentAmmunition }
  }
})