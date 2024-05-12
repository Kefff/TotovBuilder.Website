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
    <template #header>
      <div class="sidebar-title">
        <div class="sidebar-title-icon">
          <font-awesome-icon icon="user-tag" />
        </div>
        <span>{{ $t('caption.merchants') }}</span>
      </div>
    </template>
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
  </Sidebar>
</template>

<script lang="ts" src="./MerchantItemsOptionsComponent.ts" />
<style scoped lang="css" src="./MerchantItemsOptionsComponent.css" />