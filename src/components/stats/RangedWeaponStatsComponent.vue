<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'
import CustomIcon from '../CustomIconComponent.vue'
import ModdableStats from './ModdableStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const ergonomics = computed(() => rangedWeapon.value.presetRangedWeaponModifiers?.ergonomics ?? rangedWeapon.value.ergonomics)
const horizontalRecoil = computed(() => rangedWeapon.value.presetRangedWeaponModifiers?.horizontalRecoil ?? rangedWeapon.value.horizontalRecoil)
const rangedWeapon = computed(() => props.item as IRangedWeapon)
const verticalRecoil = computed(() => rangedWeapon.value.presetRangedWeaponModifiers?.verticalRecoil ?? rangedWeapon.value.verticalRecoil)
</script>










<template>
  <div class="stats-category">
    {{ $t('caption.rangedWeapon') }}
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
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, verticalRecoil) }}
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
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, horizontalRecoil) }}
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
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, ergonomics) }}
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <CustomIcon
          :icon="Images.fireRate"
          position="before"
        >
          <span>{{ $t('caption.fireRate') }} :</span>
        </CustomIcon>
      </div>
      <div class="stats-value">
        {{ $t('caption.fireRateValue', { fireRate: rangedWeapon.fireRate }) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <CustomIcon
          :icon="Images.caliber"
          position="before"
        >
          <span>{{ $t('caption.caliber') }} :</span>
        </CustomIcon>
      </div>
      <div class="stats-value">
        {{ $t('caption.' + StringUtils.toLowerFirst(rangedWeapon.caliber)) }}
      </div>
    </div>
  </div>
  <ModdableStats :item="rangedWeapon" />
</template>