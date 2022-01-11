<template>
  <div class="selected-item-summary">
    <div class="option-line">
      <slot />
      <div class="selected-item-summary-right">
        <div>
          <div
            v-if="price.missingPrice"
            v-tooltip.top="$t('message.missingPrice')"
            class="selected-item-summary-price-missing-price-icon"
          >
            <font-awesome-icon icon="exclamation-triangle" />
          </div>
          <Price
            v-if="preset === undefined && price.price.valueInMainCurrency > 0"
            :price="price.price"
          />
          <div
            v-tooltip.top="$t('caption.weight')"
            class="selected-item-summary-weight"
          >
            <span>{{ weight.weight.toFixed(3) }}</span>
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-after-text"
            />
          </div>
        </div>
        <div>
          <Price
            v-if="preset === undefined && price.unitPrice.valueInMainCurrency !== price.price.valueInMainCurrency"
            :price="price.unitPrice"
            :show-merchant-icon="false"
            :tooltip-suffix="' (' + $t('caption.perUnit') + ')'"
            class="selected-item-summary-price-per-unit"
          />
          <div
            v-if="weight.unitWeight !== weight.weight"
            v-tooltip.top="$t('caption.weight') + ' (' + $t('caption.perUnit') + ')'"
            class="selected-item-summary-weight"
          >
            <span>{{ weight.unitWeight.toFixed(3) }}</span>
            <font-awesome-icon
              icon="weight-hanging"
              class="icon-after-text"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./SelectedItemSummaryComponent.ts" />
<style scoped lang="css" src="./SelectedItemSummaryComponent.css" />