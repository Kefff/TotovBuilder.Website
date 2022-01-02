<template>
  <div class="stats-line">
    <div class="stats-entry">
      <div class="stats-caption">
        <font-awesome-icon
          icon="box-open"
          class="icon-before-text"
        />
        <span>{{ $t('caption.capacity') }} :</span>
      </div>
      <div class="stats-value">
        {{ item.capacity }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ContainerStatsComponent.ts" />
<style scoped lang="css" src="./ContainerStatsComponent.css" />