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
import ValueComparison from '../ValueComparisonComponent.vue'
import WearableItemCardInternal from './WearableItemCardInternalComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    isBaseItem?: boolean,
    armor: IArmor,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    isBaseItem: false,
    wearableModifiersOverride: undefined
  })

const _itemPropertiesService = Services.get(ItemPropertiesService)

const armorClass = computed(() => props.armorModifiersOverride?.armorClass ?? props.armor.presetArmorModifiers?.armorClass ?? props.armor.armorClass)
const comparisonArmor = computed(() => props.comparisonItem?.id !== props.armor.id ? props.comparisonItem as IArmor : undefined)
const durability = computed(() => props.armorModifiersOverride?.durability ?? props.armor.presetArmorModifiers?.durability ?? props.armor.durability)
const isHeadwear = computed(() => _itemPropertiesService.isHeadwear(props.armor))
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
  <Tooltip
    v-if="!isBaseItem
      && (durability !== 0
        || ((comparisonArmor?.presetArmorModifiers?.durability ?? comparisonArmor?.durability ?? 0) !== 0))"
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
    <ValueComparison
      v-if="comparisonArmor != null"
      :compare-to-value="comparisonArmor?.presetArmorModifiers?.durability ?? comparisonArmor?.durability"
      :current-value="durability"
      :is-percentage="false"
    />
  </Tooltip>
  <Tooltip
    v-if="!isBaseItem
      && (armorClass !== 0
        || ((comparisonArmor?.presetArmorModifiers?.armorClass ?? comparisonArmor?.armorClass ?? 0) !== 0))"
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
    <ValueComparison
      v-if="comparisonArmor != null"
      :compare-to-value="comparisonArmor?.presetArmorModifiers?.armorClass ?? comparisonArmor?.armorClass"
      :current-value="armorClass"
      :is-percentage="false"
    />
  </Tooltip>
  <WearableItemCardInternal
    :comparison-item="comparisonArmor"
    :filter-and-sorting-data="filterAndSortingData"
    :include-mods-and-content="includeModsAndContent"
    :wearable="armor"
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