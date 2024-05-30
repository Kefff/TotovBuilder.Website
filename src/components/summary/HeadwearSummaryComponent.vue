<template>
  <ArmorSummary
    :item="headwear"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="headwear.presetWearableModifiers"
  />
  <div
    v-if="hasRicochetChance || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="hasRicochetChance"
        v-tooltip.top="$t('caption.ricochetChance')"
        class="custom-icon-after-text"
      >
        <span>{{ $t('caption.ricochetChance' + headwear.ricochetChance) }}</span>
        <img :src="Images.ricochet">
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import ArmorSummary from './ArmorSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const hasRicochetChance = computed(() => headwear.value.ricochetChance !== '')
const headwear = computed(() => props.item as IHeadwear)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
</style>