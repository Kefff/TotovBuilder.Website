<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import { IArmorModifiers } from '../../models/utils/IArmorModifiers'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { IWearableModifiers } from '../../models/utils/IWearableModifiers'
import StatsUtils from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ArmorItemCardInternal from './ArmorItemCardInternalComponent.vue'

const props = withDefaults(
  defineProps<{
    armorModifiersOverride?: IArmorModifiers,
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    includeModsAndContent?: boolean,
    item: IItem,
    wearableModifiersOverride?: IWearableModifiers
  }>(),
  {
    armorModifiersOverride: undefined,
    comparisonItem: undefined,
    filterAndSortingData: undefined,
    includeModsAndContent: false,
    wearableModifiersOverride: undefined
  })

const headwear = computed(() => props.item as IHeadwear)

const { isSmartphonePortrait } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    class="card-line"
    :class="{
      'card-line3': isSmartphonePortrait,
      'card-line4': !isSmartphonePortrait
    }"
  >
    <ArmorItemCardInternal
      :armor-modifiers-override="armorModifiersOverride"
      :armor="headwear"
      :comparison-item="comparisonItem"
      :filter-and-sorting-data="filterAndSortingData"
      :include-mods-and-content="includeModsAndContent"
      :wearable-modifiers-override="wearableModifiersOverride"
    />
    <Tooltip
      v-if="headwear.ricochetChance != null"
      :tooltip="$t('caption.ricochetChance')"
      :class="[
        includeModsAndContent ? 'headwear-item-card-bold' : undefined,
        StatsUtils.getSortedPropertyColorClass('ricochetChance', filterAndSortingData)
      ]"
    >
      <CustomIcon
        :icon="Images.ricochet"
        position="before"
      >
        <span :class="`headwear-item-card-ricochet-chance-${headwear.ricochetChance.toLowerCase()}`">
          {{ $t(`caption.${headwear.ricochetChance.toLowerCase()}`) }}
        </span>
      </CustomIcon>
    </Tooltip>
    <Tooltip
      v-if="headwear.deafening != null"
      :tooltip="$t('caption.deafening')"
      :class="includeModsAndContent ? 'headwear-item-card-bold' : undefined"
    >
      <font-awesome-icon
        icon="deaf"
        class="icon-before-text"
      />
      <span :class="`headwear-item-card-deafening-${headwear.deafening.toLowerCase()}`">
        {{ $t(`caption.${headwear.deafening.toLowerCase()}`) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="headwear.blocksHeadphones"
      :tooltip="$t('caption.blocksHeadphones')"
    >
      <font-awesome-icon
        icon="volume-mute"
        class="icon-before-text headwear-item-card-deafening-blocks-headphones"
      />
    </Tooltip>
  </div>
</template>










<style scoped>
.headwear-item-card-deafening-blocks-headphones {
  color: var(--danger-color);
}

.headwear-item-card-deafening-high {
  color: var(--danger-color);
}

.headwear-item-card-deafening-medium {
  color: var(--warning-color);
}

.headwear-item-card-deafening-low {
  color: rgb(255, 225, 100);
}

.headwear-item-card-ricochet-chance-high {
  color: var(--success-color);
}

.headwear-item-card-ricochet-chance-medium {
  color: rgb(255, 225, 100);
}

.headwear-item-card-ricochet-chance-low {
  color: var(--danger-color);
}

.headwear-item-card-bold {
  font-style: italic;
  font-weight: bolder;
}
</style>