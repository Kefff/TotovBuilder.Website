<template>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.verticalRecoil')">
        <font-awesome-icon
          icon="arrows-alt-v"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, verticalRecoil) }}</span>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.horizontalRecoil')">
        <font-awesome-icon
          icon="arrows-alt-h"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, horizontalRecoil) }}</span>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.ergonomics')">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, ergonomics) }}</span>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value-long">
      <Tooltip :tooltip="$t('caption.caliber')">
        <CustomIcon
          :icon="Images.caliber"
          position="before"
        >
          <div>
            {{ $t('caption.' + StringUtils.toLowerFirst(rangedWeapon.caliber)) }}
          </div>
        </CustomIcon>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value ranged-weapon-summary-fire-rate">
      <Tooltip :tooltip="$t('caption.fireRate')">
        <CustomIcon
          :icon="Images.fireRate"
          position="before"
        >
          <div>
            {{ $t('caption.fireRateValueShort', { fireRate: rangedWeapon.fireRate }) }}
          </div>
        </CustomIcon>
      </Tooltip>
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
import CustomIcon from '../CustomIconComponent.vue'

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
  white-space: nowrap;
}
</style>