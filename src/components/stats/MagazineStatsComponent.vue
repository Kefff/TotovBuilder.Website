<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ItemIcon from '../ItemIconComponent.vue'
import ContainerStats from './ContainerStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const acceptedAmmunition = ref<IItem[]>([])

const ergonomicsModifier = computed(() => magazine.value.presetErgonomicsModifier ?? magazine.value.ergonomicsModifier)
const hasModifiers = computed(() =>
  ergonomicsModifier.value !== 0
  || magazine.value.loadSpeedModifierPercentage !== 0
  || magazine.value.checkSpeedModifierPercentage !== 0)
const magazine = computed(() => props.item as IMagazine)

onMounted(() => getAcceptedAmmunition())

/**
 * Gets the captions of the accepted ammunition.
 */
async function getAcceptedAmmunition(): Promise<void> {
  const itemService = Services.get(ItemService)
  acceptedAmmunition.value = []

  for (const acceptedAmmunitionId of magazine.value.acceptedAmmunitionIds) {
    const ammunition = await itemService.getItem(acceptedAmmunitionId)
    acceptedAmmunition.value.push(ammunition)
  }
}
</script>










<template>
  <ContainerStats :item="magazine" />
  <div
    v-if="hasModifiers"
    class="stats-category"
  >
    {{ $t('caption.modifiers') }}
  </div>
  <div
    v-if="hasModifiers"
    class="stats-line"
  >
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
  </div>
  <div
    v-if="acceptedAmmunition.length > 0"
    class="stats-category"
  >
    {{ $t('caption.acceptedAmmunition') }}
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










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';

.magazine-stats-ammunition {
  height: unset;
}

.magazine-stats-ammunition:first-child {
  margin-top: 0.5rem
}

.magazine-stats-ammunition-icon {
  margin-right: 0.5rem;
}
</style>