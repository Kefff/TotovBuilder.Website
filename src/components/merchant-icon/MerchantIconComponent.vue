<template>
  <div
    v-tooltip.top="merchantTooltip"
    class="merchant-icon"
  >
    <img :src="Images[StringUtils.toCamelCase(merchant)]">
    <div
      v-if="merchantLevel > 0"
      class="merchant-icon-level"
    >
      <div>{{ merchantLevel }}</div>
    </div>
    <div
      v-if="isBarter"
      class="merchant-icon-barter-icon"
    >
      <font-awesome-icon icon="balance-scale" />
    </div>
    <div
      v-if="requiresQuest"
      class="merchant-icon-quest-icon"
    >
      <font-awesome-icon
        icon="lock"
        class="price-quest-icon"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./MerchantIconComponent.ts" />
<style scoped lang="css" src="./MerchantIconComponent.css" />