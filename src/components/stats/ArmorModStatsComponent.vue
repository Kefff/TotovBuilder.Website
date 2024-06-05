<template>
  <ArmorStats
    v-if="armorMod.armorClass > 0"
    :item="item"
    :wearable-modifiers-override="armorMod.presetWearableModifiers"
  />
  <div
    v-if="armorMod.blindnessProtectionPercentage !== 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="low-vision"
          class="icon-before-text"
        />
        <span>{{ $t('caption.blindnessProtection') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(armorMod.blindnessProtectionPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.blindnessProtectionPercentage, armorMod.blindnessProtectionPercentage) }}
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IArmorMod } from '../../models/item/IArmorMod'
import { IItem } from '../../models/item/IItem'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ArmorStats from './ArmorStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const armorMod = computed(() => props.item as IArmorMod)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>