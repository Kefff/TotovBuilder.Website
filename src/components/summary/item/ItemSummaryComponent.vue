<template>
  <div class="option-line">
    <div class="option-entry">
      <div class="option-caption">
        {{ item.name }}
      </div>
    </div>
    <div class="option-entry">
      <div class="option-value-long">
        <Price
          v-if="price.valueInMainCurrency > 0"
          :price="price"
        />
      </div>
    </div>
    <slot />
    <div class="option-entry">
      <ItemIcon :item="item" />
    </div>
  </div>
</template>

<script lang="ts" src="./ItemSummaryComponent.ts" />
<style scoped lang="css" src="./ItemSummaryComponent.css" />