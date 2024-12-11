<script setup lang="ts">
import { computed } from 'vue'
import { IAmmunition } from '../../models/item/IAmmunition'
import { IItem } from '../../models/item/IItem'
import vueI18n from '../../plugins/vueI18n'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import Tooltip from '../TooltipComponent.vue'

const props = withDefaults(
  defineProps<{
    item: IItem,
    showEmptyEntries?: boolean
  }>(),
  {
    showEmptyEntries: true
  })

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
  <div class="option-entry">
    <div class="option-value">
      <div class="ammunition-summary-flesh-damage-group">
        <Tooltip
          :tooltip="tooltip"
          class="ammunition-summary-flesh-damage"
        >
          <div class="flesh-damage">
            <font-awesome-icon
              icon="heart-broken"
              class="icon-before-text flesh-damage-color"
            />
          </div>
          <span>{{ ammunition.projectiles > 1 ? `${ammunition.projectiles} x ` : '' }} {{ ammunition.fleshDamage }}</span>
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
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip
        v-if="ammunition.penetratedArmorLevel > 0"
        :tooltip="$t('caption.armorClassPenetration', { class: ammunition.penetratedArmorLevel })"
        class="ammunition-summary-penetrated-armor"
      >
        <font-awesome-icon
          icon="award"
          :class="`icon-before-text armor-penetration${ammunition.penetratedArmorLevel}`"
        />
        <span>{{ ammunition.penetratedArmorLevel }}</span>
      </Tooltip>
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <Tooltip :tooltip="$t('caption.penetrationPower')">
        <font-awesome-icon
          icon="bolt"
          class="icon-before-text"
        />
        <span>{{ ammunition.penetrationPower }}</span>
      </Tooltip>
    </div>
  </div>
  <div
    v-if="ammunition.fragmentationChance !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="ammunition.fragmentationChance !== 0">
        <Tooltip :tooltip="$t('caption.fragmentationChance')">
          <font-awesome-icon
            icon="viruses"
            class="icon-before-text"
          />
          <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.fragmentationChance, ammunition.fragmentationChance) }}</span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.recoilModifier !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="ammunition.recoilModifier !== 0">
        <Tooltip :tooltip="$t('caption.recoilModifier')">
          <font-awesome-icon
            icon="arrows-alt"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(ammunition.recoilModifier, true)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifier, ammunition.recoilModifier) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
  <div
    v-if="ammunition.accuracyModifierPercentage !== 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div v-if="ammunition.accuracyModifierPercentage !== 0">
        <Tooltip :tooltip="$t('caption.accuracyModifierPercentage')">
          <font-awesome-icon
            icon="bullseye"
            class="icon-before-text"
          />
          <span :class="StatsUtils.getValueColorClass(ammunition.accuracyModifierPercentage)">
            {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, ammunition.accuracyModifierPercentage) }}
          </span>
        </Tooltip>
      </div>
    </div>
  </div>
</template>










<style scoped>
.ammunition-summary-flesh-damage {
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
}

.ammunition-summary-flesh-damage-group {
  position: relative;
}

.ammunition-summary-penetrated-armor {
  align-items: center;
  display: flex;
  margin-right: 0.25rem;
}

.ammunition-summary-penetrated-armor:last-child {
  margin-right: 0;
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