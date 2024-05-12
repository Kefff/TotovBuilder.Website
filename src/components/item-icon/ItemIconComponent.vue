<template>
  <div class="item-icon">
    <img
      v-if="iconUrl != null"
      :src="iconUrl"
    >
    <div
      v-if="quantity != null && quantity > 1"
      class="item-icon-quantity"
    >
      {{ quantity }}
    </div>
  </div>
</template>

<script lang="ts" src="./ItemIconComponent.ts" />
<style scoped lang="css" src="./ItemIconComponent.css" />