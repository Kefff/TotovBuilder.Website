<template>
  <div
    v-if="item.armorClass > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.armorClass > 0"
        v-tooltip.top="$t('caption.armorClass')"
      >
        <span>{{ item.armorClass }}</span>
        <font-awesome-icon
          icon="award"
          class="icon-after-text"
        />
      </div>
    </div>
  </div>
  <div
    v-if="item.durability > 0 || showEmptyEntries"
    class="option-entry"
  >
    <div class="option-value">
      <div
        v-if="item.durability > 0"
        v-tooltip.top="$t('caption.durability')"
      >
        <span>{{ item.durability }}</span>
        <font-awesome-icon
          icon="heart"
          class="icon-after-text durability"
        />
      </div>
    </div>
  </div>
  <WearableSummary
    :item="item"
    :show-empty-entries="showEmptyEntries"
  />
</template>

<script lang="ts" src="./ArmorSummaryComponent.ts" />
<style scoped lang="css" src="./ArmorSummaryComponent.css" />