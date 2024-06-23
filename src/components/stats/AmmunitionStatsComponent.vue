<template>
  <div class="stats-line">
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
        {{ $t('caption.' + StringUtils.toLowerFirst(ammunition.caliber)) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.projectiles') }} :</span>
      </div>
      <div class="stats-value">
        {{ ammunition.projectiles }}
      </div>
    </div>
    <div
      v-if="ammunition.velocity !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.velocity') }} :</span>
      </div>
      <div class="stats-value">
        {{ ammunition.velocity }}m/s
      </div>
    </div>
    <div
      v-if="ammunition.durabilityBurnModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.durabilityBurn') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ammunition.durabilityBurnModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.durabilityBurnModifierPercentage, ammunition.durabilityBurnModifierPercentage) }}
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text flesh-damage">
          <div>
            <font-awesome-icon
              icon="heart-broken"
              class="flesh-damage-color"
            />
          </div>
        </div>
        <span>{{ $t('caption.fleshDamage') }} :</span>
      </div>
      <div class="stats-value">
        <Tooltip
          v-if="canOneshot"
          :tooltip="$t('caption.canOneshot')"
          class="ammunition-stats-oneshot"
        >
          <font-awesome-icon icon="skull" />
        </Tooltip>
        <span>
          {{ ammunition.fleshDamage }}
        </span>
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="bolt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.penetrationPower') }} :</span>
      </div>
      <div class="stats-value">
        {{ ammunition.penetrationPower }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.armorDamage') }} :</span>
      </div>
      <div class="stats-value">
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorDamagePercentage, ammunition.armorDamagePercentage) }}</span>
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="viruses"
          class="icon-before-text"
        />
        <span>{{ $t('caption.fragmentationChance') }} :</span>
      </div>
      <div class="stats-value">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.fragmentationChance, ammunition.fragmentationChance) }}
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.armorPenetrations.length > 0"
    class="stats-line"
  >
    <div
      v-for="c of ammunition.armorPenetrations.length"
      :key="c"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ $t('caption.armorClassPenetration', { class: c }) }} :</span>
      </div>
      <div class="stats-value">
        <Tooltip :tooltip="getArmorPenetrationTooltip(c, ammunition.armorPenetrations[c - 1])">
          <span :class="'armor-penetration' + ammunition.armorPenetrations[c - 1]">
            {{ ammunition.armorPenetrations[c - 1] }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.recoilModifierPercentage !== 0 || ammunition.accuracyModifierPercentage !== 0 || ammunition.heavyBleedingChance !== 0 || ammunition.lightBleedingChance !== 0"
    class="stats-line"
  >
    <div
      v-if="ammunition.recoilModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.recoil') }} :</span>
      </div>
      <div class="stats-value">
        <span :class="StatsUtils.getValueColorClass(ammunition.recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, ammunition.recoilModifierPercentage) }}
        </span>
      </div>
    </div>
    <div
      v-if="ammunition.accuracyModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="bullseye"
          class="icon-before-text"
        />
        <span>{{ $t('caption.accuracy') }} :</span>
      </div>
      <div class="stats-value">
        <span :class="StatsUtils.getValueColorClass(ammunition.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, ammunition.accuracyModifierPercentage) }}
        </span>
      </div>
    </div>
    <div
      v-if="ammunition.heavyBleedingChance !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.heavyBleeding') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ammunition.heavyBleedingChance)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.bleedingChanceModifier, ammunition.heavyBleedingChance) }}
      </div>
    </div>
    <div
      v-if="ammunition.lightBleedingChance !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.lightBleeding') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ammunition.lightBleedingChance)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.bleedingChanceModifier, ammunition.lightBleedingChance) }}
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.tracer || ammunition.subsonic || ammunition.blinding"
    class="stats-line"
  >
    <div
      v-if="ammunition.tracer"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span class="stats-value-negative">{{ $t('caption.tracer') }}</span>
      </div>
    </div>
    <div
      v-if="ammunition.subsonic"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span class="stats-value-positive">{{ $t('caption.subsonic') }}</span>
      </div>
    </div>
    <div
      v-if="ammunition.blinding"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span class="stats-value-positive">{{ $t('caption.blinding') }}</span>
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IAmmunition } from '../../models/item/IAmmunition'
import { IItem } from '../../models/item/IItem'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import { ArmorUtils } from '../../utils/ArmorUtils'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'
import CustomIcon from '../CustomIconComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const canOneshot = computed(() => ammunition.value.fleshDamage >= Services.get(TarkovValuesService).values.chestHp)
const ammunition = computed(() => props.item as IAmmunition)

/**
 * Gets the tooltip for an armor penetration.
 * @param armorClass - Armor class penetrated.
 * @param penetration - Penetration value.
 * @returns Tooltip.
 */
function getArmorPenetrationTooltip(armorClass: number, penetration: number): string {
  return ArmorUtils.getArmorPenetrationTooltip(armorClass, penetration)
}
</script>










<style scoped>
@import '../../css/armor-penetration.css';
@import '../../css/flesh-damage.css';
@import '../../css/icon.css';
@import '../../css/stats.css';

.ammunition-stats-oneshot {
  margin-right: 0.5rem
}
</style>