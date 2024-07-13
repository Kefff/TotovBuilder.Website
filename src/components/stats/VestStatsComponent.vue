<template>
  <ContainerStats :item="vest" />
  <ArmorStats :item="vest" />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IItem } from '../../models/item/IItem'
import { IVest } from '../../models/item/IVest'
import ArmorStats from './ArmorStatsComponent.vue'
import ContainerStats from './ContainerStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const vest = computed(() => props.item as IVest)
</script>










<style scoped>
@import '../../css/stats.css';
</style>