<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.blindnessProtection"
        icon="low-vision"
        property="blindnessProtectionPercentage"
        :sorting-service="sortingService"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./EyewearOptionHeaderComponent.ts" />
<style scoped lang="css" src="./EyewearOptionHeaderComponent.css" />