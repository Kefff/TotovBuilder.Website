<template>
  <div>
    <div
      v-if="modelValue != null"
      class="selected-item"
    >
      <ItemIcon :item="modelValue" />
      <div class="selected-item-name">
        {{ modelValue.name }}
      </div>
    </div>
    <div
      v-else
      class="placeholder"
    >
      <font-awesome-icon
        icon="plus"
        class="placeholder-icon"
      />
      <span class="placeholder-text">{{ $t('caption.selectItem') }}</span>
    </div>
  </div>
</template>

<script lang="ts" src="./SelectedItemComponent.ts" />
<style scoped lang="css" src="./SelectedItemComponent.css" />