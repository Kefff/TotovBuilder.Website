<template>
  <div
    v-if="armorClass > 0"
    class="stats-line"
  >
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ $t('caption.armorClass') }} :</span>
      </div>
      <div class="stats-value">
        {{ armorClass }}
      </div>
    </div>
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
  </div>
  <div v-if="armor.armoredAreas.length > 0">
    <div stats-entry>
      <div class="stats-caption">
        <font-awesome-icon
          icon="shield-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.protects') }} :</span>
      </div>
    </div>
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
        <div class="icon-before-text" />
        <span>{{ $t('caption.armoredArea' + armoredArea) }}</span>
      </div>
    </div>
  </div>
  <WearableStats
    :item="armor"
    :wearable-modifiers-override="wearableModifiers"
  />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IArmor } from '../../models/item/IArmor'
import { IItem } from '../../models/item/IItem'
import WearableStats from './WearableStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const armor = computed(() => props.item as IArmor)
const armorClass = computed(() => armor.value.presetArmorModifiers?.armorClass ?? armor.value.armorClass)
const durability = computed(() => armor.value.presetArmorModifiers?.durability ?? armor.value.durability)
const wearableModifiers = computed(() => armor.value.presetWearableModifiers ?? undefined)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';

.armor-stats-durability {
  color: var(--error-color);
}
</style>