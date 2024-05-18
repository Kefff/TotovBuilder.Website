<template>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="user-tag" />
    </div>
    <span>{{ $t('caption.merchants') }}</span>
  </div>
  <div class="sidebar-option">
    <MerchantFilter
      v-model:global-filter="globalFilter"
      @update:global-filter="() => hasChanged = true"
    />
  </div>
  <div class="sidebar-title">
    <div class="sidebar-title-icon">
      <font-awesome-icon icon="shopping-basket" />
    </div>
    <span>{{ $t('caption.items') }}</span>
  </div>
  <div class="sidebar-option">
    <ItemFilterComponent
      v-model:global-filter="globalFilter"
      @update:global-filter="() => hasChanged = true"
    />
  </div>
</template>

<script lang="ts" src="./MerchantItemsOptionsComponent.ts" />
<style scoped lang="css" src="./MerchantItemsOptionsComponent.css" />