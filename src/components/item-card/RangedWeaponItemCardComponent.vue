<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IItem } from '../../models/item/IItem'
import { IRangedWeapon } from '../../models/item/IRangedWeapon'
import { IRangedWeaponModifiers } from '../../models/utils/IRangedWeaponModifiers'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    includeModsAndContent?: boolean,
    item: IItem,
    isBaseItem?: boolean,
    rangedWeaponsModifiersOverride?: IRangedWeaponModifiers
  }>(),
  {
    includeModsAndContent: false,
    isBaseItem: false,
    rangedWeaponsModifiersOverride: undefined
  })

const boldCssClass = computed(() => props.includeModsAndContent ? 'ranged-weapon-item-card-bold' : '')
const ergonomics = computed(() => props.rangedWeaponsModifiersOverride?.ergonomics ?? rangedWeapon.value.presetRangedWeaponModifiers?.ergonomics ?? rangedWeapon.value.ergonomics)
const horizontalRecoil = computed(() => props.rangedWeaponsModifiersOverride?.horizontalRecoil ?? rangedWeapon.value.presetRangedWeaponModifiers?.horizontalRecoil ?? rangedWeapon.value.horizontalRecoil)
const rangedWeapon = computed(() => props.item as IRangedWeapon)
const verticalRecoil = computed(() => props.rangedWeaponsModifiersOverride?.verticalRecoil ?? rangedWeapon.value.presetRangedWeaponModifiers?.verticalRecoil ?? rangedWeapon.value.verticalRecoil)
</script>










<template>
  <div class="card-line card-line4">
    <Tooltip
      :class="boldCssClass"
      :tooltip="$t('caption.verticalRecoil') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <font-awesome-icon
        icon="arrows-alt-v"
        class="icon-before-text"
      />
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, verticalRecoil) }}</span>
    </Tooltip>
    <Tooltip
      :class="boldCssClass"
      :tooltip="$t('caption.horizontalRecoil') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <font-awesome-icon
        icon="arrows-alt-h"
        class="icon-before-text"
      />
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, horizontalRecoil) }}</span>
    </Tooltip>
    <Tooltip
      :class="boldCssClass"
      :tooltip="$t('caption.ergonomics') + (includeModsAndContent ? $t('caption.withMods') : '')"
    >
      <font-awesome-icon
        icon="hand-paper"
        class="icon-before-text"
      />
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, ergonomics) }}</span>
    </Tooltip>
  </div>
  <div class="card-line card-line4">
    <Tooltip
      v-if="!isBaseItem"
      :tooltip="$t('caption.fireRate')"
    >
      <CustomIcon
        :icon="Images.fireRate"
        position="before"
      >
        <div class="ranged-weapon-item-card-no-wrap">
          {{ $t('caption.fireRateValueShort', { fireRate: rangedWeapon.fireRate }) }}
        </div>
      </CustomIcon>
    </Tooltip>
    <Tooltip
      v-if="!isBaseItem"
      :tooltip="$t('caption.caliber')"
      class="ranged-weapon-item-card-long"
    >
      <CustomIcon
        :icon="Images.caliber"
        position="before"
        class=""
      >
        <div class="ranged-weapon-item-card-no-wrap">
          {{ $t('caption.' + StringUtils.toLowerFirst(rangedWeapon.caliber)) }}
        </div>
      </CustomIcon>
    </Tooltip>
  </div>
</template>










<style scoped>
.ranged-weapon-item-card-bold {
  font-style: italic;
  font-weight: bold;
}

.ranged-weapon-item-card-long {
  grid-column: span 3;
}

.ranged-weapon-item-card-no-wrap {
  white-space: nowrap;
}

.ranged-weapon-item-card-fire-rate {
  display: flex;
  width: 100%;
}
</style>