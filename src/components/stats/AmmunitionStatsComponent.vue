<script setup lang="ts">
import { computed } from 'vue'
import Images from '../../images'
import { IAmmunition } from '../../models/item/IAmmunition'
import { IItem } from '../../models/item/IItem'
import vueI18n from '../../plugins/vueI18n'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import StringUtils from '../../utils/StringUtils'
import CustomIcon from '../CustomIconComponent.vue'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const _chestHp = Services.get(TarkovValuesService).values.chestHp

const ammunition = computed(() => props.item as IAmmunition)
const canOneshot = computed(() => totalFleshDamage.value >= _chestHp)
const hasModifiers = computed(() =>
  ammunition.value.accuracyModifierPercentage !== 0
  || ammunition.value.durabilityBurnModifierPercentage !== 0
  || ammunition.value.heavyBleedingChance !== 0
  || ammunition.value.lightBleedingChance !== 0
  || ammunition.value.recoilModifier !== 0)
const totalFleshDamage = computed(() => ammunition.value.fleshDamage * ammunition.value.projectiles)
const fleshDamageText = computed(() =>
  ammunition.value.projectiles > 1
    ? `${ammunition.value.projectiles} x ${ammunition.value.fleshDamage} (${vueI18n.t('caption.total').toLocaleLowerCase()} : ${totalFleshDamage.value})`
    : ammunition.value.fleshDamage)
</script>










<template>
  <div class="stats-category">
    {{ $t('caption.ammunition') }}
  </div>
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
  </div>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="tablets"
          class="icon-before-text"
        />
        <span>{{ $t('caption.projectiles') }} :</span>
      </div>
      <div class="stats-value">
        {{ ammunition.projectiles }}
      </div>
    </div>
    <div
      v-if="ammunition.fragmentationChance > 0"
      class="stats-entry"
    >
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
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="wind"
          class="icon-before-text"
        />
        <span>{{ $t('caption.velocity') }} :</span>
      </div>
      <div class="stats-value">
        {{ ammunition.velocity }}m/s
      </div>
    </div>
    <div
      v-if="ammunition.subsonic"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="deaf"
          class="icon-before-text"
        />
        <span class="stats-value-positive">{{ $t('caption.subsonic') }}</span>
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.tracer || ammunition.blinding"
    class="stats-line"
  >
    <div
      v-if="ammunition.tracer"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="eye"
          class="icon-before-text"
        />
        <span class="stats-value-negative">{{ $t('caption.tracer') }}</span>
      </div>
    </div>
    <div
      v-if="ammunition.blinding"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="dizzy"
          class="icon-before-text"
        />
        <span class="stats-value-positive">{{ $t('caption.blinding') }}</span>
      </div>
    </div>
  </div>
  <div class="stats-category">
    {{ $t('caption.damageAndArmorPenetration') }}
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
      <div
        class="stats-value"
        style="display: flex;"
      >
        <Tooltip
          v-if="canOneshot"
          :tooltip="$t('caption.canOneshot')"
          class="ammunition-stats-oneshot"
        >
          <font-awesome-icon icon="skull" />
        </Tooltip>
        <span>
          {{ fleshDamageText }}
        </span>
      </div>
    </div>
    <div
      v-if="ammunition.penetratedArmorLevel > 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="award"
          class="icon-before-text"
        />
        <span>{{ $t('caption.armorPenetration') }} :</span>
      </div>
      <div class="stats-value">
        <Tooltip
          :tooltip="$t('caption.armorClassPenetration', { class: ammunition.penetratedArmorLevel })"
          class="ammunition-stats-penetrated-armor"
        >
          <font-awesome-icon
            icon="award"
            :class="`icon-before-text armor-penetration${ammunition.penetratedArmorLevel}`"
          />
          <span>{{ ammunition.penetratedArmorLevel }}</span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div class="stats-line">
    <div
      v-if="ammunition.penetrationPower > 0"
      class="stats-entry"
    >
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
        <font-awesome-icon
          icon="shield-virus"
          class="icon-before-text"
        />
        <span>{{ $t('caption.armorDamage') }} :</span>
      </div>
      <div class="stats-value">
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorDamagePercentage, ammunition.armorDamagePercentage) }}</span>
      </div>
    </div>
  </div>
  <div
    v-if="hasModifiers"
    class="stats-category"
  >
    {{ $t('caption.modifiers') }}
  </div>
  <div
    v-if="ammunition.recoilModifier !== 0 || ammunition.accuracyModifierPercentage !== 0"
    class="stats-line"
  >
    <div
      v-if="ammunition.recoilModifier !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-before-text"
        />
        <span>{{ $t('caption.recoilModifier') }} :</span>
      </div>
      <div class="stats-value">
        <span :class="StatsUtils.getValueColorClass(ammunition.recoilModifier, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifier, ammunition.recoilModifier) }}
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
        <span>{{ $t('caption.accuracyModifierPercentage') }} :</span>
      </div>
      <div class="stats-value">
        <span :class="StatsUtils.getValueColorClass(ammunition.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, ammunition.accuracyModifierPercentage) }}
        </span>
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.durabilityBurnModifierPercentage !== 0"
    class="stats-line"
  >
    <div
      v-if="ammunition.durabilityBurnModifierPercentage !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="fire"
          class="icon-before-text"
        />
        <span>{{ $t('caption.durabilityBurn') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ammunition.durabilityBurnModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.durabilityBurnModifierPercentage, ammunition.durabilityBurnModifierPercentage) }}
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.heavyBleedingChance !== 0 || ammunition.lightBleedingChance !== 0"
    class="stats-line"
  >
    <div
      v-if="ammunition.heavyBleedingChance !== 0"
      class="stats-entry"
    >
      <div class="stats-caption">
        <font-awesome-icon
          icon="tint"
          class="icon-before-text"
        />
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
        <font-awesome-icon
          icon="tint"
          class="icon-before-text"
        />
        <span>{{ $t('caption.lightBleeding') }} :</span>
      </div>
      <div :class="'stats-value ' + StatsUtils.getValueColorClass(ammunition.lightBleedingChance)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.bleedingChanceModifier, ammunition.lightBleedingChance) }}
      </div>
    </div>
  </div>
</template>










<style scoped>
.ammunition-stats-oneshot {
  margin-right: 0.5rem
}

.ammunition-stats-penetrated-armor {
  align-items: center;
  display: flex;
  margin-right: 0.25rem;
}

.ammunition-stats-penetrated-armor:last-child {
  margin-right: 0;
}
</style>