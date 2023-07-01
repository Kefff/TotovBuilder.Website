<template>
  <div class="merchants-list">
    <div
      v-for="merchant of requiredMerchants"
      :key="merchant.name"
    >
      <MerchantIcon
        :merchant="merchant.name"
        :merchant-level="merchant.level"
        :show-tooltip="true"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ShoppingListMerchantsComponent.ts" />
<style scoped lang="css" src="./ShoppingListMerchantsComponent.css" />