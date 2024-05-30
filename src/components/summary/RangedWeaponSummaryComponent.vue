<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.caliber')"
      class="option-value-long custom-icon-after-text"
    >
      <div>{{ $t('caption.' + StringUtils.toLowerFirst(rangedWeapon.caliber)) }}</div>
      <img :src="Images.caliber">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.fireRate')"
      class="option-value fire-rate custom-icon-after-text"
    >
      <div>{{ $t('caption.fireRateValueShort', { fireRate: rangedWeapon.fireRate }) }}</div>
      <img :src="Images.fireRate">
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.verticalRecoil')"
      class="option-value"
    >
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, rangedWeapon.presetVerticalRecoil ?? rangedWeapon.verticalRecoil) }}</span>
      <font-awesome-icon
        icon="arrows-alt-v"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.horizontalRecoil')"
      class="option-value"
    >
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, rangedWeapon.presetHorizontalRecoil ?? rangedWeapon.horizontalRecoil) }}</span>
      <font-awesome-icon
        icon="arrows-alt-h"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.ergonomics')"
      class="option-value"
    >
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, rangedWeapon.presetErgonomics ?? rangedWeapon.ergonomics) }}</span>
      <font-awesome-icon
        icon="hand-paper"
        class="icon-after-text"
      />
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
  item: IItem,
}>()

const rangedWeapon = computed(() => props.item as IRangedWeapon)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';

.fire-rate {
  width: 6rem;
}
</style>