<template>
  <div class="option-entry">
    <div class="option-value">
      <OptionHeaderSortButton
        v-model="sortingData"
        caption-resource="caption.capacity"
        icon="box-open"
        property="capacity"
        :sorting-functions="sortingFunctions"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./ContainerOptionHeaderComponent.ts" />
<style scoped lang="css" src="./ContainerOptionHeaderComponent.css" />