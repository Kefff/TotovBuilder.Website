<script setup lang="ts">
import { computed } from 'vue'
import { IAmmunition } from '../../models/item/IAmmunition'
import { IItem } from '../../models/item/IItem'
import ItemFilterAndSortingData from '../../models/utils/ItemFilterAndSortingData'
import vueI18n from '../../plugins/vueI18n'
import { TarkovValuesService } from '../../services/TarkovValuesService'
import Services from '../../services/repository/Services'
import StatsUtils, { DisplayValueType } from '../../utils/StatsUtils'
import WebBrowserUtils from '../../utils/WebBrowserUtils'
import Tooltip from '../TooltipComponent.vue'
import ValueComparison from '../ValueComparisonComponent.vue'

const props = withDefaults(
  defineProps<{
    comparisonItem?: IItem,
    filterAndSortingData?: ItemFilterAndSortingData,
    item: IItem
  }>(),
  {
    comparisonItem: undefined,
    filterAndSortingData: undefined
  })

const _chestHp = Services.get(TarkovValuesService).values.chestHp

const ammunition = computed(() => props.item as IAmmunition)
const canOneshot = computed(() => totalFleshDamage.value >= _chestHp)
const comparisonItemInternal = computed(() => props.comparisonItem?.id !== props.item.id ? props.comparisonItem as IAmmunition : undefined)
const showStatsComparison = computed(() => comparisonItemInternal.value != null && comparisonItemInternal.value.id !== props.item.id)
const totalFleshDamage = computed(() => ammunition.value.fleshDamage * ammunition.value.projectiles)
const tooltip = computed(() =>
  `${vueI18n.t('caption.fleshDamage')}${ammunition.value.projectiles > 1
    ? ` (${vueI18n.t('caption.total').toLocaleLowerCase()} : ${totalFleshDamage.value})`
    : ''}`)

const { isSmartphonePortrait } = WebBrowserUtils.getScreenSize()
</script>










<template>
  <div
    class="card-line"
    :class="{
      'card-line3': isSmartphonePortrait,
      'card-line4': !isSmartphonePortrait
    }"
  >
    <div
      v-if="ammunition.fleshDamage > 0 || ammunition.fleshDamage !== comparisonItemInternal?.fleshDamage"
      class="ammunition-item-card-flesh-damage-group"
    >
      <Tooltip :tooltip="tooltip">
        <div
          class="card-value ammunition-item-card-flesh-damage"
          :class="StatsUtils.getSortedPropertyColorClass('fleshDamage', filterAndSortingData)"
        >
          <div class="flesh-damage">
            <font-awesome-icon
              icon="heart-broken"
              class="icon-before-text flesh-damage-color"
            />
          </div>
          <span>{{ ammunition.fleshDamage }}</span>
          <div>
            <div>
              <span v-if="ammunition.projectiles > 1">
                {{ ammunition.projectiles }}
              </span>
              <span
                v-if="ammunition.projectiles > 1"
                class="ammunition-item-card-multiply"
              >
                x
              </span>
            </div>
            <ValueComparison
              v-if="showStatsComparison"
              :compare-to-value="comparisonItemInternal?.fleshDamage"
              :current-value="ammunition.fleshDamage"
              :is-percentage="false"
            />
          </div>
        </div>
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
    <div
      v-if="ammunition.penetrationPower > 0 || ammunition.penetrationPower !== comparisonItemInternal?.penetrationPower"
      class="ammunition-item-card-penetration-power"
    >
      <Tooltip :tooltip="$t('caption.armorClassPenetration', { class: ammunition.penetratedArmorLevel })">
        <div
          style="font-size: 0.875rem; display: flex; align-items: center; gap: 0.125rem"
          class="card-value"
          :class="StatsUtils.getSortedPropertyColorClass('penetratedArmorLevel', filterAndSortingData)"
        >
          <font-awesome-icon
            icon="award"
            :class="`armor-penetration${ammunition.penetratedArmorLevel}`"
          />
          <span>{{ ammunition.penetratedArmorLevel }}</span>
        </div>
      </Tooltip>
      <Tooltip
        v-if="ammunition.penetrationPower !== 0 && ammunition.penetrationPower != comparisonItemInternal?.penetrationPower"
        :tooltip="$t('caption.penetrationPower')"
      >
        <div
          class="card-value"
          :class="StatsUtils.getSortedPropertyColorClass('penetrationPower', filterAndSortingData)"
        >
          <font-awesome-icon
            icon="bolt"
            class="icon-before-text"
          />
          <span>{{ ammunition.penetrationPower }}</span>
        </div>
        <ValueComparison
          v-if="showStatsComparison"
          :compare-to-value="comparisonItemInternal?.penetrationPower"
          :current-value="ammunition.penetrationPower"
          :is-percentage="false"
        />
      </Tooltip>
    </div>
    <Tooltip
      v-if="ammunition.fragmentationChance > 0 || ammunition.fragmentationChance !== comparisonItemInternal?.fragmentationChance"
      :tooltip="$t('caption.fragmentationChance')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('fragmentationChance', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="viruses"
          class="icon-before-text"
        />
        <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.fragmentationChance, ammunition.fragmentationChance) }}</span>
      </div>
      <ValueComparison
        v-if="showStatsComparison"
        :compare-to-value="comparisonItemInternal?.fragmentationChance"
        :current-value="ammunition.fragmentationChance"
        :is-percentage="true"
      />
    </Tooltip>
    <Tooltip
      v-if="ammunition.recoilModifier !== 0 || ammunition.recoilModifier != comparisonItemInternal?.recoilModifier"
      :tooltip="$t('caption.recoilModifier')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('recoilModifier', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="arrows-alt"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ammunition.recoilModifier, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoilModifier, ammunition.recoilModifier) }}
        </span>
      </div>
      <ValueComparison
        v-if="showStatsComparison"
        :compare-to-value="comparisonItemInternal?.recoilModifier"
        :current-value="ammunition.recoilModifier"
        :invert="true"
      />
    </Tooltip>
    <Tooltip
      v-if="ammunition.accuracyModifierPercentage !== 0 || ammunition.accuracyModifierPercentage != comparisonItemInternal?.accuracyModifierPercentage"
      :tooltip="$t('caption.accuracyModifierPercentage')"
    >
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('accuracyModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="bullseye"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ammunition.accuracyModifierPercentage)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.accuracyModifierPercentage, ammunition.accuracyModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="showStatsComparison"
        :compare-to-value="comparisonItemInternal?.accuracyModifierPercentage"
        :current-value="ammunition.accuracyModifierPercentage"
        :is-percentage="true"
      />
    </Tooltip>
    <Tooltip
      v-if="ammunition.durabilityBurnModifierPercentage !== 0 || ammunition.durabilityBurnModifierPercentage != comparisonItemInternal?.durabilityBurnModifierPercentage"
      :tooltip="$t('caption.durabilityBurn')"
    >
      <div class="card-value">
        <font-awesome-icon
          icon="fire"
          class="icon-before-text"
        />
        <span :class="StatsUtils.getValueColorClass(ammunition.durabilityBurnModifierPercentage, true)">
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.durabilityBurnModifierPercentage, ammunition.durabilityBurnModifierPercentage) }}
        </span>
      </div>
      <ValueComparison
        v-if="showStatsComparison"
        :compare-to-value="comparisonItemInternal?.durabilityBurnModifierPercentage"
        :current-value="ammunition.durabilityBurnModifierPercentage"
        :invert="true"
        :is-percentage="true"
      />
    </Tooltip>
    <Tooltip :tooltip="$t('caption.velocity')">
      <div
        class="card-value"
        :class="StatsUtils.getSortedPropertyColorClass('accuracyModifierPercentage', filterAndSortingData)"
      >
        <font-awesome-icon
          icon="wind"
          class="icon-before-text"
        />
        <span>
          {{ StatsUtils.getStandardDisplayValue(DisplayValueType.velocity, ammunition.velocity) }}
        </span>
      </div>
    </Tooltip>
    <div
      v-if="ammunition.subsonic || ammunition.tracer || ammunition.blinding"
      class="ammunition-item-card-attributes"
    >
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
  align-items: center;
  display: flex;
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

.ammunition-item-card-penetration-power {
  align-items: center;
  display: flex;
  gap: 0.5rem
}
</style>