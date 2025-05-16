<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import StatsUtils from '../../utils/StatsUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined
  })

const comparisonItemInternal = computed(() => props.comparisonItem as IMeleeWeapon | undefined)
const meleeWeapon = computed(() => props.item as IMeleeWeapon)
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip
      :tooltip="$t('caption.chopDamage')"
      :class="StatsUtils.getSortedPropertyColorClass('chopDamage', filterAndSortingData)"
    >
      <CustomIcon
        :icon="Images.chop"
        position="before"
      >
        <span>{{ meleeWeapon.chopDamage }}</span>
      </CustomIcon>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.stabDamage')"
      :class="StatsUtils.getSortedPropertyColorClass('stabDamage', filterAndSortingData)"
    >
      <CustomIcon
        :icon="Images.stab"
        position="before"
      >
        <span>{{ meleeWeapon.stabDamage }}</span>
      </CustomIcon>
    </Tooltip>
    <Tooltip
      :tooltip="$t('caption.hitRadius')"
      :class="StatsUtils.getSortedPropertyColorClass('hitRadius', filterAndSortingData)"
    >
      <div class="card-value">
        <font-awesome-icon
          icon="dot-circle"
          class="icon-before-text"
        />
        <span>{{ $t('caption.hitRadiusValue', { radius: meleeWeapon.hitRadius }) }}</span>
      </div>
    </Tooltip>
  </div>
</template>