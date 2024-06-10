<template>
  <ContainerStats :item="backpack" />
  <WearableStats :item="backpack" />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IBackpack } from '../../models/item/IBackpack'
import { IItem } from '../../models/item/IItem'
import ContainerStats from './ContainerStatsComponent.vue'
import WearableStats from './WearableStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const backpack = computed(() => props.item as IBackpack)
</script>










<style scoped>
@import '../../css/stats.css';
</style>