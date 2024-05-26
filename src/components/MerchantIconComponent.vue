<template>
  <div class="merchant-icon">
    <img :src="Images[StringUtils.toCamelCase(merchant)]">
    <div
      v-if="merchantLevel > 0"
      class="merchant-icon-level"
    >
      {{ merchantLevel }}
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










<script setup lang="ts">
import Images from '../images'
import StringUtils from '../utils/StringUtils'

withDefaults(
  defineProps<{
    isBarter?: boolean,
    merchant: string,
    merchantLevel: number,
    requiresQuest?: boolean,
    showTooltip?: boolean
  }>(),
  {
    isBarter: false,
    requiresQuest: false,
    showTooltip: true
  })
</script>










<style scoped>
.merchant-icon {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: relative;
  /* Needed for the absolute positions of the badges stick to the merchant icon when scrolling in an overlay */
  width: 2rem;
}

.merchant-icon > img {
  border-color: var(--util-color);
  border-radius: 3px;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  width: 2rem;
}

.merchant-icon-barter-icon {
  align-items: center;
  color: var(--text-color);
  display: flex;
  font-size: 0.85rem;
  height: 1rem;
  justify-content: center;
  position: absolute;
  transform: translate(-0.5rem, 0.75rem);
  width: 1rem;
}

.merchant-icon-level {
  align-items: center;
  background-color: var(--primary-color);
  border-radius: 1rem;
  color: var(--text-color);
  display: flex;
  font-size: 0.8rem;
  height: 1rem;
  justify-content: center;
  position: absolute;
  transform: translate(1.5rem, 0.80rem);
  width: 1rem;
}

.merchant-icon-level > div {
  position: absolute;
  transform: translate(0, -0.050rem);
  width: 100%;
}

.merchant-icon-quest-icon {
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  display: flex;
  font-size: 0.85rem;
  height: 1rem;
  position: absolute;
  transform: translate(1.5rem, -1rem);
  width: 1rem;
}

.merchant-icon-quest-icon {
  color: var(--warning-color);
}
</style>