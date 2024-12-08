<script setup lang="ts">
import { computed } from 'vue'
import { IAmmunition } from '../../models/item/IAmmunition'
import { IItem } from '../../models/item/IItem'
import vueI18n from '../../plugins/vueI18n'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = defineProps<{ item: IItem }>()

const _chestHp = Services.get(TarkovValuesService).values.chestHp

const ammunition = computed(() => props.item as IAmmunition)
const canOneshot = computed(() => totalFleshDamage.value >= _chestHp)
const totalFleshDamage = computed(() => ammunition.value.fleshDamage * ammunition.value.projectiles)
const tooltip = computed(() =>
  `${vueI18n.t('caption.fleshDamage')}${ammunition.value.projectiles > 1
    ? ` (${vueI18n.t('caption.total').toLocaleLowerCase()} : ${totalFleshDamage.value})`
    : ''}`)
</script>










<template>
  <div class="card-line card-line4">
    <div
      v-if="ammunition.fleshDamage > 0"
      class="ammunition-item-card-flesh-damage-group"
    >
      <Tooltip
        :tooltip="tooltip"
        class="ammunition-item-card-flesh-damage"
      >
        <div class="flesh-damage">
          <font-awesome-icon
            icon="heart-broken"
            class="icon-before-text flesh-damage-color"
          />
        </div>
        <span v-if="ammunition.projectiles > 1">
          {{ ammunition.projectiles }}
        </span>
        <span
          v-if="ammunition.projectiles > 1"
          class="ammunition-item-card-multiply"
        >x</span>
        <span>{{ ammunition.fleshDamage }}</span>
      </Tooltip>
      <div
        v-if="canOneshot"
        class="flesh-damage-oneshot"
      >
        <Tooltip :tooltip="$t('caption.canOneshot')">
          <font-awesome-icon
            icon="skull"
            class="flesh-damage-oneshot-icon"
          />
        </Tooltip>
      </div>
    </div>
    <Tooltip
      v-if="ammunition.penetratedArmorLevel > 0"
      :tooltip="$t('caption.armorClassPenetration', { class: ammunition.penetratedArmorLevel })"
    >
      <font-awesome-icon
        icon="award"
        :class="`icon-before-text armor-penetration${ammunition.penetratedArmorLevel}`"
      />
      <span>{{ ammunition.penetratedArmorLevel }}</span>
    </Tooltip>
    <Tooltip
      v-if="ammunition.penetrationPower > 0"
      :tooltip="$t('caption.penetrationPower')"
    >
      <font-awesome-icon
        icon="bolt"
        class="icon-before-text"
      />
      <span>{{ ammunition.penetrationPower }}</span>
    </Tooltip>
    <div class="ammunition-item-card-attributes">
      <Tooltip
        v-if="ammunition.subsonic"
        :tooltip="$t('caption.subsonic')"
      >
        <font-awesome-icon
          icon="deaf"
          :class="`icon-before-text`"
        />
      </Tooltip>
      <Tooltip
        v-if="ammunition.tracer"
        :tooltip="$t('caption.tracer')"
      >
        <font-awesome-icon
          icon="eye"
          :class="`icon-before-text`"
        />
      </Tooltip>
      <Tooltip
        v-if="ammunition.blinding"
        :tooltip="$t('caption.blinding')"
      >
        <font-awesome-icon
          icon="dizzy"
          :class="`icon-before-text`"
        />
      </Tooltip>
    </div>
  </div>
  <div class="card-line card-line4">
    <Tooltip
      v-if="ammunition.fragmentationChance !== 0"
      :tooltip="$t('caption.fragmentationChance')"
    >
      <font-awesome-icon
        icon="viruses"
        class="icon-before-text"
      />
      <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.fragmentationChance, ammunition.fragmentationChance) }}</span>
    </Tooltip>
    <Tooltip
      v-if="ammunition.recoilModifier !== 0"
      :tooltip="$t('caption.recoil')"
    >
      <font-awesome-icon
        icon="arrows-alt"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(ammunition.recoilModifier, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifier, ammunition.recoilModifier) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="ammunition.accuracyModifierPercentage !== 0"
      :tooltip="$t('caption.accuracy')"
    >
      <font-awesome-icon
        icon="bullseye"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(ammunition.accuracyModifierPercentage)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, ammunition.accuracyModifierPercentage) }}
      </span>
    </Tooltip>
    <Tooltip
      v-if="ammunition.durabilityBurnModifierPercentage !== 0"
      :tooltip="$t('caption.durabilityBurn')"
    >
      <font-awesome-icon
        icon="fire"
        class="icon-before-text"
      />
      <span :class="StatsUtils.getValueColorClass(ammunition.durabilityBurnModifierPercentage, true)">
        {{ StatsUtils.getStandardDisplayValue(DisplayValueType.durabilityBurnModifierPercentage, ammunition.durabilityBurnModifierPercentage) }}
      </span>
    </Tooltip>
  </div>
</template>










<style scoped>
.ammunition-item-card-attributes {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.ammunition-item-card-flesh-damage {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
}

.ammunition-item-card-flesh-damage-group {
  position: relative;
}

.ammunition-item-card-multiply {
  font-size: 0.75rem;
  margin-left: 0.125rem;
  margin-right: 0.125rem;
}

.ammunition-item-card-oneshot {
  width: 0.25rem;
}

.ammunition-item-card-oneshot-icon {
  font-size: 0.5rem;
  position: relative;
  right: 5px;
  top: 3px;
}
</style>