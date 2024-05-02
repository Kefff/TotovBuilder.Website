<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption custom-icon-before-text">
        <img :src="Images.caliber">
        <span>{{ $t('caption.caliber') }} :</span>
      </div>
      <div class="stats-value">
        {{ $t('caption.' + StringUtils.toLowerFirst(item.caliber)) }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.projectiles') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.projectiles }}
      </div>
    </div>
    <div
      v-if="item.velocity !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.velocity') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.velocity }}m/s
      </div>
    </div>
    <div
      v-if="item.durabilityBurnModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.durabilityBurn') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.durabilityBurnModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.durabilityBurnModifierPercentage, item.durabilityBurnModifierPercentage) }}
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
          <div
            v-if="canOneshot"
            v-tooltip.right="$t('caption.canOneshot')"
            class="flesh-damage-oneshot"
          >
            <font-awesome-icon
              icon="skull"
              class="flesh-damage-oneshot-icon"
            />
          </div>
        </div>
        <span>{{ $t('caption.fleshDamage') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.fleshDamage }}
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
        {{ item.penetrationPower }}
      </div>
    </div>
    <div class="stats-entry">
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.armorDamage') }} :</span>
      </div>
      <div class="stats-value">
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorDamagePercentage, item.armorDamagePercentage) }}</span>
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
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.fragmentationChance, item.fragmentationChance) }}
      </div>
    </div>
  </div>
  <div
    v-if="item.armorPenetrations.length > 0"
    class="stats-line"
  >
    <div
      v-for="c of item.armorPenetrations.length"
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
      <div
        v-tooltip.top="getArmorPenetrationTooltip(c, item.armorPenetrations[c - 1])"
        class="stats-value"
      >
        <span :class="'armor-penetration' + item.armorPenetrations[c - 1]">{{ item.armorPenetrations[c - 1] }}<span /></span>
      </div>
    </div>
  </div>
  <div
    v-if="item.recoilModifierPercentage !== 0 || item.accuracyModifierPercentage !== 0 || item.heavyBleedingChance !== 0 || item.lightBleedingChance !== 0"
    class="stats-line"
  >
    <div
      v-if="item.recoilModifierPercentage !== 0"
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
        <span :class="StatsUtils.getValueColorClass(item.recoilModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifierPercentage, item.recoilModifierPercentage) }}
        </span>
      </div>
    </div>
    <div
      v-if="item.accuracyModifierPercentage !== 0"
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
        <span :class="StatsUtils.getValueColorClass(item.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, item.accuracyModifierPercentage) }}
        </span>
      </div>
    </div>
    <div
      v-if="item.heavyBleedingChance !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.heavyBleeding') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.heavyBleedingChance)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.bleedingChanceModifier, item.heavyBleedingChance) }}
      </div>
    </div>
    <div
      v-if="item.lightBleedingChance !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span>{{ $t('caption.lightBleeding') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(item.lightBleedingChance)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.bleedingChanceModifier, item.lightBleedingChance) }}
      </div>
    </div>
  </div>
  <div
    v-if="item.tracer || item.subsonic || item.blinding"
    class="stats-line"
  >
    <div
      v-if="item.tracer"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span class="stats-value-negative">{{ $t('caption.tracer') }}</span>
      </div>
    </div>
    <div
      v-if="item.subsonic"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span class="stats-value-positive">{{ $t('caption.subsonic') }}</span>
      </div>
    </div>
    <div
      v-if="item.blinding"
      class="stats-entry"
    >
      <div class="stats-caption">
        <div class="icon-before-text" />
        <span class="stats-value-positive">{{ $t('caption.blinding') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./AmmunitionStatsComponent.ts" />
<style scoped lang="css" src="./AmmunitionStatsComponent.css" />