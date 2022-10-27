<template>
  <div class="item-icon">
    <img
      v-if="iconUrl != null"
      :src="iconUrl"
    >
  </div>
</template>

<script lang="ts" src="./ItemIconComponent.ts" />
<style scoped lang="css" src="./ItemIconComponent.css" />