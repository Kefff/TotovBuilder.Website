<template>
  <div v-if="item != null && showStatsInternal">
    <Dialog
      v-model:visible="showStatsInternal"
      :closable="true"
      :close-on-escape="true"
      :dismissable-mask="true"
      :draggable="false"
      :header="item.name"
      :modal="true"
    >
      <template #header>
        <div class="stats-modal-title">
          <ItemIcon :item="item" />
          <span>{{ item.name }}</span>
        </div>
      </template>
      <ItemStat :item="item">
        <component
          :is="specializedComponent"
          v-if="specializedComponent != null"
          :item="item"
        />
      </ItemStat>
    </Dialog>
  </div>
</template>

<script lang="ts" src="./StatsSelectorComponent.ts" />
<style scoped lang="css" src="./StatsSelectorComponent.css" />