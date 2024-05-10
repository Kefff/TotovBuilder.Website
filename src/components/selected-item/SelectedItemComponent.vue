<template>
  <div>
    <div
      v-if="item != null"
      class="selected-item"
    >
      <ItemIcon :item="item" />
      <div class="selected-item-name">
        {{ item.name }}
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
<style lang="css" src="./SelectedItemComponent.unscoped.css" />