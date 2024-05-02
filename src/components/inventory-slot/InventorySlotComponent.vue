<template>
  <div
    v-if="displayed"
    class="inventory-slot"
  >
    <Panel v-model:collapsed="collapsed">
      <template #header>
        <div
          class="inventory-slot-header"
          @click="toggle()"
        >
          <div class="inventory-slot-title">
            <font-awesome-icon
              v-if="collapsed"
              icon="angle-right"
              class="collapsable-icon-collapsed"
            />
            <font-awesome-icon
              v-else
              icon="angle-right"
              class="collapsable-icon-deployed"
            />
            <font-awesome-icon
              v-if="icon != null"
              :icon="icon"
              class="inventory-slot-icon"
            />
            <img
              v-else-if="customIconName != null"
              :src="Images[StringUtils.toCamelCase(customIconName)]"
              class="inventory-slot-custom-icon"
            >
            <span class="inventory-slot-caption">{{ $t('caption.slotType' + StringUtils.toUpperFirst(modelValue.typeId)) }}</span>
          </div>
          <div class="option-line">
            <div
              v-if="hasSummaryVerticalRecoil"
              v-tooltip.top="$t('caption.verticalRecoil')"
              class="inventory-slot-summary-value"
            >
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.verticalRecoil) }}</span>
              <font-awesome-icon
                icon="arrows-alt-v"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryHorizontalRecoil"
              v-tooltip.top="$t('caption.horizontalRecoil')"
              class="inventory-slot-summary-value"
            >
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.recoil, summary.recoil.horizontalRecoil) }}</span>
              <font-awesome-icon
                icon="arrows-alt-h"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryArmor"
              v-tooltip.top="$t('caption.armorClass')"
              class="inventory-slot-summary-value"
            >
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.armorClass, summary.armorModifiers.armorClass) }}</span>
              <font-awesome-icon
                icon="award"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryErgonomics"
              v-tooltip.top="$t('caption.ergonomics')"
              class="inventory-slot-summary-value"
            >
              <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomics, summary.ergonomics) }}</span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryErgonomicsModifierPercentage"
              v-tooltip.top="$t('caption.ergonomics')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.ergonomicsModifierPercentage, summary.wearableModifiers.ergonomicsModifierPercentage) }}
              </span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryMovementSpeedModifierPercentage"
              v-tooltip.top="$t('caption.movementSpeed')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.movementSpeedModifierPercentage, summary.wearableModifiers.movementSpeedModifierPercentage) }}
              </span>
              <font-awesome-icon
                icon="walking"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryTurningSpeedModifierPercentage"
              v-tooltip.top="$t('caption.turningSpeed')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedModifierPercentage)">
                {{ StatsUtils.getStandardDisplayValue(DisplayValueType.turningSpeedModifierPercentage, summary.wearableModifiers.turningSpeedModifierPercentage) }}
              </span>
              <font-awesome-icon
                icon="undo"
                class="icon-after-text"
              />
            </div>
            <div class="option-entry inventory-slot-summary-price">
              <InventoryPrice
                :inventory-price="summary.price"
                :is-build="false"
              />
            </div>
            <div v-tooltip.top="$t('caption.weight')">
              <div
                v-if="hasSummaryWeight"
                class="inventory-slot-weight"
              >
                <span>{{ StatsUtils.getStandardDisplayValue(DisplayValueType.weight, summary.weight) }}</span>
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-after-text"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="type != null">
        <Item
          v-for="(item, index) of items"
          :key="path + '_' + index"
          v-model="items[index]"
          :accepted-items="acceptedItems"
          :accepted-items-category-id="acceptedItemsCategoryId"
          :can-be-looted="type.canBeLooted"
          :path="path + '_' + index + '/' + itemPathPrefix + (item?.itemId ?? 'empty')"
          @update:model-value="onItemChanged(index)"
        />
      </div>
    </Panel>
  </div>
</template>

<script lang="ts" src="./InventorySlotComponent.ts" />
<style scoped lang="css" src="./InventorySlotComponent.css" />