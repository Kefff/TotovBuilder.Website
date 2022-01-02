<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.armorClass"
        icon="award"
        property="armorClass"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.durability"
        icon="heart"
        property="durability"
        :sorting-service="sortingService"
      />
    </div>
  </div>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ergonomics"
        icon="hand-paper"
        property="ergonomicsPercentageModifier"
        :sorting-service="sortingService"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ArmorOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ArmorOptionHeaderComponent.css" />