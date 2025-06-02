<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IMagazine } from '../../models/item/IMagazine'
import { ItemService } from '../../services/ItemService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import AmmunitionItemCard from '../item-card/AmmunitionItemCardComponent.vue'
import ContainerStats from './ContainerStatsComponent.vue'
import StatsItems from './StatsItemsComponent.vue'

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

onMounted(() => getAcceptedAmmunitionAsync())

/**
 * Gets the accepted ammunition of the magazine.
 */
async function getAcceptedAmmunitionAsync(): Promise<void> {
  const itemService = Services.get(ItemService)
  acceptedAmmunition.value = await itemService.getItemsAsync(magazine.value.acceptedAmmunitionIds, false)
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
        <span>{{ $t('caption.ergonomicsModifier') }} :</span>
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
        <span>{{ $t('caption.loadSpeedModifierPercentage') }} :</span>
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
        <span>{{ $t('caption.checkSpeedModifierPercentage') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(magazine.checkSpeedModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.checkSpeedModifierPercentage, magazine.checkSpeedModifierPercentage) }}
      </div>
    </div>
    <div
      v-if="magazine.malfunctionPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="exclamation"
          class="icon-before-text"
        />
        <span>{{ $t('caption.malfunctionPercentage') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(magazine.malfunctionPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.malfunctionPercentage, magazine.malfunctionPercentage) }}
      </div>
    </div>
  </div>
  <StatsItems
    :caption="$t('caption.acceptedAmmunition')"
    :items="acceptedAmmunition"
  >
    <template #specializedStats="slotProps">
      <AmmunitionItemCard :item="slotProps.item" />
    </template>
  </StatsItems>
</template>