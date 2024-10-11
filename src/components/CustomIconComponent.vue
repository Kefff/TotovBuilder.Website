<script setup lang="ts">
type Position = 'after' | 'before'

defineProps<{
  icon: string,
  position: Position
}>()
</script>










<template>
  <div class="custom-icon">
    <img
      v-if="position === 'before'"
      :src="icon"
      class="icon-before-text"
    >
    <slot />
    <img
      v-if="position === 'after'"
      :src="icon"
      class="icon-after-text"
    >
  </div>
</template>










<style scoped>
@import '../css/icon.css';

.custom-icon {
  align-items: center;
  display: grid;
  grid-template-columns: min-content min-content;
}
</style>