<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="box-open"
          class="icon-before-text"
        />
        <span>{{ $t('caption.capacity') }} :</span>
      </div>
      <div class="stats-value">
        {{ magazine.capacity }}
      </div>
    </div>
    <div
      v-if="magazine.loadSpeedModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="sync-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.loadSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(magazine.loadSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.loadSpeedModifierPercentage, magazine.loadSpeedModifierPercentage) }}
      </div>
    </div>
    <div
      v-if="magazine.checkSpeedModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="eye"
          class="icon-before-text"
        />
        <span>{{ $t('caption.checkSpeed') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
      </div>
    </div>
    <div
      v-if="ergonomicsModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ergonomicsModifier)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifier, ergonomicsModifier) }}
      </div>
    </div>
  </div>
  <div v-if="acceptedAmmunition.length > 0">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img :src="Images.caliber">
        <span>{{ $t('caption.acceptedCartridges') }} :</span>
      </div>
    </div>
  </div>
  <div
    v-if="acceptedAmmunition.length > 0"
    class="stats-line"
  >
    <div
      v-for="(ammunition, index) of acceptedAmmunition"
      :key="index"
      class="stats-entry magazine-stats-ammunition"
    >
      <div class="stats-caption">
        <ItemIcon
          :item="ammunition"
          class="magazine-stats-ammunition-icon"
        />
        <span>{{ ammunition.name }}</span>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const acceptedAmmunition = ref<IItem[]>([])

const magazine = computed(() => props.item as IMagazine)
const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)

onMounted(() => getAcceptedAmmunition())

/**
 * Gets the captions of the accepted ammunition.
 */
async function getAcceptedAmmunition() {
  const itemService = Services.get(ItemService)
  acceptedAmmunition.value = []

  for (const acceptedAmmunitionId of magazine.value.acceptedAmmunitionIds) {
    const ammunition = await itemService.getItem(acceptedAmmunitionId)
    acceptedAmmunition.value.push(ammunition)
  }
}
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';

.magazine-stats-ammunition:first-child {
  margin-top: 0.5rem
}

.magazine-stats-ammunition-icon {
  margin-right: 0.5rem
}
</style>