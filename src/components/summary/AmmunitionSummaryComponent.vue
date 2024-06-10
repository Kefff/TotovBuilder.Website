<template>
  <div class="option-entry">
    <div class="option-value">
      <span v-tooltip.top="$t('caption.fleshDamage')">{{ ammunition.fleshDamage }}</span>
      <div class="flesh-damage">
        <div v-tooltip.top="$t('caption.fleshDamage')">
          <font-awesome-icon
            icon="heart-broken"
            class="icon-after-text flesh-damage-color"
          />
        </div>
        <div
          v-if="canOneshot"
          v-tooltip.top="$t('caption.canOneshot')"
          class="flesh-damage-oneshot"
        >
          <font-awesome-icon
            icon="skull"
            class="flesh-damage-oneshot-icon"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.penetrationPower')"
      class="option-value"
    >
      <span>{{ ammunition.penetrationPower }}</span>
      <font-awesome-icon
        icon="bolt"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="ammunition-summary-penetrated-armor-list">
      <div
        v-for="c of ammunition.armorPenetrations.length"
        :key="c"
        v-tooltip.top="getArmorPenetrationTooltip(c, ammunition.armorPenetrations[c - 1])"
        class="ammunition-summary-penetrated-armor"
      >
        <div class="ammunition-summary-penetrated-armor-class">
          {{ c }}
        </div>
        <font-awesome-icon
          icon="award"
          :class="'ammunition-summary-penetrated-armor-icon armor-penetration' + ammunition.armorPenetrations[c - 1]"
        />
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.fragmentationChance !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ammunition.fragmentationChance !== 0"
        v-tooltip.top="$t('caption.fragmentationChance')"
      >
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.fragmentationChance, ammunition.fragmentationChance) }}</span>
        <font-awesome-icon
          icon="viruses"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.recoilModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ammunition.recoilModifierPercentage !== 0"
        v-tooltip.top="$t('caption.recoil')"
      >
        <span :class="StatsUtils.getValueColorClass(ammunition.recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, ammunition.recoilModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.accuracyModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="ammunition.accuracyModifierPercentage !== 0"
        v-tooltip.top="$t('caption.accuracy')"
      >
        <span :class="StatsUtils.getValueColorClass(ammunition.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, ammunition.accuracyModifierPercentage) }}
        </span>
        <font-awesome-icon
          icon="bullseye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IAmmunition } from '../../models/item/IAmmunition'
import { IItem } from '../../models/item/IItem'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import { ArmorUtils } from '../../utils/ArmorUtils'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

const ammunition = computed(() => props.item as IAmmunition)
const canOneshot = computed(() => ammunition.value.fleshDamage >= Services.get(TarkovValuesService).values.chestHp)

/**
 * Gets the tooltip for an armor penetration.
 * @param armorClass - Armor class penetrated.
 * @param penetration - Penetration value.
 * @returns Tooltip.
 */
function getArmorPenetrationTooltip(armorClass: number, penetration: number) {
  return ArmorUtils.getArmorPenetrationTooltip(armorClass, penetration)
}
</script>










<style scoped>
@import '../../css/armor-penetration.css';
@import '../../css/flesh-damage.css';
@import '../../css/icon.css';
@import '../../css/option.css';
@import '../../css/stats.css';

.ammunition-summary-penetrated-armor {
  align-items: center;
  display: flex;
  margin-right: 0.25rem;
}

.ammunition-summary-penetrated-armor:last-child {
  margin-right: 0;
}

.ammunition-summary-penetrated-armor-class {
  font-size: 0.75rem;
  text-align: right;
  width: 0.5rem;
}

.ammunition-summary-penetrated-armor-icon {
  margin-right: 0;
  width: 1rem;
}

.ammunition-summary-penetrated-armor-list {
  align-items: center;
  display: flex;
  width: 10.25rem;
  /* 6 penetrated armor of 1rem + 5 margins of 0.25rem + 6 armor classes of 0.5rem */
}

.ammunition-summary-oneshot {
  width: 0.25rem;
}

.ammunition-summary-oneshot-icon {
  font-size: 0.5rem;
  position: relative;
  right: 5px;
  top: 3px;
}
</style>