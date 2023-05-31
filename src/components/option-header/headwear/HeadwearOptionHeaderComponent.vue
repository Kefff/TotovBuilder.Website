<template>
  <ArmorOptionHeader
    v-model="sortingData"
    :custom-sorting-service="sortingService"
  />
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.ricochetChance"
        custom-icon="ricochet"
        property="ricochetChance"
        :sorting-service="sortingService"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./HeadwearOptionHeaderComponent.ts" />
<style scoped lang="css" src="./HeadwearOptionHeaderComponent.css" />