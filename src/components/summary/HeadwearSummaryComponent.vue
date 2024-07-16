<template>
  <ArmorSummary
    :armor-modifiers-override="armorModifiers"
    :include-mods-and-content="includeModsAndContent"
    :is-base-item="isBaseItem"
    :item="headwear"
    :show-empty-entries="showEmptyEntries"
    :wearable-modifiers-override="wearableModifiers"
  />
  <div
    v-if="(!isBaseItem && hasRicochetChance) || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="hasRicochetChance">
        <Tooltip :tooltip="$t('caption.ricochetChance')">
          <CustomIcon
            :icon="Images.ricochet"
            position="before"
          >
            <span>{{ $t('caption.ricochetChance' + headwear.ricochetChance) }}</span>
          </CustomIcon>
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
import CustomIcon from '../CustomIconComponent.vue'
import ArmorSummary from './ArmorSummaryComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    showEmptyEntries?: boolean,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    isBaseItem: false,
    includeModsAndContent: false,
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

.headwear-summary-bold {
  font-style: italic;
  font-weight: bold;
}
</style>