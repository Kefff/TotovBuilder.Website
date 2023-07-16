<template>
  <slot name="button" />

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
    <div class="sidebar-option">
      <MerchantFilter
        v-model="globalFilter"
        @update:modelValue="() => hasChanged = true"
      />
    </div>
    <div class="sidebar-title merchant-items-title">
      <font-awesome-icon
        icon="shopping-basket"
        class="icon-before-text"
      />
      <span>{{ $t('caption.items') }}</span>
    </div>
    <div class="sidebar-option">
      <ItemFilterComponent
        v-model="globalFilter"
        @update:modelValue="() => hasChanged = true"
      />
    </div>
    <div class="merchant-items-options-save-button">
      <Button
        class="p-button-success"
        :disabled="!hasChanged"
        @click="save()"
      >
        <font-awesome-icon
          icon="save"
          class="icon-before-text"
        />
        <span>{{ $t('caption.save') }}</span>
      </Button>
    </div>
    <!-- </div> -->
  </Sidebar>
</template>

<script lang="ts" src="./MerchantItemsOptionsComponent.ts" />
<style scoped lang="css" src="./MerchantItemsOptionsComponent.css" />