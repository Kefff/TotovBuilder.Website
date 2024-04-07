<template>
  <div
    v-if="item != null"
    class="stats"
  >
    <ItemStat :item="item">
      <component
        :is="specializedComponent"
        v-if="specializedComponent != null"
        :item="item"
      />
    </ItemStat>
  </div>
</template>

<script lang="ts" src="./StatsSelectorComponent.ts" />
<style scoped lang="css" src="./StatsSelectorComponent.css" />