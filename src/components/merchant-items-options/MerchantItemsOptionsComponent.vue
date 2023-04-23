<template>
  <Button
    v-tooltip.top="$t('caption.merchantsOptions')"
    class="p-button-text p-button-sm button-discreet"
    @click="sidebarVisible = true"
  >
    <font-awesome-icon
      icon="user-tag"
    />
  </Button>

  <Sidebar
    v-model:visible="sidebarVisible"
    position="right"
    style="width: auto"
  >
    <div class="sidebar-title">
      <font-awesome-icon
        icon="user-tag"
        class="icon-before-text"
      />
      <span>{{ $t('caption.merchants') }}</span>
    </div>
    <div
      class="sidebar-option"
    >
      <MerchantFilter @has-saved="sidebarVisible = false" />
    </div>
  </Sidebar>
</template>

<script lang="ts" src="./MerchantItemsOptionsComponent.ts" />
<style scoped lang="css" src="./MerchantItemsOptionsComponent.css" />