<template>
  <div class="selected-item-summary">
    <div class="option-line">
      <slot />
      <div class="selected-item-summary-right">
        <div class="selected-item-summary-right-price">
          <div
            v-if="hasMissingPrice"
            v-tooltip.top="$t('message.itemWithMissingPrice')"
            class="selected-item-summary-price-missing-price-icon"
          >
            <font-awesome-icon icon="exclamation-triangle" />
          </div>
          <div
            v-if="price.unitPriceIgnoreStatus === IgnoredUnitPrice.manuallyIgnored"
            v-tooltip.top="$t('caption.ignoredPrice_' + price.unitPriceIgnoreStatus)"
            class="selected-item-summary-price-ignored-price-icon"
          >
            <font-awesome-icon icon="ban" />
          </div>
          <Price
            v-if="showPrice"
            :price="price.price"
          />
          <div
            v-tooltip.top="$t('caption.weight')"
            class="selected-item-summary-weight"
          >
            <div v-if="weight.weight > 0">
              <span>{{ StatsUtils.getDisplayValue(weight.weight, false, 3, 3) }}</span>
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-after-text"
              />
            </div>
          </div>
        </div>
        <div class="selected-item-summary-right-unit-price">
          <div class="selected-item-summary-price-per-unit">
            <Price
              v-if="showUnitPrice"
              :price="price.unitPrice"
              :show-merchant-icon="false"
              :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            />
          </div>
          <div
            v-tooltip.top="$t('caption.weight') + ' (' + $t('caption.perUnit') + ')'"
            class="selected-item-summary-weight selected-item-summary-weight-per-unit"
          >
            <div v-if="weight.unitWeight !== weight.weight">
              <span>{{ StatsUtils.getDisplayValue(weight.unitWeight, false, 3, 3,) }}</span>
              <font-awesome-icon
                icon="weight-hanging"
                class="icon-after-text"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./SelectedItemSummaryComponent.ts" />
<style scoped lang="css" src="./SelectedItemSummaryComponent.css" />