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
      class="option-value ranged-weapon-summary-fire-rate custom-icon-after-text"
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
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, verticalRecoil) }}</span>
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
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, horizontalRecoil) }}</span>
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
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, ergonomics) }}</span>
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
import { IRangedWeaponModifiers } from '../../models/utils/IRangedWeaponModifiers'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    rangedWeaponsModifiersOverride?: IRangedWeaponModifiers,
    showEmptyEntries?: boolean
  }>(),
  {
    rangedWeaponsModifiersOverride: undefined,
    showEmptyEntries: true
  })

const ergonomics = computed(() => props.rangedWeaponsModifiersOverride?.ergonomics ?? rangedWeapon.value.presetRangedWeaponModifiers?.ergonomics ?? rangedWeapon.value.ergonomics)
const horizontalRecoil = computed(() => props.rangedWeaponsModifiersOverride?.horizontalRecoil ?? rangedWeapon.value.presetRangedWeaponModifiers?.horizontalRecoil ?? rangedWeapon.value.horizontalRecoil)
const rangedWeapon = computed(() => props.item as IRangedWeapon)
const verticalRecoil = computed(() => props.rangedWeaponsModifiersOverride?.verticalRecoil ?? rangedWeapon.value.presetRangedWeaponModifiers?.verticalRecoil ?? rangedWeapon.value.verticalRecoil)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';

.ranged-weapon-summary-fire-rate {
  width: 6rem;
}
</style>