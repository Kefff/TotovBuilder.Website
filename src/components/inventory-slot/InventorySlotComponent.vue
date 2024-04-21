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
              <span>{{ StatsUtils.getDisplayValue(summary.recoil.verticalRecoil, false, 0) }}</span>
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
              <span>{{ StatsUtils.getDisplayValue(summary.recoil.horizontalRecoil, false, 0) }}</span>
              <font-awesome-icon
                icon="arrows-alt-h"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryErgonomics"
              v-tooltip.top="$t('caption.ergonomics')"
              class="inventory-slot-summary-value"
            >
              <span>{{ StatsUtils.getDisplayValue(summary.ergonomics, false, 0) }}</span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryErgonomicsPercentageModifier"
              v-tooltip.top="$t('caption.ergonomics')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.ergonomicsPercentageModifier)">
                {{ StatsUtils.getPercentageDisplayValue(summary.wearableModifiers.ergonomicsPercentageModifier, true) }}
              </span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryMovementSpeedPercentageModifier"
              v-tooltip.top="$t('caption.movementSpeed')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.movementSpeedPercentageModifier)">
                {{ StatsUtils.getPercentageDisplayValue(summary.wearableModifiers.movementSpeedPercentageModifier, true) }}
              </span>
              <font-awesome-icon
                icon="walking"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="hasSummaryTurningSpeedPercentageModifier"
              v-tooltip.top="$t('caption.turningSpeed')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(summary.wearableModifiers.turningSpeedPercentageModifier)">
                {{ StatsUtils.getPercentageDisplayValue(summary.wearableModifiers.turningSpeedPercentageModifier, true) }}
              </span>
              <font-awesome-icon
                icon="undo"
                class="icon-after-text"
              />
            </div>
            <div class="option-entry inventory-slot-summary-price">
              <InventoryPrice :inventory-price="summary.price" />
            </div>
            <div v-tooltip.top="$t('caption.weight')">
              <div
                v-if="hasSummaryWeight"
                class="inventory-slot-weight"
              >
                <span>{{ StatsUtils.getDisplayValue(summary.weight, false, 3, 3) }}</span>
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