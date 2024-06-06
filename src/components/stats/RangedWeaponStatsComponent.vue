<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img :src="Images.caliber">
        <span>{{ $t('caption.caliber') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.' + StringUtils.toLowerFirst(rangedWeapon.caliber)) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img :src="Images.fireRate">
        <span>{{ $t('caption.fireRate') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.fireRateValue', { fireRate: rangedWeapon.fireRate }) }}
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt-v"
          class="icon-before-text"
        />
        <span>{{ $t('caption.verticalRecoil') }} :</span>
      </div>
      <div class="stats-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, rangedWeapon.presetVerticalRecoil ?? rangedWeapon.verticalRecoil) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt-h"
          class="icon-before-text"
        />
        <span>{{ $t('caption.horizontalRecoil') }} :</span>
      </div>
      <div class="stats-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, rangedWeapon.presetHorizontalRecoil ?? rangedWeapon.horizontalRecoil) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ $t('caption.ergonomics') }} :</span>
      </div>
      <div class="stats-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, rangedWeapon.presetErgonomics ?? rangedWeapon.ergonomics) }}
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'

const props = defineProps<{
  item: IItem
}>()

const rangedWeapon = computed(() => props.item as IRangedWeapon)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/stats.css';
</style>