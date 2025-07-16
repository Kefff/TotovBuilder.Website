<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IMeleeWeapon } from '../../models/item/IMeleeWeapon'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import { ItemPropertiesService } from '../../services/ItemPropertiesService'
import Services from '../../services/repository/Services'
import StatsUtils from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'

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

const _itemPropertiesService = Services.get(ItemPropertiesService)

const comparisonMeleeWeapon = computed(() =>
  props.comparisonItem != null
    && _itemPropertiesService.isMeleeWeapon(props.comparisonItem)
    && props.comparisonItem?.id !== props.item.id
    ? props.comparisonItem as IMeleeWeapon
    : undefined)
const meleeWeapon = computed(() => props.item as IMeleeWeapon)

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
      <ValueComparison
        v-if="comparisonMeleeWeapon != null"
        :compare-to-value="comparisonMeleeWeapon?.chopDamage"
        :current-value="meleeWeapon.chopDamage"
      />
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
      <ValueComparison
        v-if="comparisonMeleeWeapon != null"
        :compare-to-value="comparisonMeleeWeapon?.stabDamage"
        :current-value="meleeWeapon.stabDamage"
      />
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
      <ValueComparison
        v-if="comparisonMeleeWeapon != null"
        :compare-to-value="comparisonMeleeWeapon?.hitRadius"
        :current-value="meleeWeapon.hitRadius"
        :round-decimal-count="1"
        suffix=" m"
      />
    </Tooltip>
  </div>
</template>