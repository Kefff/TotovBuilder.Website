<template>
  <div
    class="merchant-items-options-button"
    @click="display()"
  >
    <slot name="button">
      <Button
        v-tooltip.top="$t('caption.merchantItemsOptions')"
        class="p-button-text p-button-sm button-discreet"
      >
        <font-awesome-icon icon="user-tag" />
      </Button>
    </slot>
  </div>

  <Sidebar
    v-model:visible="sidebarVisible"
    position="right"
    style="width: auto"
    @hide="save()"
  >
    <div class="sidebar-title merchant-items-options-title">
      <font-awesome-icon
        icon="user-tag"
        class="icon-before-text"
      />
      <span>{{ $t('caption.merchants') }}</span>
    </div>
    <div class="sidebar-option">
      <MerchantFilter v-model="globalFilter" />
    </div>
    <div class="sidebar-title merchant-items-options-title">
      <font-awesome-icon
        icon="shopping-basket"
        class="icon-before-text"
      />
      <span>{{ $t('caption.items') }}</span>
    </div>
    <div class="sidebar-option">
      <ItemFilterComponent v-model="globalFilter" />
    </div>
  </Sidebar>
</template>

<script lang="ts" src="./MerchantItemsOptionsComponent.ts" />
<style scoped lang="css" src="./MerchantItemsOptionsComponent.css" />