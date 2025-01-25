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
    displayEmptyLines?: boolean,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    displayEmptyLines: true,
    isBaseItem: false,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const armorModifiers = computed(() => props.armorModifiersOverride ?? headwear.value.presetArmorModifiers)
const hasRicochetChance = computed(() => headwear.value.ricochetChance !== '')
const headwear = computed(() => props.item as IHeadwear)
const wearableModifiers = computed(() => props.wearableModifiersOverride ?? headwear.value.presetWearableModifiers)
</script>










<template>
  <ArmorItemCard
    :armor-modifiers-override="armorModifiers"
    :display-empty-lines="displayEmptyLines"
    :include-mods-and-content="includeModsAndContent"
    :is-base-item="isBaseItem"
    :item="headwear"
    :wearable-modifiers-override="wearableModifiers"
  >
    <Tooltip
      v-if="!isBaseItem && hasRicochetChance"
      :tooltip="$t('caption.ricochetChance')"
      class="card-value"
      :class="{ 'headwear-item-card-bold': props.includeModsAndContent }"
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
  font-weight: bolder;
}
</style>