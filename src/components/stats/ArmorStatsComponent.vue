<script setup lang="ts">
import { computed } from 'vue'
import { IArmor } from '../../models/item/IArmor'
import { IItem } from '../../models/item/IItem'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import ModdableStats from './ModdableStatsComponent.vue'
import WearableStats from './WearableStatsComponent.vue'

const props =
  defineProps<{
    item: IItem,
    showModifiers?: boolean,
  }>()

const armor = computed(() => props.item as IArmor)
const armorClass = computed(() => armor.value.presetArmorModifiers?.armorClass ?? armor.value.armorClass)
const durability = computed(() => armor.value.presetArmorModifiers?.durability ?? armor.value.durability)
const hasModifiers = computed(() => armor.value.blindnessProtectionPercentage !== 0)
</script>










<template>
  <div
    v-if="armorClass > 0"
    class="stats-category"
  >
    {{ $t('caption.armor') }}
  </div>
  <div
    v-if="armorClass > 0 || durability > 0"
    class="stats-line"
  >
    <div
      v-if="durability > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="heart"
          class="icon-before-text armor-stats-durability"
        />
        <span>{{ $t('caption.durability') }} :</span>
      </div>
      <div class="stats-value">
        {{ durability }}
      </div>
    </div>
    <div
      v-if="armorClass > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ $t('caption.armorClass') }} :</span>
      </div>
      <div class="stats-value">
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
          :class="`armor-penetration${armorClass}`"
        />
        <span>{{ armorClass }}</span>
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="swatchbook"
          class="icon-before-text"
        />
        <span>{{ $t('caption.material') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.material' + armor.material) }}
      </div>
    </div>
    <slot />
  </div>
  <WearableStats
    :item="armor"
    :show-modifiers-category="hasModifiers"
  />
  <div
    v-if="armor.blindnessProtectionPercentage !== 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="low-vision"
          class="icon-before-text"
        />
        <span>{{ $t('caption.blindnessProtectionPercentage') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(armor.blindnessProtectionPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.blindnessProtectionPercentage, armor.blindnessProtectionPercentage) }}
      </div>
    </div>
  </div>
  <div
    v-if="armor.armoredAreas.length > 0"
    class="stats-category"
  >
    {{ $t('caption.protectedZones') }}
  </div>
  <div
    v-if="armor.armoredAreas.length > 0"
    class="stats-line"
  >
    <div
      v-for="armoredArea of armor.armoredAreas"
      :key="armoredArea"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text">
          <font-awesome-icon
            v-if="armoredArea.endsWith('PLATE')"
            icon="shield-alt"
            class="icon-before-text"
          />
        </div>
        <span>{{ $t('caption.armoredArea' + armoredArea) }}</span>
      </div>
    </div>
  </div>
  <ModdableStats :item="armor" />
</template>










<style scoped>
.armor-stats-durability {
  color: var(--error-color);
}
</style>