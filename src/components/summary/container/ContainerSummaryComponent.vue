<template>
  <div class="option-entry">
    <div
      v-tooltip.top="$t('caption.capacity')"
      class="option-value"
    >
      <span>{{ item.capacity }}</span>
      <font-awesome-icon
        icon="box-open"
        class="icon-after-text"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ContainerSummaryComponent.ts" />
<style scoped lang="css" src="./ContainerSummaryComponent.css" />