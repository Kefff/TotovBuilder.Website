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
              v-else-if="customIcon != null"
              :src="'/assets/' + customIcon + '.webp'"
              class="inventory-slot-custom-icon"
            >
            <span class="inventory-slot-caption">{{ $t('caption.slotType' + StringUtils.toUpperFirst(modelValue.typeId)) }}</span>
          </div>
          <div class="option-line">
            <div
              v-if="ergonomics != null"
              v-tooltip.top="$t('caption.ergonomics')"
              class="inventory-slot-summary-value"
            >
              <span>{{ ergonomics }}</span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="ergonomicsPercentageModifier != null && ergonomicsPercentageModifier !== 0"
              v-tooltip.top="$t('caption.ergonomics')"
              class="inventory-slot-summary-value"
            >
              <span :class="StatsUtils.getValueColorClass(ergonomicsPercentageModifier)">
                {{ StatsUtils.getDisplayValue(ergonomicsPercentageModifier, true, true) }}
              </span>
              <font-awesome-icon
                icon="hand-paper"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="verticalRecoil != null"
              v-tooltip.top="$t('caption.verticalRecoil')"
              class="inventory-slot-summary-value"
            >
              <span>{{ verticalRecoil }}</span>
              <font-awesome-icon
                icon="arrows-alt-v"
                class="icon-after-text"
              />
            </div>
            <div
              v-if="horizontalRecoil != null"
              v-tooltip.top="$t('caption.horizontalRecoil')"
              class="inventory-slot-summary-value"
            >
              <span>{{ horizontalRecoil }}</span>
              <font-awesome-icon
                icon="arrows-alt-h"
                class="icon-after-text"
              />
            </div>
            <div class="option-entry inventory-slot-summary-price">
              <InventoryPrice :inventory-price="price" />
            </div>
            <div v-tooltip.top="$t('caption.weight')">
              <div
                v-if="weight !== 0"
                class="inventory-slot-weight"
              >
                <span>{{ weight.toFixed(3) }}</span>
                <font-awesome-icon
                  icon="weight-hanging"
                  class="icon-after-text"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <Item
        v-for="(item, index) of items"
        :key="path + '_' + index"
        v-model="items[index]"
        :accepted-items="acceptedItems"
        :category-ids="categoryIds"
        :can-be-looted="canBeLooted"
        :path="path + '_' + index + '/' + itemPathPrefix + (item?.itemId ?? 'empty')"
        @update:modelValue="onItemChanged(index)"
      />
    </Panel>
  </div>
</template>

<script lang="ts" src="./InventorySlotComponent.ts" />
<style scoped lang="css" src="./InventorySlotComponent.css" />