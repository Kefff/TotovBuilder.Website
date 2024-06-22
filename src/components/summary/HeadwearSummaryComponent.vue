<template>
  <ArmorSummary
    :armor-modifiers-override="armorModifiers"
    :item="headwear"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiers"
  />
  <div
    v-if="hasRicochetChance || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="hasRicochetChance">
        <Tooltip
          :tooltip="$t('caption.ricochetChance')"
          class="custom-icon-after-text"
        >
          <span>{{ $t('caption.ricochetChance' + headwear.ricochetChance) }}</span>
          <img :src="Images.ricochet">
        </Tooltip>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import ArmorSummary from './ArmorSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    showEmptyEntries: true,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? headwear.value.presetArmorModifiers)
const hasRicochetChance = computed(() => headwear.value.ricochetChance !== '')
const headwear = computed(() => props.item as IHeadwear)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? headwear.value.presetWearableModifiers)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';
</style>