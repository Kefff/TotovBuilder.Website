<template>
  <ArmorStats :item="headwear" />
</template>










<script setup lang="ts">
import { computed } from 'vue'
import { IHeadwear } from '../../models/item/IHeadwear'
import { IItem } from '../../models/item/IItem'
import ArmorStats from './ArmorStatsComponent.vue'

const props = defineProps<{
  item: IItem
}>()

const headwear = computed(() => props.item as IHeadwear)
</script>










<style scoped>
@import '../../css/stats.css';
</style>