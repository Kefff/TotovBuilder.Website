<template>
  <div class="option-entry">
    <div class="option-value">
      <span v-tooltip.top="$t('caption.fleshDamage')">{{ item.fleshDamage }}</span>
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
      <span>{{ item.penetrationPower }}</span>
      <font-awesome-icon
        icon="bolt"
        class="icon-after-text"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="penetrated-armor-list">
      <div
        v-for="c of item.armorPenetrations.length"
        :key="c"
        v-tooltip.top="getArmorPenetrationTooltip(c, item.armorPenetrations[c - 1])"
        class="penetrated-armor"
      >
        <div class="penetrated-armor-class">
          {{ c }}
        </div>
        <font-awesome-icon
          icon="award"
          :class="'penetrated-armor-icon armor-penetration' + item.armorPenetrations[c - 1]"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.fragmentationChancePercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.fragmentationChancePercentage !== 0"
        v-tooltip.top="$t('caption.fragmentationChance')"
      >
        <span>{{ StatsUtils.getPercentageDisplayValue(item.fragmentationChancePercentage, false, 1) }}</span>
        <font-awesome-icon
          icon="viruses"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.recoilPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.recoilPercentageModifier !== 0"
        v-tooltip.top="$t('caption.recoil')"
      >
        <span :class="StatsUtils.getValueColorClass(item.recoilPercentageModifier, true)">
          {{ StatsUtils.getPercentageDisplayValue(item.recoilPercentageModifier, true, 1) }}
        </span>
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.accuracyPercentageModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.accuracyPercentageModifier !== 0"
        v-tooltip.top="$t('caption.accuracy')"
      >
        <span :class="StatsUtils.getValueColorClass(item.accuracyPercentageModifier)">
          {{ StatsUtils.getPercentageDisplayValue(item.accuracyPercentageModifier, true, 1) }}
        </span>
        <font-awesome-icon
          icon="bullseye"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./AmmunitionSummaryComponent.ts" />
<style scoped lang="css" src="./AmmunitionSummaryComponent.css" />