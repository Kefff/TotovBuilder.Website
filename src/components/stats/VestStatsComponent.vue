<template>
  <ArmorStats :item="wearable" />
  <ContainerStats :item="wearable" />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IWearable } from '../../models/item/IWearable'
import { IItem } from '../../models/item/IItem'
import ArmorStats from './ArmorStatsComponent.vue'
import ContainerStats from './ContainerStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const wearable = computed(() => props.item as IWearable)
</script>










<style scoped>
@import '../../css/stats.css';
</style>