import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { IAmmunition } from '../../../models/item/IAmmunition'
import { IGrenade } from '../../../models/item/IGrenade'
import { ItemService } from '../../../services/ItemService'
import { NotificationService, NotificationType } from '../../../services/NotificationService'
import Services from '../../../services/repository/Services'
import * as TarkovValues from '../../../assets/data/tarkov-values.json'

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
    const fragmentAmmunition = ref<IAmmunition>()
    watch(() => props.item, () => setFragmentAmmunition())

    const canOneshot = computed(() => fragmentAmmunition.value !== undefined ? fragmentAmmunition.value.fleshDamage >= TarkovValues.chestHp : false)
    const hasFragmentsAmount = computed(() => props.item.fragmentsAmount > 0)
    const hasMaximumExplosionRange = computed(() => props.item.maximumExplosionRange > 0)

    onMounted(() => setFragmentAmmunition())

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

    return {
      canOneshot,
      fragmentAmmunition,
      hasFragmentsAmount,
      hasMaximumExplosionRange
    }
  }
})