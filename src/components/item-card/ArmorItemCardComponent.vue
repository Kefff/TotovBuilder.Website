<script setup lang="ts">
import { computed } from 'vue'
import { IArmor } from '../../models/item/IArmor'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import vueI18n from '../../plugins/vueI18n'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'
import WearableItemCard from './WearableItemCardComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    displayEmptyLines?: boolean,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    displayEmptyLines: true,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    isBaseItem: false,
    wearableModifiersOverride: undefined
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)

const armor = computed(() => props.item as IArmor)
const armorClass = computed(() => props.armorModifiersOverride?.armorClass ?? armor.value.presetArmorModifiers?.armorClass ?? armor.value.armorClass)
const comparisonItemInternal = computed(() => props.comparisonItem as IArmor | undefined)
const durability = computed(() => props.armorModifiersOverride?.durability ?? armor.value.presetArmorModifiers?.durability ?? armor.value.durability)
const isHeadwear = computed(() => _itemPropertiesService.isHeadwear(props.item))
const tooltipSuffix = computed(() => {
  if (!props.includeModsAndContent) {
    return ''
  } else if (props.includeModsAndContent && isHeadwear) {
    return vueI18n.t('caption.withMods')
  } else {
    return vueI18n.t('caption.frontPlate')
  }
})
</script>










<template>
  <div
    v-if="displayEmptyLines
      || (!isBaseItem && armorClass > 0)
      || (!isBaseItem && durability > 0)
      || $slots.slot != null"
    class="card-line card-line4"
  >
    <Tooltip
      v-if="!isBaseItem && durability > 0"
      :class="{ 'armor-item-card-bold': props.includeModsAndContent }"
      :tooltip="$t('caption.durability') + tooltipSuffix"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('durability', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="heart"
          class="icon-before-text armor-item-card-durability"
        />
        <span>{{ durability }}</span>
      </div>
    </Tooltip>
    <Tooltip
      v-if="!isBaseItem && armorClass > 0"
      :class="{ 'armor-item-card-bold': props.includeModsAndContent }"
      :tooltip="$t('caption.armorClass') + tooltipSuffix"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('armorClass', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ armorClass }}</span>
      </div>
    </Tooltip>
    <slot name="slot" />
  </div>
  <WearableItemCard
    :display-empty-lines="displayEmptyLines"
    :filter-and-sorting-data="filterAndSortingData"
    :include-mods-and-content="includeModsAndContent"
    :item="armor"
    :wearable-modifiers-override="wearableModifiersOverride"
  />
</template>










<style scoped>
.armor-item-card-bold {
  font-style: italic;
  font-weight: bolder;
}

.armor-item-card-durability {
  color: var(--error-color);
}
</style>