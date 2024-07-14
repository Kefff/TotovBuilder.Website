<template>
  <div class="option-entry">
    <div
      class="option-value"
      :class="boldCssClass"
    >
      <Tooltip :tooltip="$t('caption.verticalRecoil') + (includeModsAndContent ? $t('caption.withMods') : '')">
        <font-awesome-icon
          icon="arrows-alt-v"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, verticalRecoil) }}</span>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div
      class="option-value"
      :class="boldCssClass"
    >
      <Tooltip :tooltip="$t('caption.horizontalRecoil') + (includeModsAndContent ? $t('caption.withMods') : '')">
        <font-awesome-icon
          icon="arrows-alt-h"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, horizontalRecoil) }}</span>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div
      class="option-value"
      :class="boldCssClass"
    >
      <Tooltip :tooltip="$t('caption.ergonomics') + (includeModsAndContent ? $t('caption.withMods') : '')">
        <font-awesome-icon
          icon="hand-paper"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, ergonomics) }}</span>
      </Tooltip>
    </div>
  </div>
  <div
    v-if="!isBaseItem"
    class="option-entry"
  >
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
  <div
    v-if="!isBaseItem"
    class="option-entry"
  >
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
    includeModsAndContent?: boolean,
    item: IItem,
    isBaseItem?: boolean,
    rangedWeaponsModifiersOverride?: IRangedWeaponModifiers,
    showEmptyEntries?: boolean
  }>(),
  {
    includeModsAndContent: false,
    isBaseItem: false,
    rangedWeaponsModifiersOverride: undefined,
    showEmptyEntries: true
  })

const boldCssClass = computed(() => props.includeModsAndContent ? 'ranged-weapon-summary-bold' : '')
const ergonomics = computed(() => props.rangedWeaponsModifiersOverride?.ergonomics ?? rangedWeapon.value.presetRangedWeaponModifiers?.ergonomics ?? rangedWeapon.value.ergonomics)
const horizontalRecoil = computed(() => props.rangedWeaponsModifiersOverride?.horizontalRecoil ?? rangedWeapon.value.presetRangedWeaponModifiers?.horizontalRecoil ?? rangedWeapon.value.horizontalRecoil)
const rangedWeapon = computed(() => props.item as IRangedWeapon)
const verticalRecoil = computed(() => props.rangedWeaponsModifiersOverride?.verticalRecoil ?? rangedWeapon.value.presetRangedWeaponModifiers?.verticalRecoil ?? rangedWeapon.value.verticalRecoil)
</script>










<style scoped>
@import '../../css/icon.css';
@import '../../css/option.css';

.ranged-weapon-summary-bold {
  font-weight: bold;
}

.ranged-weapon-summary-fire-rate {
  width: 6rem;
  white-space: nowrap;
}
</style>