<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ArmorItemCard from './ArmorItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    isBaseItem: false,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? headwear.value.presetArmorModifiers)
const boldCssClass = computed(() => props.includeModsAndContent ? 'headwear-item-card-bold' : '')
const hasRicochetChance = computed(() => headwear.value.ricochetChance !== '')
const headwear = computed(() => props.item as IHeadwear)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? headwear.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :include-mods-and-content="includeModsAndContent"
    :is-base-item="isBaseItem"
    :item="headwear"
    :wearable-modifiers-override="wearableModifiers"
  >
    <Tooltip
      v-if="!isBaseItem && hasRicochetChance"
      :tooltip="$t('caption.ricochetChance')"
      class="headwear-item-card-long"
      :class="boldCssClass"
    >
      <CustomIcon
        :icon="Images.ricochet"
        position="before"
      >
        <span>{{ $t('caption.ricochetChance' + headwear.ricochetChance) }}</span>
      </CustomIcon>
    </Tooltip>
  </ArmorItemCard>
</template>










<style scoped>
.headwear-item-card-bold {
  font-style: italic;
  font-weight: bold;
}

.headwear-item-card-long {
  display: flex;
  grid-column: span 2;
}
</style>